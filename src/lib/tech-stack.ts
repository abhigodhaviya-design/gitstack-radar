import type {
  TechCategory,
  TechItem,
  TechSignals,
  TechSource,
  TechStack,
  TechStackComparison,
} from "@/lib/types";

type TechDefinition = {
  id: string;
  name: string;
  category: TechCategory;
  topics?: string[];
  packages?: string[];
  devPackages?: string[];
  configFiles?: string[];
  configFileGlobs?: string[];
  languages?: string[];
  descriptionKeywords?: string[];
};

const TECH_DATABASE: TechDefinition[] = [
  // ---------- Languages ----------
  {
    id: "typescript",
    name: "TypeScript",
    category: "Languages",
    languages: ["TypeScript", "TS"],
    packages: ["typescript"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Languages",
    languages: ["JavaScript", "JS"],
  },
  {
    id: "python",
    name: "Python",
    category: "Languages",
    languages: ["Python"],
    packages: ["django", "flask", "fastapi"],
  },
  {
    id: "java",
    name: "Java",
    category: "Languages",
    languages: ["Java"],
  },
  {
    id: "csharp",
    name: "C#",
    category: "Languages",
    languages: ["C#"],
  },
  {
    id: "go",
    name: "Go",
    category: "Languages",
    languages: ["Go"],
  },
  {
    id: "rust",
    name: "Rust",
    category: "Languages",
    languages: ["Rust"],
  },
  {
    id: "php",
    name: "PHP",
    category: "Languages",
    languages: ["PHP"],
  },
  {
    id: "cpp",
    name: "C++",
    category: "Languages",
    languages: ["C++", "C/C++"],
  },
  {
    id: "c",
    name: "C",
    category: "Languages",
    languages: ["C"],
  },

  // ---------- Frontend ----------
  {
    id: "react",
    name: "React",
    category: "Frontend",
    topics: ["react", "reactjs"],
    packages: ["react", "react-dom"],
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Frontend",
    topics: ["nextjs", "next-js", "next.js"],
    packages: ["next"],
    configFileGlobs: ["next.config.*"],
  },
  {
    id: "vue",
    name: "Vue",
    category: "Frontend",
    topics: ["vue", "vuejs", "vue3"],
    packages: ["vue"],
  },
  {
    id: "nuxt",
    name: "Nuxt",
    category: "Frontend",
    topics: ["nuxt", "nuxtjs"],
    packages: ["nuxt"],
    configFileGlobs: ["nuxt.config.*"],
  },
  {
    id: "angular",
    name: "Angular",
    category: "Frontend",
    topics: ["angular", "angularjs"],
    packages: ["@angular/core"],
    configFileGlobs: ["angular.json"],
  },
  {
    id: "svelte",
    name: "Svelte",
    category: "Frontend",
    topics: ["svelte", "sveltejs"],
    packages: ["svelte"],
    configFileGlobs: ["svelte.config.*"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    topics: ["tailwindcss", "tailwind"],
    packages: ["tailwindcss", "@tailwindcss/postcss"],
    configFileGlobs: ["tailwind.config.*", "postcss.config.*"],
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    category: "Frontend",
    topics: ["bootstrap"],
    packages: ["bootstrap"],
  },
  {
    id: "materialui",
    name: "Material UI",
    category: "Frontend",
    topics: ["material-ui", "mui"],
    packages: ["@mui/material", "@material-ui/core"],
  },

  // ---------- Backend ----------
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    topics: ["nodejs", "node"],
    languages: ["JavaScript", "TypeScript"],
    configFiles: [".nvmrc", "package.json"],
  },
  {
    id: "express",
    name: "Express",
    category: "Backend",
    packages: ["express"],
  },
  {
    id: "nestjs",
    name: "NestJS",
    category: "Backend",
    topics: ["nestjs", "nest-js"],
    packages: ["@nestjs/core", "@nestjs/common"],
  },
  {
    id: "django",
    name: "Django",
    category: "Backend",
    topics: ["django"],
    packages: ["django", "djangorestframework"],
    configFiles: ["manage.py"],
  },
  {
    id: "flask",
    name: "Flask",
    category: "Backend",
    topics: ["flask"],
    packages: ["flask"],
  },
  {
    id: "fastapi",
    name: "FastAPI",
    category: "Backend",
    topics: ["fastapi"],
    packages: ["fastapi"],
  },
  {
    id: "springboot",
    name: "Spring Boot",
    category: "Backend",
    topics: ["spring-boot", "springboot"],
    packages: ["spring-boot-starter"],
  },
  {
    id: "laravel",
    name: "Laravel",
    category: "Backend",
    topics: ["laravel"],
    packages: ["laravel/framework"],
  },
  {
    id: "aspnet",
    name: "ASP.NET",
    category: "Backend",
    topics: ["aspnet", "asp-net", "asp.net"],
    configFileGlobs: ["*.csproj", "*.sln"],
  },

  // ---------- Database ----------
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Database",
    topics: ["postgresql", "postgres"],
    packages: ["pg", "postgres", "prisma", "typeorm", "sequelize", "knex"],
    descriptionKeywords: ["postgres", "postgresql"],
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "Database",
    topics: ["mysql"],
    packages: ["mysql", "mysql2"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Database",
    topics: ["mongodb", "mongo"],
    packages: ["mongodb", "mongoose"],
  },
  {
    id: "redis",
    name: "Redis",
    category: "Database",
    topics: ["redis"],
    packages: ["redis", "ioredis"],
  },
  {
    id: "sqlite",
    name: "SQLite",
    category: "Database",
    topics: ["sqlite"],
    packages: ["sqlite3", "better-sqlite3"],
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "Database",
    topics: ["firebase"],
    packages: ["firebase", "firebase-admin", "@google-cloud/firestore"],
  },

  // ---------- DevOps / Infrastructure ----------
  {
    id: "docker",
    name: "Docker",
    category: "DevOps",
    topics: ["docker", "dockerfile"],
    configFiles: [
      "Dockerfile",
      "docker-compose.yml",
      "docker-compose.yaml",
      ".dockerignore",
    ],
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    category: "DevOps",
    topics: ["kubernetes", "k8s"],
    configFiles: [
      "k8s.yaml",
      "kubernetes.yaml",
      "kustomization.yaml",
      "helm.yaml",
    ],
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    category: "DevOps",
    topics: ["github-actions"],
    configFiles: [".github"],
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "DevOps",
    topics: ["vercel"],
    configFiles: ["vercel.json", ".vercelignore"],
  },
  {
    id: "netlify",
    name: "Netlify",
    category: "DevOps",
    topics: ["netlify"],
    configFiles: ["netlify.toml"],
  },
  {
    id: "aws",
    name: "AWS",
    category: "DevOps",
    topics: ["aws", "amazon-web-services"],
    packages: ["aws-sdk", "@aws-sdk/client-s3"],
  },
  {
    id: "azure",
    name: "Azure",
    category: "DevOps",
    topics: ["azure", "microsoft-azure"],
    packages: ["@azure/functions", "azure"],
  },
  {
    id: "gcp",
    name: "GCP",
    category: "DevOps",
    topics: ["gcp", "google-cloud"],
    packages: ["@google-cloud/storage", "@google-cloud/functions-framework"],
  },

  // ---------- Testing ----------
  {
    id: "jest",
    name: "Jest",
    category: "Testing",
    packages: ["jest", "@jest/core"],
    configFileGlobs: ["jest.config.*"],
  },
  {
    id: "vitest",
    name: "Vitest",
    category: "Testing",
    packages: ["vitest"],
    configFileGlobs: ["vitest.config.*"],
  },
  {
    id: "cypress",
    name: "Cypress",
    category: "Testing",
    packages: ["cypress"],
    configFileGlobs: ["cypress.config.*", "cypress.json"],
  },
  {
    id: "playwright",
    name: "Playwright",
    category: "Testing",
    packages: ["playwright", "@playwright/test"],
    configFileGlobs: ["playwright.config.*"],
  },
  {
    id: "testing-library",
    name: "Testing Library",
    category: "Testing",
    packages: [
      "@testing-library/react",
      "@testing-library/vue",
      "@testing-library/angular",
      "@testing-library/svelte",
      "@testing-library/jest-dom",
    ],
  },
];

const CONFIDENCE_WEIGHTS: Record<TechSource, number> = {
  topic: 25,
  language: 20,
  "config-file": 50,
  dependency: 40,
  "dev-dependency": 30,
  description: 8,
};

const CONFIDENCE_MAX = 100;

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function listIncludesAny(
  list: readonly string[],
  candidates: readonly string[]
): boolean {
  if (!list || list.length === 0) return false;
  const lower = new Set(list.map(normalize));
  return candidates.some((c) => lower.has(normalize(c)));
}

function descriptionContains(
  description: string | null,
  keywords: readonly string[]
): boolean {
  if (!description) return false;
  const lower = description.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}

function fileMatchesGlob(
  file: string,
  patterns: readonly string[]
): boolean {
  for (const pattern of patterns) {
    if (!pattern.includes("*")) {
      if (file === pattern) return true;
      continue;
    }
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    const re = new RegExp(`^${escaped}$`);
    if (re.test(file)) return true;
  }
  return false;
}

function fileExists(
  rootFiles: readonly string[],
  rootDirs: readonly string[],
  hasGithubDir: boolean,
  exact: readonly string[] | undefined,
  globs: readonly string[] | undefined,
  specialGithub: boolean
): boolean {
  if (specialGithub && hasGithubDir) return true;
  if (exact) {
    for (const e of exact) {
      if (e === ".github") {
        if (hasGithubDir) return true;
        continue;
      }
      if (rootFiles.includes(e) || rootDirs.includes(e)) return true;
    }
  }
  if (globs) {
    const all = [...rootFiles, ...rootDirs];
    for (const f of all) {
      if (fileMatchesGlob(f, globs)) return true;
    }
  }
  return false;
}

export function buildEmptyTechSignals(): TechSignals {
  return {
    rootFiles: [],
    rootDirs: [],
    hasGithubDir: false,
    packageJson: null,
  };
}

export function detectTechStack(
  signals: TechSignals | undefined,
  context?: {
    primaryLanguage?: string | null;
    topics?: string[];
    languages?: Record<string, number>;
    description?: string | null;
  }
): TechStack {
  const safeSignals: TechSignals = signals ?? buildEmptyTechSignals();
  const topics = (context?.topics ?? []).map(normalize);
  const languageNames = new Set<string>();
  if (context?.primaryLanguage) languageNames.add(normalize(context.primaryLanguage));
  if (context?.languages) {
    for (const k of Object.keys(context.languages)) languageNames.add(normalize(k));
  }
  const description = context?.description ?? null;

  const items: TechItem[] = [];

  for (const def of TECH_DATABASE) {
    const sources: TechSource[] = [];
    let confidence = 0;

    if (def.topics && listIncludesAny(topics, def.topics)) {
      sources.push("topic");
      confidence += CONFIDENCE_WEIGHTS.topic;
    }

    if (def.languages && def.languages.length > 0) {
      const langLower = def.languages.map(normalize);
      let matched = false;
      for (const name of languageNames) {
        if (langLower.includes(name)) {
          matched = true;
          break;
        }
      }
      if (matched) {
        sources.push("language");
        confidence += CONFIDENCE_WEIGHTS.language;
      }
    }

    if (def.packages || def.devPackages) {
      const deps = safeSignals.packageJson?.dependencies ?? [];
      const devDeps = safeSignals.packageJson?.devDependencies ?? [];
      const depLower = new Set(deps.map(normalize));
      const devLower = new Set(devDeps.map(normalize));

      if (def.packages && def.packages.some((p) => depLower.has(normalize(p)))) {
        sources.push("dependency");
        confidence += CONFIDENCE_WEIGHTS.dependency;
      } else if (def.devPackages && def.devPackages.some((p) => devLower.has(normalize(p)))) {
        sources.push("dev-dependency");
        confidence += CONFIDENCE_WEIGHTS["dev-dependency"];
      } else if (def.packages && def.packages.some((p) => devLower.has(normalize(p)))) {
        sources.push("dev-dependency");
        confidence += CONFIDENCE_WEIGHTS["dev-dependency"];
      } else if (def.devPackages && def.devPackages.some((p) => depLower.has(normalize(p)))) {
        sources.push("dependency");
        confidence += CONFIDENCE_WEIGHTS.dependency;
      }
    }

    const specialGithub =
      !!def.configFiles?.includes(".github") ||
      !!def.configFileGlobs?.includes(".github");
    if (fileExists(
      safeSignals.rootFiles,
      safeSignals.rootDirs,
      safeSignals.hasGithubDir,
      def.configFiles,
      def.configFileGlobs,
      specialGithub
    )) {
      sources.push("config-file");
      confidence += CONFIDENCE_WEIGHTS["config-file"];
    }

    if (def.descriptionKeywords && descriptionContains(description, def.descriptionKeywords)) {
      sources.push("description");
      confidence += CONFIDENCE_WEIGHTS.description;
    }

    if (sources.length === 0) continue;

    items.push({
      id: def.id,
      name: def.name,
      category: def.category,
      confidence: Math.min(CONFIDENCE_MAX, confidence),
      sources,
    });
  }

  items.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));

  const byCategory: Record<TechCategory, TechItem[]> = {
    Frontend: [],
    Backend: [],
    Languages: [],
    Database: [],
    DevOps: [],
    Testing: [],
  };
  for (const item of items) {
    byCategory[item.category].push(item);
  }

  const overallConfidence = computeOverallConfidence(items);

  return {
    totalDetected: items.length,
    confidence: overallConfidence,
    items,
    byCategory,
    signals: safeSignals,
  };
}

