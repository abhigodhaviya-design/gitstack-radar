import type { ComponentType } from "react";

export type DashboardTheme = {
  pageBg: string;
  primary: string;
  secondary: string;
  muted: string;
  navbarBg: string;
  navbarBorder: string;
  divider: string;
  healthColor: string;
  activityColor: string;
  complexityColor: string;
  riskColor: string;
};

export type StatCardItem = {
  label: string;
  value: number | string;
  color: string;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  subtitle?: string;
};

export type Dot = {
  x: number;
  y: number;
};

export type RepoData = {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
  openIssuesCount: number;
  size: number;
  watchersCount: number;
  defaultBranch: string;
  topics: string[];
};

export type CommitData = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
};

export type ContributorData = {
  login: string;
  contributions: number;
};

export type ScoreResult = {
  healthScore: number;
  activityScore: number;
  complexityScore: number;
  riskScore: number;
};

export type AnalyzeApiResponse = {
  repo: RepoData;
  commits: CommitData[];
  contributors: ContributorData[];
  languages: Record<string, number>;
  releases: { tagName: string; publishedAt: string; name: string }[];
  scores: ScoreResult;
  techSignals?: TechSignals;
  error?: string;
};

export type TechSignals = {
  rootFiles: string[];
  rootDirs: string[];
  hasGithubDir: boolean;
  packageJson: {
    dependencies: string[];
    devDependencies: string[];
  } | null;
};

export type TechCategory =
  | "Frontend"
  | "Backend"
  | "Languages"
  | "Database"
  | "DevOps"
  | "Testing";

export type TechSource =
  | "topic"
  | "language"
  | "config-file"
  | "dependency"
  | "dev-dependency"
  | "description";

export type TechItem = {
  id: string;
  name: string;
  category: TechCategory;
  confidence: number;
  sources: TechSource[];
};

export type TechStack = {
  totalDetected: number;
  confidence: number;
  items: TechItem[];
  byCategory: Record<TechCategory, TechItem[]>;
  signals: TechSignals;
};

export type TechStackComparison = {
  repo1Name: string;
  repo2Name: string;
  shared: TechItem[];
  onlyRepo1: TechItem[];
  onlyRepo2: TechItem[];
  counts: {
    repo1Total: number;
    repo2Total: number;
    shared: number;
    onlyRepo1: number;
    onlyRepo2: number;
  };
  insights: string[];
};

export type CompareWinner = "repo1" | "repo2" | "tie";

export type CompareMetrics = {
  popularity: number;
  activity: number;
  complexity: number;
  maintainability: number;
  communityHealth: number;
};

export type CompareAiInsights = {
  summary: string;
  winnerRecommendation: string;
  breakdown: {
    strengthsRepo1: string[];
    strengthsRepo2: string[];
    weaknessesRepo1: string[];
    weaknessesRepo2: string[];
  };
  bestFor: {
    beginners: CompareWinner;
    production: CompareWinner;
    learning: CompareWinner;
  };
  codeQualityWinner: CompareWinner;
};

export type CompareApiResponse = {
  repo1: AnalyzeApiResponse & {
    repo: RepoData & { license: string | null; createdAt: string };
  };
  repo2: AnalyzeApiResponse & {
    repo: RepoData & { license: string | null; createdAt: string };
  };
  comparison: {
    starsWinner: CompareWinner;
    forksWinner: CompareWinner;
    openIssuesWinner: CompareWinner;
    activityScoreWinner: CompareWinner;
    healthScoreWinner: CompareWinner;
    maintainabilityWinner: CompareWinner;
    recentCommitsWinner: CompareWinner;
    lastUpdatedWinner: CompareWinner;
    repo1RecentCommits: number;
    repo2RecentCommits: number;
    repo1AgeYears: number;
    repo2AgeYears: number;
    repo1Metrics: CompareMetrics;
    repo2Metrics: CompareMetrics;
  };
  aiInsights: CompareAiInsights;
};

export type SimilarRepo = {
  fullName: string;
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  topics: string[];
  htmlUrl: string;
  score: number;
  matchReasons: string[];
};

export type RecommendationResult = {
  recommendations: SimilarRepo[];
  totalSearched: number;
  executionTimeMs: number;
};
