import type { RepositoryBundle } from "@/lib/github";
import type { CompareMetrics, CompareWinner, ScoreResult } from "@/lib/types";

export function isValidRepoFormat(repo: string): boolean {
  return /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo);
}

export function scoreToRadarMetrics(scores: ScoreResult, stars: number): CompareMetrics {
  const popularity = Math.min(100, Math.round(Math.log10(stars + 1) * 22));
  return {
    popularity,
    activity: scores.activityScore,
    complexity: scores.complexityScore,
    maintainability: Math.max(0, 100 - scores.riskScore),
    communityHealth: scores.healthScore,
  };
}

function pickWinner(
  v1: number,
  v2: number,
  higherWins = true
): CompareWinner {
  if (v1 === v2) return "tie";
  if (higherWins) return v1 > v2 ? "repo1" : "repo2";
  return v1 < v2 ? "repo1" : "repo2";
}

export function getRecentCommitCount(commits: { authorDate: string }[]): number {
  const now = Date.now();
  return commits.filter((c) => {
    const days = (now - new Date(c.authorDate).getTime()) / (1000 * 3600 * 24);
    return days <= 30;
  }).length;
}

export function getRepoAgeYears(createdAt: string): number {
  const years =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 3600 * 24 * 365.25);
  return Math.max(0, Math.round(years * 10) / 10);
}

export function buildComparisonMetrics(
  bundle1: RepositoryBundle,
  bundle2: RepositoryBundle
) {
  const recent1 = getRecentCommitCount(bundle1.commits);
  const recent2 = getRecentCommitCount(bundle2.commits);
  const pushed1 = new Date(bundle1.repo.pushedAt).getTime();
  const pushed2 = new Date(bundle2.repo.pushedAt).getTime();

  return {
    starsWinner: pickWinner(bundle1.repo.stars, bundle2.repo.stars),
    forksWinner: pickWinner(bundle1.repo.forks, bundle2.repo.forks),
    openIssuesWinner: pickWinner(
      bundle1.repo.openIssuesCount,
      bundle2.repo.openIssuesCount,
      false
    ),
    activityScoreWinner: pickWinner(
      bundle1.scores.activityScore,
      bundle2.scores.activityScore
    ),
    healthScoreWinner: pickWinner(
      bundle1.scores.healthScore,
      bundle2.scores.healthScore
    ),
    maintainabilityWinner: pickWinner(
      100 - bundle1.scores.riskScore,
      100 - bundle2.scores.riskScore
    ),
    recentCommitsWinner: pickWinner(recent1, recent2),
    lastUpdatedWinner: pickWinner(pushed1, pushed2),
    repo1RecentCommits: recent1,
    repo2RecentCommits: recent2,
    repo1AgeYears: getRepoAgeYears(bundle1.repo.createdAt),
    repo2AgeYears: getRepoAgeYears(bundle2.repo.createdAt),
    repo1Metrics: scoreToRadarMetrics(bundle1.scores, bundle1.repo.stars),
    repo2Metrics: scoreToRadarMetrics(bundle2.scores, bundle2.repo.stars),
  };
}
