"use client";
import type { JSX } from "react";
import { Crown, Minus, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { fontFamily, monoFamily } from "@/lib/fonts";
import type { CompareWinner, DashboardTheme } from "@/lib/types";

type VsSummaryProps = {
  theme: DashboardTheme;
  repo1Name: string;
  repo2Name: string;
  overallWinner: CompareWinner;
  repo1Health: number;
  repo2Health: number;
  repo1Activity: number;
  repo2Activity: number;
  repo1Stars: number;
  repo2Stars: number;
  bestFor: {
    beginners: CompareWinner;
    production: CompareWinner;
    learning: CompareWinner;
  };
};

function winnerLabel(winner: CompareWinner, a: string, b: string): string {
  if (winner === "repo1") return a;
  if (winner === "repo2") return b;
  return "Tie";
}

function DiffCell({
  label,
  repo1Value,
  repo2Value,
  repo1Name,
  repo2Name,
  format,
  theme,
}: {
  label: string;
  repo1Value: number;
  repo2Value: number;
  repo1Name: string;
  repo2Name: string;
  format: (n: number) => string;
  theme: DashboardTheme;
}): JSX.Element {
  const diff = repo1Value - repo2Value;
  const isRepo1Ahead = diff > 0;
  const isTie = diff === 0;
  const aheadName = isRepo1Ahead ? repo1Name : repo2Name;
  const aheadValue = isRepo1Ahead ? repo1Value : repo2Value;
  const behindValue = isRepo1Ahead ? repo2Value : repo1Value;
  const accent = isTie ? theme.muted : "#4ae176";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
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
        {label}
      </div>
      {isTie ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily,
            fontSize: 13,
            color: theme.secondary,
          }}
        >
          <Minus size={14} color={theme.muted} />
          <span>Both equal at {format(repo1Value)}</span>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily,
            fontSize: 13,
            color: theme.primary,
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          {isRepo1Ahead ? (
            <TrendingUp size={14} color={accent} />
          ) : (
            <TrendingDown size={14} color={accent} />
          )}
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 160,
            }}
          >
            {aheadName} leads
          </span>
          <span
            style={{
              fontFamily: monoFamily,
              fontSize: 11,
              color: accent,
              fontWeight: 500,
              marginLeft: "auto",
            }}
          >
            {format(aheadValue)} vs {format(behindValue)}
          </span>
        </div>
      )}
    </div>
  );
}

function BestForChip({
  label,
  winner,
  repo1Name,
  repo2Name,
  theme,
}: {
  label: string;
  winner: CompareWinner;
  repo1Name: string;
  repo2Name: string;
  theme: DashboardTheme;
}): JSX.Element {
  const isTie = winner === "tie";
  const display = winnerLabel(winner, repo1Name, repo2Name);
  return (
    <div
      style={{
        background: isTie ? "rgba(255,255,255,0.02)" : "rgba(79,70,229,0.06)",
        border: isTie
          ? `1px solid ${theme.divider}`
          : "1px solid rgba(79,70,229,0.2)",
        borderRadius: "10px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: monoFamily,
          fontSize: 10,
          color: theme.muted,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        Best for {label}
      </span>
      <span
        style={{
          fontFamily,
          fontSize: 13,
          color: isTie ? theme.secondary : theme.primary,
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {display}
      </span>
    </div>
  );
}

export function VsSummary({
  theme,
  repo1Name,
  repo2Name,
  overallWinner,
  repo1Health,
  repo2Health,
  repo1Activity,
  repo2Activity,
  repo1Stars,
  repo2Stars,
  bestFor,
}: VsSummaryProps): JSX.Element {
  const isTie = overallWinner === "tie";
  const winnerDisplay = winnerLabel(overallWinner, repo1Name, repo2Name);

  return (
    <div
      style={{
        background: isTie
          ? "rgba(255,255,255,0.02)"
          : "linear-gradient(135deg, rgba(79,70,229,0.06), rgba(74,225,118,0.04))",
        border: isTie
          ? `1px solid ${theme.divider}`
          : "1px solid rgba(79,70,229,0.2)",
        borderRadius: "16px",
        padding: "clamp(16px, 3vw, 20px) clamp(16px, 3vw, 24px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(14px, 3vw, 18px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: isTie
              ? "rgba(255,255,255,0.04)"
              : "rgba(74,225,118,0.1)",
            border: isTie
              ? `1px solid ${theme.divider}`
              : "1px solid rgba(74,225,118,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {isTie ? (
            <Sparkles size={18} color={theme.secondary} />
          ) : (
            <Crown size={18} color="#4ae176" />
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 10,
              color: theme.muted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            Overall winner · AI code quality
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: 700,
              color: theme.primary,
              marginTop: 4,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {isTie ? "Dead heat" : winnerDisplay}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
          gap: 12,
        }}
      >
        <DiffCell
          label="Health score"
          repo1Value={repo1Health}
          repo2Value={repo2Health}
          repo1Name={repo1Name}
          repo2Name={repo2Name}
          format={(n) => `${n}/100`}
          theme={theme}
        />
        <DiffCell
          label="Activity score"
          repo1Value={repo1Activity}
          repo2Value={repo2Activity}
          repo1Name={repo1Name}
          repo2Name={repo2Name}
          format={(n) => `${n}/100`}
          theme={theme}
        />
        <DiffCell
          label="Stars"
          repo1Value={repo1Stars}
          repo2Value={repo2Stars}
          repo1Name={repo1Name}
          repo2Name={repo2Name}
          format={(n) => n.toLocaleString()}
          theme={theme}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
          gap: 10,
          paddingTop: 14,
          borderTop: `1px solid ${theme.divider}`,
        }}
      >
        <BestForChip
          label="Beginners"
          winner={bestFor.beginners}
          repo1Name={repo1Name}
          repo2Name={repo2Name}
          theme={theme}
        />
        <BestForChip
          label="Production"
          winner={bestFor.production}
          repo1Name={repo1Name}
          repo2Name={repo2Name}
          theme={theme}
        />
        <BestForChip
          label="Learning"
          winner={bestFor.learning}
          repo1Name={repo1Name}
          repo2Name={repo2Name}
          theme={theme}
        />
      </div>
    </div>
  );
}
