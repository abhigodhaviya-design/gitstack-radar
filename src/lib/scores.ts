import type { ScoreResult } from "./types";

export function calculateHealthScore(data: any): number {
  let score = 50;
  
  const daysSincePush = (new Date().getTime() - new Date(data.repo.pushedAt).getTime()) / (1000 * 3600 * 24);
  if (daysSincePush <= 30) score += 15;
  if (data.repo.openIssuesCount < 10) score += 10;
  if (data.repo.openIssuesCount < 50) score += 5;
  if (data.repo.stars > 100) score += 10;
  if (data.contributors.length >= 3) score += 10;
  
  return Math.min(score, 100);
}

export function calculateActivityScore(data: any): number {
  let score = 40;
  
  if (data.commits.length > 0) {
    const daysSinceLastCommit = (new Date().getTime() - new Date(data.commits[0].authorDate).getTime()) / (1000 * 3600 * 24);
    if (daysSinceLastCommit <= 7) score += 20;
    if (daysSinceLastCommit <= 30) score += 15;
  }
  
  const recentCommits = data.commits.filter((c: any) => {
    const days = (new Date().getTime() - new Date(c.authorDate).getTime()) / (1000 * 3600 * 24);
    return days <= 30;
  });
  
  if (recentCommits.length >= 10) score += 15;
  if (data.contributors.length >= 5) score += 10;
  
  return Math.min(score, 100);
}

export function calculateComplexityScore(data: any): number {
  let score = 20;
  
  if (data.repo.size > 10000) score += 20;
  if (data.repo.size > 50000) score += 15;
  if (Object.keys(data.languages).length > 3) score += 15;
  if (data.repo.topics.length > 3) score += 15;
  if (data.contributors.length >= 10) score += 15;
  
  return Math.min(score, 100);
}

export function calculateRiskScore(data: any): number {
  let score = 20;
  
  const daysSincePush = (new Date().getTime() - new Date(data.repo.pushedAt).getTime()) / (1000 * 3600 * 24);
  if (daysSincePush > 90) score += 20;
  if (data.repo.openIssuesCount > 100) score += 15;
  if (data.repo.openIssuesCount > 50) score += 10;
  if (data.contributors.length <= 1) score += 15;
  if (data.releases.length === 0) score += 20;
  
  return Math.min(score, 100);
}

export function calculateAllScores(
  repoData: any,
  commits: any[],
  contributors: any[],
  languages: any,
  releases: any[]
): ScoreResult {
  const data = { repo: repoData, commits, contributors, languages, releases };
  
  return {
    healthScore: calculateHealthScore(data),
    activityScore: calculateActivityScore(data),
    complexityScore: calculateComplexityScore(data),
    riskScore: calculateRiskScore(data),
  };
}
