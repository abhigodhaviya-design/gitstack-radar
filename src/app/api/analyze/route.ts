import { NextResponse } from "next/server";
import { calculateAllScores } from "@/lib/scores";
import { fetchTechSignals } from "@/lib/github";

export async function POST(request: Request) {
  try {
    const { repo } = await request.json();
    if (!repo) {
      return NextResponse.json({ error: "Repository is required" }, { status: 400 });
    }

    const token = process.env.GITHUB_PAT;
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    const baseUrl = `https://api.github.com/repos/${repo}`;

    const [repoRes, commitsRes, contributorsRes, languagesRes, releasesRes, techSignals] = await Promise.all([
      fetch(baseUrl, { headers }),
      fetch(`${baseUrl}/commits?per_page=30`, { headers }),
      fetch(`${baseUrl}/contributors?per_page=10`, { headers }),
      fetch(`${baseUrl}/languages`, { headers }),
      fetch(`${baseUrl}/releases?per_page=5`, { headers }),
      fetchTechSignals(repo, token),
    ]);

    if (repoRes.status === 404) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    if (repoRes.status === 403 || repoRes.status === 429) {
      return NextResponse.json({ error: "GitHub API rate limit exceeded" }, { status: 429 });
    }

    if (!repoRes.ok || !commitsRes.ok || !contributorsRes.ok || !languagesRes.ok || !releasesRes.ok) {
      return NextResponse.json({ error: "Failed to fetch repository data" }, { status: 500 });
    }

    const [repoDataRaw, commitsDataRaw, contributorsDataRaw, languagesData, releasesDataRaw] = await Promise.all([
      repoRes.json(),
      commitsRes.json(),
      contributorsRes.json(),
      languagesRes.json(),
      releasesRes.json(),
    ]);

    const repoData = {
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
    };

    const commits = Array.isArray(commitsDataRaw) ? commitsDataRaw.map((c: any) => ({
      sha: c.sha,
      message: c.commit.message,
      authorName: c.commit.author.name,
      authorDate: c.commit.author.date,
    })) : [];

    const contributors = Array.isArray(contributorsDataRaw) ? contributorsDataRaw.map((c: any) => ({
      login: c.login,
      contributions: c.contributions,
    })) : [];

    const releases = Array.isArray(releasesDataRaw) ? releasesDataRaw.map((r: any) => ({
      tagName: r.tag_name,
      publishedAt: r.published_at,
      name: r.name,
    })) : [];

    const scores = calculateAllScores(repoData, commits, contributors, languagesData, releases);

    return NextResponse.json({
      repo: repoData,
      commits,
      contributors,
      languages: languagesData,
      releases,
      scores,
      techSignals,
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch repository data" }, { status: 500 });
  }
}
