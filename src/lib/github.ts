import { calculateAllScores } from "@/lib/scores";
import type {
  CommitData,
  ContributorData,
  RepoData,
  ScoreResult,
  TechSignals,
} from "@/lib/types";
import { buildEmptyTechSignals } from "@/lib/tech-stack";

/**
 * Extracts owner/repo from a GitHub URL or validates owner/repo format.
 * Handles http/https, trailing slashes, and various GitHub URL formats.
 *
 * @example
 * extractRepoPath("https://github.com/facebook/react") => "facebook/react"
 * extractRepoPath("https://github.com/vercel/next.js/") => "vercel/next.js"
 * extractRepoPath("facebook/react") => "facebook/react"
 * extractRepoPath("invalid-url") => null
 *
 * @param url - GitHub URL or owner/repo string
 * @returns owner/repo string or null if invalid
 */
export function extractRepoPath(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();

  // Check if it's already in owner/repo format
  if (/^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(trimmed)) {
    return trimmed;
  }

  // Try to parse as GitHub URL
  try {
    // Handle URLs without protocol
    let urlToParse = trimmed;
    if (!urlToParse.startsWith("http://") && !urlToParse.startsWith("https://")) {
      urlToParse = "https://" + urlToParse;
    }

    const url = new URL(urlToParse);

    // Check if it's a GitHub URL
    if (!url.hostname.includes("github.com")) {
      return null;
    }

    // Extract path and remove leading/trailing slashes
    const pathname = url.pathname.replace(/^\/|\/$/g, "");

    // Split by '/' and get first two parts (owner/repo)
    const parts = pathname.split("/").filter(Boolean);

    if (parts.length >= 2) {
      const owner = parts[0];
      const repo = parts[1];

      // Validate format
      if (/^[a-zA-Z0-9._-]+$/.test(owner) && /^[a-zA-Z0-9._-]+$/.test(repo)) {
        return `${owner}/${repo}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export type RepositoryBundle = {
  repo: RepoData & { license: string | null; createdAt: string };
  commits: CommitData[];
  contributors: ContributorData[];
  languages: Record<string, number>;
  releases: { tagName: string; publishedAt: string; name: string }[];
  scores: ScoreResult;
  techSignals: TechSignals;
};

export async function fetchRepositoryBundle(
  repo: string
): Promise<{ data?: RepositoryBundle; error?: string; status?: number }> {
  const token = process.env.GITHUB_PAT;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const baseUrl = `https://api.github.com/repos/${repo}`;

  const [repoRes, commitsRes, contributorsRes, languagesRes, releasesRes, techSignals] =
    await Promise.all([
      fetch(baseUrl, { headers }),
      fetch(`${baseUrl}/commits?per_page=30`, { headers }),
      fetch(`${baseUrl}/contributors?per_page=10`, { headers }),
      fetch(`${baseUrl}/languages`, { headers }),
      fetch(`${baseUrl}/releases?per_page=5`, { headers }),
      fetchTechSignals(repo, token),
    ]);

  if (repoRes.status === 404) {
    return { error: `Repository not found: ${repo}`, status: 404 };
  }

  if (repoRes.status === 403 || repoRes.status === 429) {
    return { error: "GitHub API rate limit exceeded", status: 429 };
  }

  if (
    !repoRes.ok ||
    !commitsRes.ok ||
    !contributorsRes.ok ||
    !languagesRes.ok ||
    !releasesRes.ok
  ) {
    return { error: `Failed to fetch data for ${repo}`, status: 500 };
  }

  const [repoDataRaw, commitsDataRaw, contributorsDataRaw, languagesData, releasesDataRaw] =
    await Promise.all([
      repoRes.json(),
      commitsRes.json(),
      contributorsRes.json(),
      languagesRes.json(),
      releasesRes.json(),
    ]);

  const repoData: RepositoryBundle["repo"] = {
    name: repoDataRaw.name,
    fullName: repoDataRaw.full_name,
    description: repoDataRaw.description,
    stars: repoDataRaw.stargazers_count,
    forks: repoDataRaw.forks_count,
    language: repoDataRaw.language,
    pushedAt: repoDataRaw.pushed_at,
    openIssuesCount: repoDataRaw.open_issues_count,
    size: repoDataRaw.size,
    watchersCount: repoDataRaw.watchers_count,
    defaultBranch: repoDataRaw.default_branch,
    topics: repoDataRaw.topics || [],
    license: repoDataRaw.license?.spdx_id || repoDataRaw.license?.name || null,
    createdAt: repoDataRaw.created_at,
  };

  const commits: CommitData[] = Array.isArray(commitsDataRaw)
    ? commitsDataRaw.map((c: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
        sha: c.sha,
        message: c.commit.message,
        authorName: c.commit.author.name,
        authorDate: c.commit.author.date,
      }))
    : [];

  const contributors: ContributorData[] = Array.isArray(contributorsDataRaw)
    ? contributorsDataRaw.map((c: { login: string; contributions: number }) => ({
        login: c.login,
        contributions: c.contributions,
      }))
    : [];

  const releases = Array.isArray(releasesDataRaw)
    ? releasesDataRaw.map((r: { tag_name: string; published_at: string; name: string }) => ({
        tagName: r.tag_name,
        publishedAt: r.published_at,
        name: r.name,
      }))
    : [];

  const scores = calculateAllScores(
    repoData,
    commits,
    contributors,
    languagesData,
    releases
  );

  return {
    data: {
      repo: repoData,
      commits,
      contributors,
      languages: languagesData,
      releases,
      scores,
      techSignals,
    },
  };
}

export async function fetchTechSignals(
  repo: string,
  token: string | undefined
): Promise<TechSignals> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const baseUrl = `https://api.github.com/repos/${repo}`;

  try {
    const [rootRes, pkgRes] = await Promise.all([
      fetch(`${baseUrl}/contents/`, { headers }),
      fetch(`${baseUrl}/contents/package.json`, {
        headers: { ...headers, Accept: "application/vnd.github.raw+json" },
      }),
    ]);

    const rootFiles: string[] = [];
    const rootDirs: string[] = [];
    let hasGithubDir = false;

    if (rootRes.ok) {
      try {
        const data = (await rootRes.json()) as unknown;
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item && typeof item === "object") {
              const entry = item as { name?: unknown; type?: unknown };
              if (typeof entry.name === "string") {
                if (entry.type === "dir") {
                  rootDirs.push(entry.name);
                  if (entry.name === ".github") hasGithubDir = true;
                } else {
                  rootFiles.push(entry.name);
                }
              }
            }
          }
        }
      } catch {
        // ignore parsing error
      }
    }

    let packageJson: TechSignals["packageJson"] = null;
    if (pkgRes.ok) {
      try {
        const text = await pkgRes.text();
        const parsed: unknown = JSON.parse(text);
        if (parsed && typeof parsed === "object") {
          const obj = parsed as {
            dependencies?: Record<string, unknown>;
            devDependencies?: Record<string, unknown>;
          };
          packageJson = {
            dependencies: obj.dependencies
              ? Object.keys(obj.dependencies)
              : [],
            devDependencies: obj.devDependencies
              ? Object.keys(obj.devDependencies)
              : [],
          };
        }
      } catch {
        // ignore JSON parse error
      }
    }

    return {
      rootFiles,
      rootDirs,
      hasGithubDir,
      packageJson,
    };
  } catch {
    return buildEmptyTechSignals();
  }
}
