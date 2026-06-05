export const mockData = {
  repoName: "vercel/next.js",
  stars: 124000,
  forks: 26500,
  language: "TypeScript",
  lastUpdated: "2 hours ago",
  healthScore: 94,
  activityScore: 88,
  complexityScore: 72,
  riskLevel: "Low",
  riskScore: 18,
};

export function normalizeRepoInput(input: string): string {
  return parseRepoParam(input.trim());
}

export const parseRepoParam = (repoParam: string): string => {
  if (!repoParam) return mockData.repoName;
  try {
    const url = new URL(repoParam);
    const path = url.pathname.replace(/^\/|\/$/g, "");
    return path || repoParam.replace(/^https?:\/\//, "").replace(/\/$/, "");
  } catch {
    return repoParam.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}
