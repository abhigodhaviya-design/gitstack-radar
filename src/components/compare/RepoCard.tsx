"use client";
import type { CSSProperties, JSX } from "react";
import { useEffect, useState } from "react";

import { GitFork, Star, TriangleAlert } from "lucide-react";
import { fontFamily, monoFamily } from "@/lib/fonts";
import type { DashboardTheme, ScoreResult } from "@/lib/types";

type RepoCardRepo = {
  fullName: string;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssuesCount: number;
  language: string | null;
  license: string | null;
  topics: string[];
  pushedAt: string;
};

type RepoCardProps = {
  theme: DashboardTheme;
  repo: RepoCardRepo;
  scores: ScoreResult;
  languages: Record<string, number>;
  isHealthWinner: boolean;
  isOverallWinner: boolean;
  recentCommits: number;
  repoAgeYears: number;
};

function getHealthColor(score: number): string {
  if (score >= 80) return "#4ae176";
  if (score >= 60) return "#ffb95f";
  return "#ffb4ab";
}

function MetricBadge({
  icon,
  label,
}: {
  icon: JSX.Element;
  label: string;
}): JSX.Element {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: "999px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: monoFamily,
        fontSize: 11,
        color: "#c7c4d8",
        fontWeight: 500,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function Tag({
  label,
  primary,
}: {
  label: string;
  primary?: boolean;
}): JSX.Element {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "6px",
        background: primary
          ? "rgba(79,70,229,0.1)"
          : "rgba(255,255,255,0.03)",
        border: primary
          ? "1px solid rgba(79,70,229,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
        fontFamily: monoFamily,
        fontSize: 10,
        color: primary ? "#a5b4fc" : "#918fa1",
        fontWeight: 500,
        letterSpacing: "0.04em",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SubScore({
  label,
  value,
  color,
  theme,
}: {
  label: string;
  value: string | number;
  color: string;
  theme: DashboardTheme;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: monoFamily,
          fontSize: 9,
          color: theme.muted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily,
          fontSize: 15,
          fontWeight: 600,
          color,
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function RepoCard({
  theme,
  repo,
  scores,
  languages,
  isHealthWinner,
  isOverallWinner,
  recentCommits,
  repoAgeYears,
}: RepoCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const owner = repo.fullName.split("/")[0] || "";
  const avatarUrl = owner ? `https://github.com/${owner}.png?size=80` : null;

  const healthColor = getHealthColor(scores.healthScore);
  const ringRadius = 44;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringTargetOffset = ringCircumference * (1 - scores.healthScore / 100);
  const ringCurrentOffset = animateScore ? ringTargetOffset : ringCircumference;

  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([lang]) => lang);

  const cardStyle: CSSProperties = {
    flex: "1 1 320px",
    minWidth: 0,
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${
      isHovered ? "rgba(79,70,229,0.3)" : theme.divider
    }`,
    borderRadius: "16px",
    padding: "clamp(16px, 3vw, 24px)",
    boxShadow: isHovered
      ? "0 8px 24px rgba(0,0,0,0.4)"
      : "0 1px 3px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(14px, 3vw, 20px)",
    transition:
      "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={`${owner} avatar`}
            width={44}
            height={44}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `1px solid ${theme.divider}`,
              flexShrink: 0,
              objectFit: "cover",
              background: "rgba(255,255,255,0.04)",
            }}
            loading="lazy"
          />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 11,
              color: theme.muted,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            {owner}
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 20,
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1.2,
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {repo.name}
          </div>
        </div>
        {isOverallWinner && (
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 9,
              fontWeight: 700,
              color: "#4ae176",
              background: "rgba(74,225,118,0.1)",
              border: "1px solid rgba(74,225,118,0.25)",
              padding: "3px 8px",
              borderRadius: "999px",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            WINNER
          </span>
        )}
      </div>

      {repo.description && (
        <p
          style={{
            fontFamily,
            fontSize: 13,
            color: theme.secondary,
            lineHeight: 1.5,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {repo.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <MetricBadge
          icon={<Star size={12} color="#ffb95f" />}
          label={repo.stars.toLocaleString()}
        />
        <MetricBadge
          icon={<GitFork size={12} color="#a5b4fc" />}
          label={repo.forks.toLocaleString()}
        />
        <MetricBadge
          icon={<TriangleAlert size={12} color="#ffb4ab" />}
          label={`${repo.openIssuesCount} issues`}
        />
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {repo.language && <Tag label={repo.language} primary />}
        {repo.license && <Tag label={repo.license} />}
        {repo.topics.slice(0, 2).map((topic) => (
          <Tag key={topic} label={topic} />
        ))}
        {topLangs
          .filter((l) => l !== repo.language)
          .slice(0, 1)
          .map((lang) => (
            <Tag key={lang} label={lang} />
          ))}
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${theme.divider}`,
          borderRadius: "12px",
          padding: "20px 16px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Health Score
        </div>

        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{ display: "block" }}
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="60"
              r={ringRadius}
              fill="none"
              stroke={healthColor}
              strokeWidth="6"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCurrentOffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{
                transition:
                  "stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily,
                fontSize: 30,
                fontWeight: 700,
                color: theme.primary,
                lineHeight: 1,
              }}
            >
              {scores.healthScore}
            </span>
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 10,
                color: theme.muted,
                marginTop: 2,
              }}
            >
              / 100
            </span>
          </div>
        </div>

        {isHealthWinner && (
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 9,
              fontWeight: 700,
              color: healthColor,
              background: `${healthColor}1A`,
              border: `1px solid ${healthColor}40`,
              padding: "2px 8px",
              borderRadius: "999px",
              letterSpacing: "0.08em",
            }}
          >
            HEALTHIER
          </span>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(8px, 2vw, 12px)",
            width: "100%",
            paddingTop: "12px",
            borderTop: `1px solid ${theme.divider}`,
          }}
        >
          <SubScore
            label="Activity"
            value={scores.activityScore}
            color={theme.activityColor}
            theme={theme}
          />
          <SubScore
            label="Complexity"
            value={scores.complexityScore}
            color={theme.complexityColor}
            theme={theme}
          />
          <SubScore
            label="Risk"
            value={`${scores.riskScore}%`}
            color={theme.riskColor}
            theme={theme}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
          fontFamily: monoFamily,
          fontSize: 10,
          color: theme.muted,
          letterSpacing: "0.04em",
        }}
      >
        <span>
          {recentCommits} <span style={{ opacity: 0.7 }}>commits/30d</span>
        </span>
        <span style={{ opacity: 0.7 }}>·</span>
        <span>
          {repoAgeYears.toFixed(1)}y <span style={{ opacity: 0.7 }}>old</span>
        </span>
      </div>
    </div>
  );
}
