import type { RepoData, TechStack } from "./types";

/**
 * Recommendation scoring weights
 */
const SCORING_WEIGHTS = {
  SHARED_TOPICS: 30,
  SAME_PRIMARY_LANGUAGE: 25,
  ECOSYSTEM_MATCH: 20,
  SIMILAR_SIZE: 10,
  ACTIVITY_BONUS: 10,
  POPULARITY_BOOST: 5,
} as const;

/**
 * Minimum thresholds for quality filtering
 */
const QUALITY_THRESHOLDS = {
  MIN_STARS: 100,
  MIN_ACTIVITY_DAYS: 365, // Not updated in over a year
  MAX_RECOMMENDATIONS: 6,
} as const;

/**
 * Similar repository suggestion data
 */
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

/**
 * Recommendation result
 */
export type RecommendationResult = {
  recommendations: SimilarRepo[];
  totalSearched: number;
  executionTimeMs: number;
};

/**
 * Ecosystem mapping for framework relationships
 */
const ECOSYSTEM_MAP: Record<string, string[]> = {
  // Frontend frameworks
  react: ["preact", "solid", "inferno", "million"],
  vue: ["nuxt", "quasar", "vuetify", "vueuse"],
  angular: ["ngrx", "ngxs", "angular-material"],
  svelte: ["sveltekit", "svelte-kit"],
  
  // Meta-frameworks
  "next.js": ["remix", "nuxt", "astro", "sveltekit", "gatsby", "blitz"],
  nextjs: ["remix", "nuxt", "astro", "sveltekit", "gatsby", "blitz"],
  remix: ["next.js", "nextjs", "nuxt", "astro", "sveltekit"],
  nuxt: ["next.js", "nextjs", "remix", "astro", "sveltekit"],
  astro: ["next.js", "nextjs", "remix", "nuxt", "sveltekit"],
  gatsby: ["next.js", "nextjs", "remix", "astro"],
  
  // Backend frameworks
  express: ["fastify", "koa", "hapi", "nestjs", "restify"],
  fastify: ["express", "koa", "hapi", "nestjs"],
  nestjs: ["express", "fastify", "koa"],
  django: ["flask", "fastapi", "pyramid"],
  flask: ["django", "fastapi", "bottle"],
  fastapi: ["django", "flask", "starlette"],
  "spring-boot": ["micronaut", "quarkus", "dropwizard"],
  laravel: ["symfony", "codeigniter", "slim"],
  
  // ML/AI frameworks
  tensorflow: ["pytorch", "jax", "keras", "mxnet"],
  pytorch: ["tensorflow", "jax", "lightning"],
  jax: ["tensorflow", "pytorch", "flax"],
  
  // Build tools
  webpack: ["vite", "rollup", "parcel", "esbuild", "turbopack"],
  vite: ["webpack", "rollup", "esbuild", "turbopack"],
  rollup: ["webpack", "vite", "esbuild"],
  
  // Testing frameworks
  jest: ["vitest", "mocha", "jasmine", "ava"],
  vitest: ["jest", "mocha", "ava"],
  cypress: ["playwright", "puppeteer", "testcafe"],
  playwright: ["cypress", "puppeteer", "selenium"],
  
  // State management
  redux: ["zustand", "mobx", "recoil", "jotai", "valtio"],
  mobx: ["redux", "zustand", "recoil"],
  zustand: ["redux", "mobx", "jotai", "valtio"],
  
  // CSS frameworks
  tailwindcss: ["unocss", "windicss", "twind"],
  bootstrap: ["bulma", "foundation", "materialize"],
  
  // Databases
  postgresql: ["mysql", "mariadb", "cockroachdb"],
  mongodb: ["couchdb", "dynamodb", "firestore"],
  redis: ["memcached", "dragonfly", "keydb"],
};

/**
 * Normalize string for comparison
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

/**
 * Calculate topic similarity score
 */
function calculateTopicScore(sourceTopics: string[], targetTopics: string[]): number {
  if (sourceTopics.length === 0 || targetTopics.length === 0) return 0;
  
  const sourceSet = new Set(sourceTopics.map(normalize));
  const targetSet = new Set(targetTopics.map(normalize));
  
  let matches = 0;
  for (const topic of sourceSet) {
    if (targetSet.has(topic)) matches++;
  }
  
  // Calculate Jaccard similarity
  const union = new Set([...sourceSet, ...targetSet]).size;
  const similarity = matches / union;
  
  return similarity * SCORING_WEIGHTS.SHARED_TOPICS;
}

/**
 * Calculate language match score
 */
function calculateLanguageScore(
  sourceLanguage: string | null,
  targetLanguage: string | null
): number {
  if (!sourceLanguage || !targetLanguage) return 0;
  
  return normalize(sourceLanguage) === normalize(targetLanguage)
    ? SCORING_WEIGHTS.SAME_PRIMARY_LANGUAGE
    : 0;
}