function computeOverallConfidence(items: TechItem[]): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, i) => acc + i.confidence, 0);
  const avg = sum / items.length;
  const breadthBonus = Math.min(15, Math.log2(items.length + 1) * 4);
  return Math.min(CONFIDENCE_MAX, Math.round(avg + breadthBonus));
}

export function compareTechStacks(
  stack1: TechStack,
  stack2: TechStack,
  repo1Name: string,
  repo2Name: string
): TechStackComparison {
  const ids1 = new Set(stack1.items.map((i) => i.id));
  const ids2 = new Set(stack2.items.map((i) => i.id));

  const shared: TechItem[] = [];
  const onlyRepo1: TechItem[] = [];
  const onlyRepo2: TechItem[] = [];

  for (const item of stack1.items) {
    if (ids2.has(item.id)) {
      const match = stack2.items.find((i) => i.id === item.id);
      if (match) {
        shared.push({
          ...item,
          confidence: Math.round((item.confidence + match.confidence) / 2),
        });
      }
    } else {
      onlyRepo1.push(item);
    }
  }
  for (const item of stack2.items) {
    if (!ids1.has(item.id)) onlyRepo2.push(item);
  }

  shared.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));
  onlyRepo1.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));
  onlyRepo2.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));

  const insights = generateStackInsights(stack1, stack2, repo1Name, repo2Name, {
    shared,
    onlyRepo1,
    onlyRepo2,
  });

  return {
    repo1Name,
    repo2Name,
    shared,
    onlyRepo1,
    onlyRepo2,
    counts: {
      repo1Total: stack1.items.length,
      repo2Total: stack2.items.length,
      shared: shared.length,
      onlyRepo1: onlyRepo1.length,
      onlyRepo2: onlyRepo2.length,
    },
    insights,
  };
}

