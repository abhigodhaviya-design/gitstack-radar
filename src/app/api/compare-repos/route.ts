import { NextResponse } from "next/server";

import { buildComparisonMetrics, isValidRepoFormat } from "@/lib/compare";
import { normalizeRepoInput } from "@/lib/dashboard-data";
import { fetchRepositoryBundle } from "@/lib/github";
import type { CompareAiInsights, CompareApiResponse } from "@/lib/types";

async function fetchCompareAiInsights(
  repo1Name: string,
  repo2Name: string,
  payload: {
    repo1Summary: string;
    repo2Summary: string;
  }
): Promise<CompareAiInsights | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a senior software engineering analyst comparing two GitHub repositories.

Repository 1: ${repo1Name}
${payload.repo1Summary}

Repository 2: ${repo2Name}
${payload.repo2Summary}

Compare them for developers choosing which to use or contribute to.

Respond ONLY with a valid JSON object. No markdown. No backticks. No explanation. Exactly this shape:
{
  "summary": "2-3 sentence comparison overview",
  "winnerRecommendation": "1 sentence on which repo to pick overall and why",
  "breakdown": {
    "strengthsRepo1": ["strength 1", "strength 2", "strength 3"],
    "strengthsRepo2": ["strength 1", "strength 2", "strength 3"],
    "weaknessesRepo1": ["weakness 1", "weakness 2"],
    "weaknessesRepo2": ["weakness 1", "weakness 2"]
  },
  "bestFor": {
    "beginners": "repo1" | "repo2" | "tie",
    "production": "repo1" | "repo2" | "tie",
    "learning": "repo1" | "repo2" | "tie"
  },
  "codeQualityWinner": "repo1" | "repo2" | "tie"
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert software engineering analyst. Always respond with valid JSON only. No markdown. No backticks. No explanation.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    console.error("Groq API error:", await response.text());
    return null;
  }

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content;
  if (!text) return null;

  text = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(text) as CompareAiInsights;
  } catch {
    console.error("JSON parse error:", text);
    return null;
  }
}

function buildRepoSummary(
  label: string,
  bundle: Awaited<ReturnType<typeof fetchRepositoryBundle>>["data"]
): string {
  if (!bundle) return "";
  const langs = Object.keys(bundle.languages).join(", ") || "Unknown";
  const topContributors = bundle.contributors
    .slice(0, 3)
    .map((c) => c.login)
    .join(", ");
  return `${label}:
- Description: ${bundle.repo.description || "None"}
- Language: ${bundle.repo.language || "N/A"} | License: ${bundle.repo.license || "None"}
- Stars: ${bundle.repo.stars} | Forks: ${bundle.repo.forks} | Open issues: ${bundle.repo.openIssuesCount}
- Health: ${bundle.scores.healthScore}/100 | Activity: ${bundle.scores.activityScore}/100 | Complexity: ${bundle.scores.complexityScore}/100 | Risk: ${bundle.scores.riskScore}/100
- Languages: ${langs}
- Top contributors: ${topContributors || "N/A"}
- Recent commits (30d): ${bundle.commits.filter((c) => {
    const days =
      (Date.now() - new Date(c.authorDate).getTime()) / (1000 * 3600 * 24);
    return days <= 30;
  }).length}`;
}

function defaultAiInsights(repo1: string, repo2: string): CompareAiInsights {
  return {
    summary: `Comparison between ${repo1} and ${repo2} based on GitHub metrics. AI analysis was unavailable.`,
    winnerRecommendation: "Review scores and metrics below to choose the best fit for your use case.",
    breakdown: {
      strengthsRepo1: [],
      strengthsRepo2: [],
      weaknessesRepo1: [],
      weaknessesRepo2: [],
    },
    bestFor: {
      beginners: "tie",
      production: "tie",
      learning: "tie",
    },
    codeQualityWinner: "tie",
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repo1 = normalizeRepoInput(String(body.repo1 || ""));
    const repo2 = normalizeRepoInput(String(body.repo2 || ""));

    if (!repo1 || !repo2) {
      return NextResponse.json(
        { error: "Both repo1 and repo2 are required (owner/repo format)" },
        { status: 400 }
      );
    }

    if (!isValidRepoFormat(repo1) || !isValidRepoFormat(repo2)) {
      return NextResponse.json(
        { error: "Invalid repository format. Use owner/repo." },
        { status: 400 }
      );
    }

    const [result1, result2] = await Promise.all([
      fetchRepositoryBundle(repo1),
      fetchRepositoryBundle(repo2),
    ]);

    if (result1.error) {
      return NextResponse.json({ error: result1.error }, { status: result1.status || 500 });
    }
    if (result2.error) {
      return NextResponse.json({ error: result2.error }, { status: result2.status || 500 });
    }

    const bundle1 = result1.data!;
    const bundle2 = result2.data!;
    const comparison = buildComparisonMetrics(bundle1, bundle2);

    let aiInsights = await fetchCompareAiInsights(
      bundle1.repo.fullName,
      bundle2.repo.fullName,
      {
        repo1Summary: buildRepoSummary("Repo 1", bundle1),
        repo2Summary: buildRepoSummary("Repo 2", bundle2),
      }
    );

    if (!aiInsights) {
      aiInsights = defaultAiInsights(bundle1.repo.fullName, bundle2.repo.fullName);
    }

    const response: CompareApiResponse = {
      repo1: bundle1,
      repo2: bundle2,
      comparison,
      aiInsights,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Compare Repos Route Error:", error);
    return NextResponse.json({ error: "Failed to compare repositories" }, { status: 500 });
  }
}