/**
 * Calculate ecosystem similarity score
 */
function calculateEcosystemScore(
  sourceTopics: string[],
  targetTopics: string[],
  techStack?: TechStack
): number {
  const allSourceTerms = [
    ...sourceTopics.map(normalize),
    ...(techStack?.items.map((item) => normalize(item.id)) || []),
  ];
  
  const allTargetTerms = targetTopics.map(normalize);
  
  let maxScore = 0;
  
  for (const sourceTerm of allSourceTerms) {
    const relatedEcosystems = ECOSYSTEM_MAP[sourceTerm] || [];
    
    for (const targetTerm of allTargetTerms) {
      const normalizedTarget = normalize(targetTerm);
      
      if (relatedEcosystems.some((eco) => normalize(eco) === normalizedTarget)) {
        maxScore = Math.max(maxScore, SCORING_WEIGHTS.ECOSYSTEM_MATCH);
      }
    }
  }
  
  return maxScore;
}

/**
 * Calculate repository size similarity (logarithmic scale)
 */
function calculateSizeScore(sourceStars: number, targetStars: number): number {
  if (sourceStars === 0 || targetStars === 0) return 0;
  
  const sourceLog = Math.log10(sourceStars + 1);
  const targetLog = Math.log10(targetStars + 1);
  
  const difference = Math.abs(sourceLog - targetLog);
  const maxDifference = 3; // 3 orders of magnitude
  
  const similarity = Math.max(0, 1 - difference / maxDifference);
  
  return similarity * SCORING_WEIGHTS.SIMILAR_SIZE;
}

/**
 * Calculate activity bonus based on recent updates
 */
function calculateActivityBonus(pushedAt: string): number {
  const lastUpdate = new Date(pushedAt);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceUpdate < 7) return SCORING_WEIGHTS.ACTIVITY_BONUS;
  if (daysSinceUpdate < 30) return SCORING_WEIGHTS.ACTIVITY_BONUS * 0.75;
  if (daysSinceUpdate < 90) return SCORING_WEIGHTS.ACTIVITY_BONUS * 0.5;
  if (daysSinceUpdate < 180) return SCORING_WEIGHTS.ACTIVITY_BONUS * 0.25;
  
  return 0;
}

/**
 * Calculate popularity boost (logarithmic)
 */
function calculatePopularityBoost(stars: number): number {
  if (stars < 1000) return 0;
  
  const logStars = Math.log10(stars);
  const maxLog = Math.log10(100000); // 100k stars
  
  const ratio = Math.min(logStars / maxLog, 1);
  
  return ratio * SCORING_WEIGHTS.POPULARITY_BOOST;
}

/**
 * Generate match reasons for transparency
 */
function generateMatchReasons(
  sourceRepo: RepoData,
  targetRepo: SimilarRepo,
  scores: {
    topicScore: number;
    languageScore: number;
    ecosystemScore: number;
    sizeScore: number;
  }
): string[] {
  const reasons: string[] = [];
  
  if (scores.topicScore > 0) {
    const sharedTopics = sourceRepo.topics.filter((t) =>
      targetRepo.topics.some((tt) => normalize(t) === normalize(tt))
    );
    if (sharedTopics.length > 0) {
      reasons.push(`Shared topics: ${sharedTopics.slice(0, 3).join(", ")}`);
    }
  }
  
  if (scores.languageScore > 0) {
    reasons.push(`Same primary language: ${sourceRepo.language}`);
  }
  
  if (scores.ecosystemScore > 0) {
    reasons.push("Related ecosystem/framework");
  }
  
  if (scores.sizeScore > SCORING_WEIGHTS.SIMILAR_SIZE * 0.7) {
    reasons.push("Similar popularity scale");
  }
  
  if (reasons.length === 0) {
    reasons.push("Similar repository characteristics");
  }
  
  return reasons;
}

/**
 * Check if repository should be filtered out
 */
function shouldFilterRepo(
  repo: any,
  sourceFullName: string,
  sourceParent?: string
): boolean {
  // Filter out the source repository itself
  if (repo.full_name === sourceFullName) return true;
  
  // Filter out forks of the same parent
  if (sourceParent && repo.parent?.full_name === sourceParent) return true;
  if (repo.fork && repo.parent?.full_name === sourceFullName) return true;
  
  // Filter out archived repositories
  if (repo.archived) return true;
  
  // Filter out low-quality repositories
  if (repo.stargazers_count < QUALITY_THRESHOLDS.MIN_STARS) return true;
  
  // Filter out inactive repositories (not updated in over a year)
  const lastUpdate = new Date(repo.pushed_at);
  const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate > QUALITY_THRESHOLDS.MIN_ACTIVITY_DAYS) return true;
  
  // Filter out empty repositories (no description and very few stars)
  if (!repo.description && repo.stargazers_count < 500) return true;
  
  return false;
}

