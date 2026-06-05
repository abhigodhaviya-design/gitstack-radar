"use client";
import type { JSX } from "react";

import { Activity, GitMerge, HeartPulse, ShieldAlert } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { DashboardLoader } from "@/components/dashboard/DashboardLoader";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
import { CommitTimeline } from "@/components/dashboard/CommitTimeline";
import { ExportPDFButton } from "@/components/dashboard/ExportPDFButton";
import { READMEAnalyzer } from "@/components/dashboard/READMEAnalyzer";
import { RadarChart } from "@/components/dashboard/RadarChart";
import { RepoHeader } from "@/components/dashboard/RepoHeader";
import { SimilarRepositories } from "@/components/dashboard/SimilarRepositories";
import { StatCards } from "@/components/dashboard/StatCards";
import { TechStackCard } from "@/components/dashboard/TechStackCard";
import { DotGridBackground } from "@/components/shared/DotGridBackground";
import { NavBar } from "@/components/shared/NavBar";
import { formatRelativeTime, parseRepoParam } from "@/lib/dashboard-data";
import { getGlassSurface, globalStyles } from "@/lib/styles";
import { detectTechStack } from "@/lib/tech-stack";
import { theme } from "@/lib/theme";
import type { AnalyzeApiResponse, StatCardItem, TechStack } from "@/lib/types";

function DashboardInner(): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const repoParam = searchParams.get("repo") || "";

  const [repoData, setRepoData] = useState<AnalyzeApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [learningRecommendations, setLearningRecommendations] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<TechStack | null>(null);

  const repoName = parseRepoParam(repoParam);

  useEffect(() => {
    if (!repoName) return;

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo: repoName }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to analyze repository");
        }
        setRepoData(data);
        
        // Detect tech stack for PDF export
        const detectedStack = detectTechStack(data.techSignals, {
          primaryLanguage: data.repo.language,
          topics: data.repo.topics,
          languages: data.languages,
          description: data.repo.description,
        });
        setTechStack(detectedStack);
        
        // Fetch AI insights for PDF export
        return fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            repo: data.repo,
            scores: data.scores,
            commits: data.commits,
            contributors: data.contributors,
            languages: data.languages,
          }),
        });
      })
      .then(async (insightsRes) => {
        if (insightsRes && insightsRes.ok) {
          const insights = await insightsRes.json();
          setAiSummary(insights.summary || "");
          
          // Combine strengths and recommendation as learning recommendations
          const recommendations: string[] = [];
          if (insights.strengths && Array.isArray(insights.strengths)) {
            recommendations.push(...insights.strengths);
          }
          if (insights.recommendation) {
            recommendations.push(insights.recommendation);
          }
          setLearningRecommendations(recommendations);
        }
      })
      .catch((err) => {
        setApiError(err.message || "An unexpected error occurred");
      });
  }, [repoName]);

  if (apiError) {
    return (
      <main style={{ ...globalStyles.page, background: theme.pageBg, color: theme.primary }}>
        <DotGridBackground isDark={true} />
        <NavBar theme={theme} />
        <div style={{ ...globalStyles.content, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div style={{ ...getGlassSurface(), textAlign: "center", padding: "40px", maxWidth: "400px" }}>
            <p style={{ color: "#ef4444", marginBottom: "20px", fontWeight: 600 }}>{apiError}</p>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                background: theme.primary,
                color: theme.pageBg,
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!repoData) {
    return <DashboardLoader />;
  }

  const statCards: StatCardItem[] = [
    {
      label: "Health Score",
      value: repoData.scores.healthScore,
      color: theme.healthColor,
      Icon: HeartPulse,
    },
    {
      label: "Activity Score",
      value: repoData.scores.activityScore,
      color: theme.activityColor,
      Icon: Activity,
    },
    {
      label: "Complexity Score",
      value: repoData.scores.complexityScore,
      color: theme.complexityColor,
      Icon: GitMerge,
    },
    {
      label: "Risk Level",
      value: `${repoData.scores.riskScore}%`,
      color: theme.riskColor,
      Icon: ShieldAlert,
      subtitle: "Lower is better",
    },
  ];

  return (
    <main
      style={{
        ...globalStyles.page,
        background: theme.pageBg,
        color: theme.primary,
      }}
    >
      <DotGridBackground isDark={true} />

      <NavBar theme={theme} />

      <div style={globalStyles.content}>
        <RepoHeader
          theme={theme}
          repoName={repoData.repo.fullName || repoName}
          repoParam={repoParam}
          chips={{
            stars: repoData.repo.stars,
            forks: repoData.repo.forks,
            language: repoData.repo.language || "N/A",
            lastUpdated: formatRelativeTime(repoData.repo.pushedAt),
          }}
          exportButton={
            techStack ? (
              <ExportPDFButton
                theme={theme}
                repoName={repoData.repo.fullName || repoName}
                data={{
                  repo: repoData.repo,
                  scores: repoData.scores,
                  languages: repoData.languages,
                  techStack: techStack.items.map((item) => ({
                    name: item.name,
                    category: item.category,
                    confidence: item.confidence,
                  })),
                  aiSummary,
                  learningRecommendations,
                  contributors: repoData.contributors,
                }}
              />
            ) : undefined
          }
        />

        <div style={globalStyles.dashboardGrid}>
          <StatCards theme={theme} cards={statCards} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <RadarChart theme={theme} scores={repoData.scores} />
            <AIInsightPanel theme={theme} repoData={repoData} />
          </div>

          <div style={{ marginTop: "20px" }}>
            <CommitTimeline theme={theme} commits={repoData.commits} />
          </div>

          <div style={{ marginTop: "20px" }}>
            <TechStackCard
              theme={theme}
              stack={techStack || detectTechStack(repoData.techSignals, {
                primaryLanguage: repoData.repo.language,
                topics: repoData.repo.topics,
                languages: repoData.languages,
                description: repoData.repo.description,
              })}
            />
          </div>

          <READMEAnalyzer theme={theme} repoName={repoData.repo.fullName} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <SimilarRepositories
            theme={theme}
            repo={repoData.repo}
            techSignals={repoData.techSignals}
          />
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage(): JSX.Element {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardInner />
    </Suspense>
  );
}
