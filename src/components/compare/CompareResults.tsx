"use client";
import type { JSX } from "react";

import { CompareAiInsights } from "@/components/compare/CompareAiInsights";
import { CompareMetricsGrid } from "@/components/compare/CompareMetricsGrid";
import { CompareRadarChart } from "@/components/compare/CompareRadarChart";
import { RepoCard } from "@/components/compare/RepoCard";
import { TechStackComparisonSection } from "@/components/compare/TechStackComparison";
import { VsBadge } from "@/components/compare/VsBadge";
import { VsSummary } from "@/components/compare/VsSummary";
import { fontFamily, monoFamily } from "@/lib/fonts";
import { compareTechStacks, detectTechStack } from "@/lib/tech-stack";
import type { CompareApiResponse, DashboardTheme } from "@/lib/types";

type CompareResultsProps = {
  theme: DashboardTheme;
  data: CompareApiResponse;
};

export function CompareResults({ theme, data }: CompareResultsProps): JSX.Element {
  const { repo1, repo2, comparison, aiInsights } = data;
  const r1Short = repo1.repo.fullName.split("/")[1] || repo1.repo.fullName;
  const r2Short = repo2.repo.fullName.split("/")[1] || repo2.repo.fullName;

  const stack1 = detectTechStack(repo1.techSignals, {
    primaryLanguage: repo1.repo.language,
    topics: repo1.repo.topics,
    languages: repo1.languages,
    description: repo1.repo.description,
  });
  const stack2 = detectTechStack(repo2.techSignals, {
    primaryLanguage: repo2.repo.language,
    topics: repo2.repo.topics,
    languages: repo2.languages,
    description: repo2.repo.description,
  });
  const techComparison = compareTechStacks(stack1, stack2, r1Short, r2Short);

  return (
    <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Comparison
        </span>
        <h2
          style={{
            fontFamily,
            fontSize: "clamp(18px, 4vw, 22px)",
            fontWeight: 700,
            color: theme.primary,
            margin: 0,
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {r1Short}{" "}
          <span style={{ color: theme.muted, fontWeight: 500 }}>vs</span>{" "}
          {r2Short}
        </h2>
      </div>

      <div
        className="gitsr-compare-cards-row"
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <style>{`
          @media (max-width: 900px) {
            .gitsr-compare-cards-row {
              flex-direction: column !important;
            }
            .gitsr-compare-cards-row > * {
              width: 100% !important;
              min-width: 100% !important;
            }
          }
        `}</style>
        <RepoCard
          theme={theme}
          repo={repo1.repo}
          scores={repo1.scores}
          languages={repo1.languages}
          isHealthWinner={comparison.healthScoreWinner === "repo1"}
          isOverallWinner={aiInsights.codeQualityWinner === "repo1"}
          recentCommits={comparison.repo1RecentCommits}
          repoAgeYears={comparison.repo1AgeYears}
        />
        <VsBadge theme={theme} />
        <RepoCard
          theme={theme}
          repo={repo2.repo}
          scores={repo2.scores}
          languages={repo2.languages}
          isHealthWinner={comparison.healthScoreWinner === "repo2"}
          isOverallWinner={aiInsights.codeQualityWinner === "repo2"}
          recentCommits={comparison.repo2RecentCommits}
          repoAgeYears={comparison.repo2AgeYears}
        />
      </div>

      <VsSummary
        theme={theme}
        repo1Name={r1Short}
        repo2Name={r2Short}
        overallWinner={aiInsights.codeQualityWinner}
        repo1Health={repo1.scores.healthScore}
        repo2Health={repo2.scores.healthScore}
        repo1Activity={repo1.scores.activityScore}
        repo2Activity={repo2.scores.activityScore}
        repo1Stars={repo1.repo.stars}
        repo2Stars={repo2.repo.stars}
        bestFor={aiInsights.bestFor}
      />

      <CompareMetricsGrid
        theme={theme}
        repo1Name={r1Short}
        repo2Name={r2Short}
        stars={{
          r1: repo1.repo.stars,
          r2: repo2.repo.stars,
          winner: comparison.starsWinner,
        }}
        forks={{
          r1: repo1.repo.forks,
          r2: repo2.repo.forks,
          winner: comparison.forksWinner,
        }}
        openIssues={{
          r1: repo1.repo.openIssuesCount,
          r2: repo2.repo.openIssuesCount,
          winner: comparison.openIssuesWinner,
        }}
        activity={{
          r1: repo1.scores.activityScore,
          r2: repo2.scores.activityScore,
          winner: comparison.activityScoreWinner,
        }}
        health={{
          r1: repo1.scores.healthScore,
          r2: repo2.scores.healthScore,
          winner: comparison.healthScoreWinner,
        }}
        maintainability={{
          r1: comparison.repo1Metrics.maintainability,
          r2: comparison.repo2Metrics.maintainability,
          winner: comparison.maintainabilityWinner,
        }}
        recentCommits={{
          r1: comparison.repo1RecentCommits,
          r2: comparison.repo2RecentCommits,
          winner: comparison.recentCommitsWinner,
        }}
        lastUpdated={{
          r1: repo1.repo.pushedAt,
          r2: repo2.repo.pushedAt,
          winner: comparison.lastUpdatedWinner,
        }}
        age={{
          r1: comparison.repo1AgeYears,
          r2: comparison.repo2AgeYears,
        }}
      />

      <CompareRadarChart
        theme={theme}
        repo1Name={r1Short}
        repo2Name={r2Short}
        repo1Metrics={comparison.repo1Metrics}
        repo2Metrics={comparison.repo2Metrics}
      />

      <TechStackComparisonSection
        theme={theme}
        comparison={techComparison}
      />

      <CompareAiInsights
        theme={theme}
        summary={aiInsights.summary}
        recommendation={aiInsights.winnerRecommendation}
        strengths1={aiInsights.breakdown.strengthsRepo1}
        weaknesses1={aiInsights.breakdown.weaknessesRepo1}
        strengths2={aiInsights.breakdown.strengthsRepo2}
        weaknesses2={aiInsights.breakdown.weaknessesRepo2}
        repo1Name={r1Short}
        repo2Name={r2Short}
      />
    </div>
  );
}