/**
 * Score a single repository
 */
function scoreRepository(
  sourceRepo: RepoData,
  targetRepo: any,
  techStack?: TechStack
): SimilarRepo | null {
  const topicScore = calculateTopicScore(sourceRepo.topics, targetRepo.topics || []);
  const languageScore = calculateLanguageScore(sourceRepo.language, targetRepo.language);
  const ecosystemScore = calculateEcosystemScore(
    sourceRepo.topics,
    targetRepo.topics || [],
    techStack
  );
  const sizeScore = calculateSizeScore(sourceRepo.stars, targetRepo.stargazers_count);
  const activityBonus = calculateActivityBonus(targetRepo.pushed_at);
  const popularityBoost = calculatePopularityBoost(targetRepo.stargazers_count);
  
  const totalScore =
    topicScore + languageScore + ecosystemScore + sizeScore + activityBonus + popularityBoost;
  
  // Minimum score threshold to be considered relevant
  if (totalScore < 15) return null;
  
  const similarRepo: SimilarRepo = {
    fullName: targetRepo.full_name,
    name: targetRepo.name,
    description: targetRepo.description,
    stars: targetRepo.stargazers_count,
    language: targetRepo.language,
    topics: targetRepo.topics || [],
    htmlUrl: targetRepo.html_url,
    score: Math.round(totalScore * 10) / 10,
    matchReasons: generateMatchReasons(sourceRepo, targetRepo, {
      topicScore,
      languageScore,
      ecosystemScore,
      sizeScore,
    }),
  };
  
  return similarRepo;
}

/**
 * Build GitHub search queries based on repository characteristics
 */
export function buildSearchQueries(repo: RepoData, techStack?: TechStack): string[] {
  const queries: string[] = [];
  
  // Query 1: Topic-based search
  if (repo.topics.length > 0) {
    const topTopics = repo.topics.slice(0, 3);
    queries.push(
      `${topTopics.join(" ")} stars:>100 archived:false sort:stars`
    );
  }
  
  // Query 2: Language + main topic
  if (repo.language && repo.topics.length > 0) {
    queries.push(
      `language:${repo.language} ${repo.topics[0]} stars:>100 archived:false sort:stars`
    );
  }
  
  // Query 3: Ecosystem search
  if (techStack && techStack.items.length > 0) {
    const mainTech = techStack.items
      .filter((item) => item.confidence > 70)
      .slice(0, 2)
      .map((item) => item.name.toLowerCase().replace(/\s+/g, "-"));
    
    if (mainTech.length > 0) {
      queries.push(
        `${mainTech.join(" ")} stars:>100 archived:false sort:stars`
      );
    }
  }
  
  // Fallback: Language only
  if (repo.language && queries.length < 2) {
    queries.push(
      `language:${repo.language} stars:>1000 archived:false sort:stars`
    );
  }
  
  return queries.slice(0, 3); // Limit to 3 queries to avoid rate limits
}

/**
 * Main recommendation function
 */
export async function findSimilarRepositories(
  repo: RepoData,
  techStack?: TechStack,
  githubToken?: string
): Promise<RecommendationResult> {
  const startTime = Date.now();
  
  const queries = buildSearchQueries(repo, techStack);
  const headers: HeadersInit = githubToken
    ? { Authorization: `Bearer ${githubToken}` }
    : {};
  
  const allRepos: any[] = [];
  const seenRepos = new Set<string>();
  
  // Execute search queries
  for (const query of queries) {
    try {
      const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
        query
      )}&per_page=20`;
      
      const response = await fetch(searchUrl, { headers });
      
      if (!response.ok) {
        console.warn(`Search query failed: ${query}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          if (!seenRepos.has(item.full_name)) {
            seenRepos.add(item.full_name);
            
            if (!shouldFilterRepo(item, repo.fullName)) {
              allRepos.push(item);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error executing search query: ${query}`, error);
    }
  }
  
  // Score all repositories
  const scoredRepos = allRepos
    .map((targetRepo) => scoreRepository(repo, targetRepo, techStack))
    .filter((scored): scored is SimilarRepo => scored !== null);
  
  // Sort by score descending
  scoredRepos.sort((a, b) => b.score - a.score);
  
  // Take top recommendations
  const recommendations = scoredRepos.slice(0, QUALITY_THRESHOLDS.MAX_RECOMMENDATIONS);
  
  const executionTimeMs = Date.now() - startTime;
  
  return {
    recommendations,
    totalSearched: allRepos.length,
    executionTimeMs,
  };
}
