"use client";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { Skeleton } from "@/components/shared/Skeleton";
import { getGlassSurface } from "@/lib/styles";
import type { AnalyzeApiResponse, DashboardTheme } from "@/lib/types";

type AIInsight = {
  summary: string;
  strengths: string[];
  risks: string[];
  recommendation: string;
};

type AIInsightPanelProps = {
  theme: DashboardTheme;
  repoData: AnalyzeApiResponse;
};

export function AIInsightPanel({ theme, repoData }: AIInsightPanelProps): JSX.Element {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isDark = theme.pageBg === "#000000";

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: repoData.repo,
          scores: repoData.scores,
          commits: repoData.commits,
          contributors: repoData.contributors,
          languages: repoData.languages,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch AI insights");
      }
      setInsight(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoData.repo.fullName]);

  return (
    <div
      style={{
        ...getGlassSurface(),
        gridColumn: "span 12",
        minHeight: "420px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .ai-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .ai-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .ai-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.3);
          border-radius: 4px;
        }
        .ai-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.5);
        }
      `}</style>

      {/* Header (always visible) */}
      <div style={{ padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) 0 clamp(16px, 4vw, 24px)", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", background: "#4f46e5", borderRadius: "999px" }} />
            <h2 style={{ fontFamily, fontSize: "14px", fontWeight: 600, color: theme.primary, margin: 0 }}>
              AI Insights
            </h2>
          </div>
          <div
            style={{
              background: "rgba(79, 70, 229, 0.12)",
              border: "1px solid rgba(79, 70, 229, 0.25)",
              color: "#a5b4fc",
              fontSize: "10px",
              padding: "3px 8px",
              borderRadius: "999px",
              fontFamily: monoFamily,
            }}
          >
            Groq Llama 3
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="ai-scrollbar" style={{ flex: 1, padding: "0 clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px) clamp(16px, 4vw, 24px)", overflowY: "auto", overflowX: "hidden", wordWrap: "break-word" }}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
            <Skeleton width="100%" height="12px" borderRadius="4px" />
            <Skeleton width="85%" height="12px" borderRadius="4px" />
            <Skeleton width="90%" height="12px" borderRadius="4px" />
            <div style={{ marginTop: "12px" }}>
              <Skeleton width="80px" height="14px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100%" height="10px" borderRadius="4px" style={{ marginBottom: "4px" }} />
              <Skeleton width="100%" height="10px" borderRadius="4px" style={{ marginBottom: "4px" }} />
              <Skeleton width="90%" height="10px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: "12px" }}>
              <Skeleton width="60px" height="14px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100%" height="10px" borderRadius="4px" style={{ marginBottom: "4px" }} />
              <Skeleton width="95%" height="10px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: "12px" }}>
              <Skeleton width="120px" height="14px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100%" height="10px" borderRadius="4px" style={{ marginBottom: "4px" }} />
              <Skeleton width="88%" height="10px" borderRadius="4px" />
            </div>
          </div>
        ) : error ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <p style={{ color: theme.riskColor, fontSize: "13px", fontFamily, textAlign: "center", margin: "0 0 16px 0" }}>
              {error}
            </p>
            <button
              type="button"
              onClick={fetchInsights}
              style={{
                background: "rgba(79, 70, 229, 0.1)",
                border: "1px solid #4f46e5",
                color: "#4f46e5",
                padding: "6px 12px",
                borderRadius: "6px",
                fontFamily,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        ) : insight ? (
          <div>
            {/* Overview */}
            <div style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
              <div style={{ fontFamily: monoFamily, fontSize: "10px", color: theme.muted, letterSpacing: "0.08em", marginBottom: "6px" }}>
                OVERVIEW
              </div>
              <div style={{ fontFamily, fontSize: "13px", color: theme.secondary, lineHeight: 1.6, wordBreak: "break-word" }}>
                {insight.summary}
              </div>
            </div>

            {/* Strengths */}
            {insight.strengths?.length > 0 && (
              <div style={{ marginTop: "14px", wordBreak: "break-word", overflowWrap: "break-word" }}>
                <div style={{ fontFamily: monoFamily, fontSize: "10px", color: theme.healthColor, letterSpacing: "0.08em", marginBottom: "6px" }}>
                  STRENGTHS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {insight.strengths.map((str, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ color: "#4f46e5", fontSize: "12px", lineHeight: 1.5, flexShrink: 0 }}>✦</span>
                      <span style={{ fontFamily, fontSize: "12px", color: theme.secondary, lineHeight: 1.5, wordBreak: "break-word" }}>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {insight.risks?.length > 0 && (
              <div style={{ marginTop: "14px", wordBreak: "break-word", overflowWrap: "break-word" }}>
                <div style={{ fontFamily: monoFamily, fontSize: "10px", color: theme.riskColor, letterSpacing: "0.08em", marginBottom: "6px" }}>
                  RISKS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {insight.risks.map((risk, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <span style={{ color: theme.riskColor, fontSize: "12px", lineHeight: 1.5, flexShrink: 0 }}>⚠</span>
                      <span style={{ fontFamily, fontSize: "12px", color: theme.secondary, lineHeight: 1.5, wordBreak: "break-word" }}>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {insight.recommendation && (
              <div style={{ marginTop: "14px", wordBreak: "break-word", overflowWrap: "break-word" }}>
                <div style={{ fontFamily: monoFamily, fontSize: "10px", color: "#a5b4fc", letterSpacing: "0.08em", marginBottom: "6px" }}>
                  RECOMMENDATION
                </div>
                <div
                  style={{
                    background: "rgba(79, 70, 229, 0.07)",
                    border: "1px solid rgba(79, 70, 229, 0.15)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontFamily,
                    fontSize: "12px",
                    color: theme.secondary,
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {insight.recommendation}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