type ComparisonContext = {
  shared: TechItem[];
  onlyRepo1: TechItem[];
  onlyRepo2: TechItem[];
};

export function generateStackInsights(
  stack1: TechStack,
  stack2: TechStack,
  repo1Name: string,
  repo2Name: string,
  ctx: ComparisonContext
): string[] {
  const insights: string[] = [];
  const ids1 = new Set(stack1.items.map((i) => i.id));
  const ids2 = new Set(stack2.items.map((i) => i.id));

  if (ids1.has("typescript") && ids2.has("typescript")) {
    insights.push("Both repositories use a modern TypeScript stack.");
  }

  const compareCategory = (category: TechCategory, leadTemplate: (name: string) => string) => {
    const c1 = ctx.onlyRepo1.filter((i) => i.category === category).length;
    const c2 = ctx.onlyRepo2.filter((i) => i.category === category).length;
    if (c1 > c2 && c1 >= 2) insights.push(leadTemplate(repo1Name));
    else if (c2 > c1 && c2 >= 2) insights.push(leadTemplate(repo2Name));
  };

  compareCategory("Frontend", (n) => `${n} uses a more complete frontend ecosystem.`);
  compareCategory("DevOps", (n) => `${n} includes stronger DevOps tooling.`);
  compareCategory("Testing", (n) => `${n} has a more comprehensive testing setup.`);

  const bothRepo1 = stack1.totalDetected;
  const bothRepo2 = stack2.totalDetected;
  if (bothRepo1 > 0 && bothRepo2 > 0) {
    const overlap = ctx.shared.length;
    const min = Math.min(bothRepo1, bothRepo2);
    if (min > 0 && overlap / min >= 0.7) {
      insights.push("Both repositories rely on similar infrastructure and tooling.");
    } else if (overlap === 0) {
      insights.push("No shared technologies detected — the stacks are quite different.");
    }
  }

  if (ctx.shared.length > 0 && (ctx.onlyRepo1.length > 0 || ctx.onlyRepo2.length > 0)) {
    const diffs = ctx.onlyRepo1.length + ctx.onlyRepo2.length;
    if (diffs <= 2) {
      insights.push(
        `The two stacks are nearly identical, with only ${diffs} differing technolog${diffs === 1 ? "y" : "ies"}.`
      );
    }
  }

  if (insights.length === 0) {
    if (stack1.totalDetected === 0 && stack2.totalDetected === 0) {
      insights.push("No technologies could be detected for either repository.");
    } else if (ctx.shared.length > 0) {
      insights.push(
        `Both repositories share ${ctx.shared.length} technolog${ctx.shared.length === 1 ? "y" : "ies"}.`
      );
    } else {
      insights.push("The two repositories use very different technology stacks.");
    }
  }

  return insights;
}
