"use client";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { Skeleton } from "@/components/shared/Skeleton";
import { getGlassSurface } from "@/lib/styles";
import type { DashboardTheme } from "@/lib/types";

type READMEInsight = {
  qualityScore: number;
  grade: string;
  wordCount: number;
  hasInstallInstructions: boolean;
  hasUsageExamples: boolean;
  hasContributingGuide: boolean;
  hasLicense: boolean;
  hasBadges: boolean;
  strengths: string[];
  improvements: string[];
  summary: string;
};

type READMEAnalyzerProps = {
  theme: DashboardTheme;
  repoName: string;
};

function getGradeStyle(grade: string): { bg: string; border: string; color: string } {
  switch (grade) {
    case "A+":
    case "A":
      return { bg: "rgba(74,225,118,0.12)", border: "rgba(74,225,118,0.3)", color: "#4ae176" };
    case "B":
      return { bg: "rgba(79,70,229,0.12)", border: "rgba(79,70,229,0.3)", color: "#a5b4fc" };
    case "C":
      return { bg: "rgba(255,185,95,0.12)", border: "rgba(255,185,95,0.3)", color: "#ffb95f" };
    default:
      return { bg: "rgba(255,180,171,0.12)", border: "rgba(255,180,171,0.3)", color: "#ffb4ab" };
  }
}

export function READMEAnalyzer({ theme, repoName }: READMEAnalyzerProps): JSX.Element {
  const [insight, setInsight] = useState<READMEInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const isDark = theme.pageBg === "#000000";

  const fetchReadme = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repoName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze README");
      }
      setInsight(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoName]);

  // Delay the progress bar animation so it transitions from 0
  useEffect(() => {
    if (insight) {
      const t = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(t);
    }
  }, [insight]);

  const gradeStyle = insight ? getGradeStyle(insight.grade) : getGradeStyle("F");

  const sectionLabel = (text: string, color: string): React.CSSProperties => ({
    fontFamily: monoFamily,
    fontSize: "10px",
    color,
    letterSpacing: "0.08em",
    marginBottom: "6px",
  });

  const checks: { label: string; key: keyof READMEInsight }[] = [
    { label: "Install Guide", key: "hasInstallInstructions" },
    { label: "Usage Examples", key: "hasUsageExamples" },
    { label: "Contributing", key: "hasContributingGuide" },
    { label: "License", key: "hasLicense" },
    { label: "Badges", key: "hasBadges" },
  ];

  return (
    <div
      style={{
        ...getGlassSurface(),
        width: "100%",
        marginTop: "20px",
        padding: "clamp(16px, 3vw, 24px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes readme-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {loading ? (
        <>
          {/* Header skeleton */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Skeleton width="8px" height="8px" borderRadius="50%" />
            <Skeleton width="140px" height="14px" borderRadius="4px" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton width="120px" height="40px" borderRadius="8px" />
              <Skeleton width="60px" height="32px" borderRadius="8px" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Skeleton width="100%" height="12px" borderRadius="4px" />
              <Skeleton width="90%" height="12px" borderRadius="4px" />
              <Skeleton width="85%" height="12px" borderRadius="4px" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", marginTop: "8px" }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} width="100%" height="28px" borderRadius="6px" />
              ))}
            </div>
            <div style={{ marginTop: "8px" }}>
              <Skeleton width="80px" height="14px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100%" height="10px" borderRadius="4px" style={{ marginBottom: "4px" }} />
              <Skeleton width="100%" height="10px" borderRadius="4px" style={{ marginBottom: "4px" }} />
              <Skeleton width="95%" height="10px" borderRadius="4px" />
            </div>
          </div>
        </>
      ) : error ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <div style={{ width: "8px", height: "8px", background: "#4f46e5", borderRadius: "999px" }} />
            <h2 style={{ fontFamily, fontSize: "14px", fontWeight: 600, color: theme.primary, margin: 0 }}>README Quality</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 0" }}>
            <p style={{ color: theme.riskColor, fontSize: "13px", fontFamily, textAlign: "center", margin: "0 0 16px 0" }}>
              {error}
            </p>
            <button
              type="button"
              onClick={fetchReadme}
              style={{
                background: "rgba(79,70,229,0.1)",
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
        </>
      ) : insight ? (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", background: "#4f46e5", borderRadius: "999px" }} />
              <h2 style={{ fontFamily, fontSize: "14px", fontWeight: 600, color: theme.primary, margin: 0 }}>README Quality</h2>
            </div>
            <div
              style={{
                background: gradeStyle.bg,
                border: `1px solid ${gradeStyle.border}`,
                color: gradeStyle.color,
                fontSize: "16px",
                fontWeight: 700,
                padding: "4px 14px",
                borderRadius: "8px",
                fontFamily,
              }}
            >
              {insight.grade}
            </div>
          </div>

          {/* Quality score bar */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontFamily: monoFamily, fontSize: "10px", color: theme.muted }}>Documentation Score</span>
              <span style={{ fontFamily, fontSize: "13px", fontWeight: 600, color: theme.primary }}>{insight.qualityScore}/100</span>
            </div>
            <div style={{ width: "100%", height: "6px", borderRadius: "999px", background: theme.divider, overflow: "hidden" }}>
              <div
                style={{
                  width: mounted ? `${insight.qualityScore}%` : "0%",
                  height: "100%",
                  borderRadius: "999px",
                  background: gradeStyle.color,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>

          {/* Checklist row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(6px, 1.5vw, 8px)", marginBottom: "20px" }}>
            {checks.map((check) => {
              const val = insight[check.key] as boolean;
              return (
                <span
                  key={check.key}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "clamp(10px, 2vw, 11px)",
                    fontFamily: monoFamily,
                    background: val ? "rgba(74,225,118,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${val ? "rgba(74,225,118,0.25)" : theme.divider}`,
                    color: val ? "#4ae176" : theme.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {val ? "✓" : "✗"} {check.label}
                </span>
              );
            })}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "clamp(20px, 5vw, 32px)", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 100px" }}>
              <div style={{ fontFamily: monoFamily, fontSize: "10px", color: theme.muted, letterSpacing: "0.03em" }}>Word Count</div>
              <div style={{ fontFamily, fontSize: "13px", fontWeight: 600, color: theme.primary, marginTop: "2px" }}>
                {insight.wordCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div style={sectionLabel("SUMMARY", theme.muted)}>SUMMARY</div>
            <div style={{ fontFamily, fontSize: "13px", color: theme.secondary, lineHeight: 1.6 }}>
              {insight.summary}
            </div>
          </div>

          {/* Strengths */}
          {insight.strengths?.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <div style={sectionLabel("STRENGTHS", theme.healthColor)}>STRENGTHS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {insight.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <span style={{ color: "#4f46e5", fontSize: "12px", lineHeight: 1.6 }}>✦</span>
                    <span style={{ fontFamily, fontSize: "12px", color: theme.secondary, lineHeight: 1.6 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {insight.improvements?.length > 0 && (
            <div style={{ marginTop: "14px" }}>
              <div style={sectionLabel("SUGGESTED IMPROVEMENTS", "#ffb95f")}>SUGGESTED IMPROVEMENTS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {insight.improvements.map((imp, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                    <span style={{ color: "#ffb95f", fontSize: "12px", lineHeight: 1.6 }}>→</span>
                    <span style={{ fontFamily, fontSize: "12px", color: theme.secondary, lineHeight: 1.6 }}>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
