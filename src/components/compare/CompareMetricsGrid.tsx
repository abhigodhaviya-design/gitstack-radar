"use client";
import type { JSX, ReactNode } from "react";
import {
  Activity,
  Calendar,
  Check,
  Equal,
  GitFork,
  HeartPulse,
  Minus,
  ShieldAlert,
  Star,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { fontFamily, monoFamily } from "@/lib/fonts";
import { formatRelativeTime } from "@/lib/dashboard-data";
import type { CompareWinner, DashboardTheme } from "@/lib/types";

type CompareMetricsGridProps = {
  theme: DashboardTheme;
  repo1Name: string;
  repo2Name: string;
  stars: { r1: number; r2: number; winner: CompareWinner };
  forks: { r1: number; r2: number; winner: CompareWinner };
  openIssues: { r1: number; r2: number; winner: CompareWinner };
  activity: { r1: number; r2: number; winner: CompareWinner };
  health: { r1: number; r2: number; winner: CompareWinner };
  maintainability: { r1: number; r2: number; winner: CompareWinner };
  recentCommits: { r1: number; r2: number; winner: CompareWinner };
  lastUpdated: { r1: string; r2: string; winner: CompareWinner };
  age: { r1: number; r2: number };
};

type MetricIcon = (props: { size?: number; color?: string }) => JSX.Element;

function MetricCard({
  label,
  icon: Icon,
  theme,
  leftValue,
  rightValue,
  winner,
  invertWinner,
  format,
  isLowerBetter,
}: {
  label: string;
  icon: MetricIcon;
  theme: DashboardTheme;
  leftValue: ReactNode;
  rightValue: ReactNode;
  winner: CompareWinner;
  invertWinner?: boolean;
  format?: (raw: ReactNode, isWinner: boolean) => ReactNode;
  isLowerBetter?: boolean;
}): JSX.Element {
  const leftIsWinner = invertWinner
    ? winner === "repo2"
    : winner === "repo1";
  const rightIsWinner = invertWinner
    ? winner === "repo1"
    : winner === "repo2";
  const isTie = winner === "tie";

  const renderValue = (val: ReactNode, isWinner: boolean): ReactNode => {
    if (format) return format(val, isWinner);
    if (isTie) return val;
    if (isWinner) {
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "#4ae176",
            fontWeight: 600,
          }}
        >
          {val}
          <Check size={12} strokeWidth={2.5} />
        </span>
      );
    }
    return (
      <span style={{ color: theme.muted, fontWeight: 400 }}>{val}</span>
    );
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <Icon size={12} color={theme.muted} />
          {label}
        </div>
        {isTie ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontFamily: monoFamily,
              fontSize: 9,
              color: theme.muted,
              letterSpacing: "0.08em",
            }}
          >
            <Equal size={10} color={theme.muted} />
            TIE
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontFamily: monoFamily,
              fontSize: 9,
              color: "#4ae176",
              letterSpacing: "0.08em",
            }}
          >
            <TrendingUp size={10} color="#4ae176" />
            {isLowerBetter ? "LOWER" : "HIGHER"}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 14,
            lineHeight: 1.2,
            textAlign: "left",
          }}
        >
          {renderValue(leftValue, leftIsWinner)}
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 14,
            lineHeight: 1.2,
            textAlign: "right",
          }}
        >
          {renderValue(rightValue, rightIsWinner)}
        </div>
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  return n.toLocaleString();
}

export function CompareMetricsGrid({
  theme,
  repo1Name,
  repo2Name,
  stars,
  forks,
  openIssues,
  activity,
  health,
  maintainability,
  recentCommits,
  lastUpdated,
  age,
}: CompareMetricsGridProps): JSX.Element {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "clamp(16px, 3vw, 20px) clamp(16px, 3vw, 24px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h3
          style={{
            fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: theme.primary,
            margin: 0,
          }}
        >
          Metrics comparison
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.08em",
          }}
        >
          <span
            style={{
              color: "#a5b4fc",
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={repo1Name}
          >
            {repo1Name}
          </span>
          <Minus size={10} color={theme.muted} />
          <span
            style={{
              color: theme.secondary,
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={repo2Name}
          >
            {repo2Name}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          gap: 12,
        }}
      >
        <MetricCard
          label="Stars"
          icon={(p) => <Star {...p} color="#ffb95f" />}
          theme={theme}
          leftValue={formatNum(stars.r1)}
          rightValue={formatNum(stars.r2)}
          winner={stars.winner}
        />
        <MetricCard
          label="Forks"
          icon={(p) => <GitFork {...p} color="#a5b4fc" />}
          theme={theme}
          leftValue={formatNum(forks.r1)}
          rightValue={formatNum(forks.r2)}
          winner={forks.winner}
        />
        <MetricCard
          label="Open issues"
          icon={(p) => <TriangleAlert {...p} color="#ffb4ab" />}
          theme={theme}
          leftValue={formatNum(openIssues.r1)}
          rightValue={formatNum(openIssues.r2)}
          winner={openIssues.winner}
          invertWinner
          isLowerBetter
        />
        <MetricCard
          label="Activity"
          icon={(p) => <Activity {...p} color={theme.activityColor} />}
          theme={theme}
          leftValue={`${activity.r1}/100`}
          rightValue={`${activity.r2}/100`}
          winner={activity.winner}
        />
        <MetricCard
          label="Health"
          icon={(p) => <HeartPulse {...p} color={theme.healthColor} />}
          theme={theme}
          leftValue={`${health.r1}/100`}
          rightValue={`${health.r2}/100`}
          winner={health.winner}
        />
        <MetricCard
          label="Maintainability"
          icon={(p) => <ShieldAlert {...p} color={theme.complexityColor} />}
          theme={theme}
          leftValue={`${maintainability.r1}/100`}
          rightValue={`${maintainability.r2}/100`}
          winner={maintainability.winner}
        />
        <MetricCard
          label="Recent commits (30d)"
          icon={(p) => <Calendar {...p} color="#a5b4fc" />}
          theme={theme}
          leftValue={formatNum(recentCommits.r1)}
          rightValue={formatNum(recentCommits.r2)}
          winner={recentCommits.winner}
        />
        <MetricCard
          label="Last updated"
          icon={(p) => <Calendar {...p} color={theme.healthColor} />}
          theme={theme}
          leftValue={formatRelativeTime(lastUpdated.r1)}
          rightValue={formatRelativeTime(lastUpdated.r2)}
          winner={lastUpdated.winner}
          invertWinner
          isLowerBetter
        />
        <MetricCard
          label="Repo age"
          icon={(p) => <Calendar {...p} color={theme.muted} />}
          theme={theme}
          leftValue={`${age.r1.toFixed(1)}y`}
          rightValue={`${age.r2.toFixed(1)}y`}
          winner={
            age.r1 < age.r2 ? "repo1" : age.r2 < age.r1 ? "repo2" : "tie"
          }
        />
      </div>
    </div>
  );
}
