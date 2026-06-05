"use client";
import type { JSX, ReactNode } from "react";

import { Dot, Globe, Star } from "lucide-react";
import type { CSSProperties } from "react";
import { fontFamily, monoFamily } from "@/lib/fonts";
import { globalStyles } from "@/lib/styles";
import type { DashboardTheme } from "@/lib/types";

type RepoHeaderChips = {
  stars: number;
  forks: number;
  language: string;
  lastUpdated: string;
};

type RepoHeaderProps = {
  theme: DashboardTheme;
  repoName: string;
  repoParam: string;
  chips: RepoHeaderChips;
  exportButton?: ReactNode;
};

export function RepoHeader({ theme, repoName, repoParam, chips, exportButton }: RepoHeaderProps): JSX.Element {
  const chipStyle: CSSProperties = {
    ...globalStyles.chip,
    color: theme.secondary,
    borderColor: theme.divider,
  };

  return (
    <div style={{ ...globalStyles.repoHeader, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
      <div style={{ minWidth: 0, flex: "1 1 300px" }}>
        <h1
          style={{
            fontFamily,
            fontSize: "clamp(18px, 4vw, 24px)",
            fontWeight: 600,
            color: theme.primary,
            margin: 0,
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {repoName}
        </h1>
        <a
          href={repoParam || `https://github.com/${repoName}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: monoFamily,
            fontSize: "clamp(10px, 2vw, 12px)",
            color: theme.muted,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "4px",
            wordBreak: "break-all",
            maxWidth: "100%",
          }}
        >
          <Globe size={12} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {repoParam || `https://github.com/${repoName}`}
          </span>
        </a>
        <div style={{ ...globalStyles.chipRow, marginTop: "12px" }}>
          <span style={chipStyle}>
            <Star size={12} strokeWidth={1.5} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            {chips.stars.toLocaleString()} stars
          </span>
          <span style={chipStyle}>
            <Dot size={12} strokeWidth={1.5} style={{ marginRight: "6px", verticalAlign: "middle" }} />
            {chips.forks.toLocaleString()} forks
          </span>
          <span style={chipStyle}>{chips.language}</span>
          <span style={chipStyle}>Updated {chips.lastUpdated}</span>
        </div>
      </div>
      {exportButton && (
        <div style={{ marginTop: "8px", flexShrink: 0 }}>
          {exportButton}
        </div>
      )}
    </div>
  );
}
