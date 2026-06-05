"use client";

import { ExternalLink, GitFork, Radar, Star, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FC } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { Skeleton } from "@/components/shared/Skeleton";
import type { SimilarRepo } from "@/lib/recommendations";
import type { DashboardTheme, RepoData, TechSignals } from "@/lib/types";

type SimilarRepositoriesProps = {
  theme: DashboardTheme;
  repo: RepoData;
  techSignals?: TechSignals;
};

type LoadingState = "idle" | "loading" | "loaded" | "error";

export const SimilarRepositories: FC<SimilarRepositoriesProps> = ({
  theme,
  repo,
  techSignals,
}) => {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<SimilarRepo[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingState("loading");
      setError("");

      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo, techSignals }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setLoadingState("loaded");
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setError("Unable to load recommendations");
        setLoadingState("error");
      }
    };

    fetchRecommendations();
  }, [repo.fullName, techSignals]);

  const handleViewRepo = (htmlUrl: string) => {
    window.open(htmlUrl, "_blank", "noopener,noreferrer");
  };

  const handleAnalyzeRepo = (fullName: string) => {
    router.push(`/dashboard?repo=${encodeURIComponent(fullName)}`);
  };

  if (loadingState === "loading") {
    return <SkeletonLoader theme={theme} />;
  }

  if (loadingState === "error") {
    return <ErrorState theme={theme} message={error} />;
  }

  if (recommendations.length === 0) {
    return <EmptyState theme={theme} />;
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "clamp(16px, 3vw, 24px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(16px, 3vw, 20px)",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            background: "#a855f7",
            borderRadius: "999px",
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: theme.primary,
            margin: 0,
          }}
        >
          Similar Repositories
        </h2>
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${theme.divider}`,
            padding: "2px 8px",
            borderRadius: "999px",
            letterSpacing: "0.06em",
          }}
        >
          {recommendations.length} found
        </span>
      </div>

      {/* Repository Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
          gap: 16,
        }}
      >
        {recommendations.map((similarRepo) => (
          <RepoCard
            key={similarRepo.fullName}
            repo={similarRepo}
            theme={theme}
            onView={() => handleViewRepo(similarRepo.htmlUrl)}
            onAnalyze={() => handleAnalyzeRepo(similarRepo.fullName)}
          />
        ))}
      </div>
    </div>
  );
};

type RepoCardProps = {
  repo: SimilarRepo;
  theme: DashboardTheme;
  onView: () => void;
  onAnalyze: () => void;
};

const RepoCard: FC<RepoCardProps> = ({ repo, theme, onView, onAnalyze }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isHovered ? "rgba(168,85,247,0.3)" : theme.divider}`,
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={onView}
    >
      {/* Score Badge */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: "6px",
          padding: "2px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <TrendingUp size={10} color="#a855f7" />
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 9,
            color: "#a855f7",
            fontWeight: 600,
          }}
        >
          {repo.score}%
        </span>
      </div>

      {/* Repository Name */}
      <div style={{ paddingRight: "60px" }}>
        <h3
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: theme.primary,
            margin: 0,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {repo.fullName}
        </h3>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily,
          fontSize: 12,
          color: theme.secondary,
          margin: 0,
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "36px",
        }}
      >
        {repo.description || "No description available"}
      </p>

      {/* Match Reasons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {repo.matchReasons.slice(0, 2).map((reason, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                background: "#a855f7",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 10,
                color: theme.muted,
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {reason}
            </span>
          </div>
        ))}
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 8,
          borderTop: `1px solid ${theme.divider}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Star size={11} color={theme.muted} strokeWidth={1.5} />
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 10,
              color: theme.secondary,
            }}
          >
            {repo.stars >= 1000
              ? `${(repo.stars / 1000).toFixed(1)}k`
              : repo.stars.toLocaleString()}
          </span>
        </div>

        {repo.language && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                background: theme.activityColor,
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 10,
                color: theme.secondary,
              }}
            >
              {repo.language}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 4,
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze();
          }}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "8px 12px",
            background: "rgba(168,85,247,0.15)",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "6px",
            color: "#a855f7",
            fontFamily,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(168,85,247,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(168,85,247,0.15)";
          }}
        >
          <Radar size={12} strokeWidth={2.5} />
          Analyze
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 12px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${theme.divider}`,
            borderRadius: "6px",
            color: theme.secondary,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
        >
          <ExternalLink size={12} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

const SkeletonLoader: FC<{ theme: DashboardTheme }> = ({ theme }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <Skeleton width="8px" height="8px" borderRadius="50%" />
        <Skeleton width="150px" height="14px" borderRadius="4px" />
        <Skeleton width="60px" height="20px" borderRadius="999px" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
          gap: 16,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${theme.divider}`,
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Skeleton width="70%" height="14px" borderRadius="4px" />
              <Skeleton width="50px" height="20px" borderRadius="6px" />
            </div>
            <Skeleton width="100%" height="36px" borderRadius="4px" />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Skeleton width="90%" height="10px" borderRadius="4px" />
              <Skeleton width="80%" height="10px" borderRadius="4px" />
            </div>
            <div style={{ display: "flex", gap: 12, paddingTop: 8, borderTop: `1px solid ${theme.divider}` }}>
              <Skeleton width="60px" height="11px" borderRadius="4px" />
              <Skeleton width="80px" height="11px" borderRadius="4px" />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Skeleton width="100%" height="32px" borderRadius="6px" />
              <Skeleton width="48px" height="32px" borderRadius="6px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyState: FC<{ theme: DashboardTheme }> = ({ theme }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <GitFork
        size={48}
        color={theme.muted}
        strokeWidth={1.5}
        style={{ marginBottom: 16, opacity: 0.5 }}
      />
      <h3
        style={{
          fontFamily,
          fontSize: 16,
          fontWeight: 600,
          color: theme.primary,
          margin: "0 0 8px 0",
        }}
      >
        No Similar Repositories Found
      </h3>
      <p
        style={{
          fontFamily,
          fontSize: 13,
          color: theme.muted,
          margin: 0,
          maxWidth: 400,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        We couldn't find repositories similar to this one at the moment. Try analyzing a
        repository with more topics or metadata.
      </p>
    </div>
  );
};

const ErrorState: FC<{ theme: DashboardTheme; message: string }> = ({ theme, message }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily,
          fontSize: 13,
          color: theme.muted,
          margin: 0,
        }}
      >
        {message}
      </p>
    </div>
  );
};
