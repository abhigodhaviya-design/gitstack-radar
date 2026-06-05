"use client";
import type { JSX } from "react";
import { useState } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { getGlassSurface } from "@/lib/styles";
import { formatRelativeTime } from "@/lib/dashboard-data";
import type { CommitData, DashboardTheme } from "@/lib/types";

type DayBucket = {
  date: string;
  label: string;
  count: number;
  commits: CommitData[];
};

type CommitTimelineProps = {
  theme: DashboardTheme;
  commits: CommitData[];
};

function formatDayLabel(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
}

function groupCommitsByDay(commits: CommitData[]): DayBucket[] {
  const bucketMap = new Map<string, CommitData[]>();

  for (const commit of commits) {
    const date = new Date(commit.authorDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const existing = bucketMap.get(key) || [];
    existing.push(commit);
    bucketMap.set(key, existing);
  }

  const today = new Date();
  const buckets: DayBucket[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dayCommits = bucketMap.get(key) || [];
    buckets.push({
      date: key,
      label: formatDayLabel(key),
      count: dayCommits.length,
      commits: dayCommits,
    });
  }

  return buckets;
}

function getBarColor(count: number, divider: string): string {
  if (count === 0) return divider;
  if (count <= 2) return "rgba(79,70,229,0.4)";
  if (count <= 5) return "rgba(79,70,229,0.7)";
  return "#4f46e5";
}

export function CommitTimeline({ theme, commits }: CommitTimelineProps): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isDark = theme.pageBg === "#000000";

  const buckets = groupCommitsByDay(commits);
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);
  const totalCommits = buckets.reduce((sum, b) => sum + b.count, 0);
  const activeDays = buckets.filter((b) => b.count > 0).length;

  const mostActiveIdx = buckets.reduce((best, b, i, arr) => (b.count > arr[best].count ? i : best), 0);
  const mostActiveLabel = buckets[mostActiveIdx].label;

  const barWidth = 20;
  const barGap = 10;
  const maxBarHeight = 100;
  const chartPaddingTop = 24;
  const chartPaddingBottom = 20;
  const chartPaddingLeft = 0;
  const svgHeight = chartPaddingTop + maxBarHeight + chartPaddingBottom;
  const svgWidth = buckets.length * (barWidth + barGap) - barGap;

  const chipStyle: React.CSSProperties = {
    background: "rgba(79,70,229,0.08)",
    border: "1px solid rgba(79,70,229,0.15)",
    color: theme.secondary,
    fontSize: "11px",
    padding: "4px 10px",
    borderRadius: "999px",
    fontFamily: monoFamily,
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontFamily: monoFamily,
    fontSize: "10px",
    color: theme.muted,
    letterSpacing: "0.03em",
  };

  const sectionValueStyle: React.CSSProperties = {
    fontFamily,
    fontSize: "13px",
    fontWeight: 600,
    color: theme.primary,
    marginTop: "2px",
  };

  return (
    <div
      style={{
        ...getGlassSurface(),
        width: "100%",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", background: "#4f46e5", borderRadius: "999px" }} />
          <h2 style={{ fontFamily, fontSize: "14px", fontWeight: 600, color: theme.primary, margin: 0 }}>
            Commit Activity
          </h2>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={chipStyle}>{totalCommits} commits</span>
          <span style={chipStyle}>{activeDays} active days</span>
        </div>
      </div>

      {/* Chart Area */}
      <div style={{ position: "relative", width: "100%", overflowX: "auto", overflowY: "hidden" }}>
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMinYMid meet"
          style={{ display: "block", minWidth: "600px" }}
        >
          {/* Peak label */}
          <text
            x={0}
            y={12}
            style={{ fontFamily: monoFamily, fontSize: "9px" }}
            fill={theme.muted}
          >
            peak: {maxCount}
          </text>

          {/* Bars */}
          {buckets.map((bucket, i) => {
            const barHeight = bucket.count === 0 ? 2 : (bucket.count / maxCount) * maxBarHeight;
            const x = chartPaddingLeft + i * (barWidth + barGap);
            const y = chartPaddingTop + maxBarHeight - barHeight;
            const isHovered = hoveredIndex === i;

            return (
              <g key={bucket.date}>
                {/* Invisible wider hit area for hover */}
                <rect
                  x={x - 2}
                  y={chartPaddingTop}
                  width={barWidth + 4}
                  height={maxBarHeight + chartPaddingBottom}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                />
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={3}
                  ry={3}
                  fill={isHovered ? "#4f46e5" : getBarColor(bucket.count, theme.divider)}
                  opacity={isHovered ? 1 : 0.9}
                  style={{ transition: "fill 0.15s ease, opacity 0.15s ease", pointerEvents: "none" }}
                />
                {/* X-axis labels — every 5th day */}
                {i % 5 === 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={chartPaddingTop + maxBarHeight + 14}
                    textAnchor="middle"
                    style={{ fontFamily: monoFamily, fontSize: "9px" }}
                    fill={theme.muted}
                  >
                    {bucket.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip overlay */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: "absolute",
              left: `${((hoveredIndex * (barWidth + barGap) + barWidth / 2) / svgWidth) * 100}%`,
              top: "0px",
              transform: "translateX(-50%)",
              background: theme.navbarBg,
              border: `1px solid ${theme.divider}`,
              borderRadius: "6px",
              padding: "6px 10px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            <div style={{ fontFamily, fontSize: "12px", color: theme.primary, fontWeight: 600 }}>
              {buckets[hoveredIndex].label} · {buckets[hoveredIndex].count} commit{buckets[hoveredIndex].count !== 1 ? "s" : ""}
            </div>
            {buckets[hoveredIndex].count > 0 && buckets[hoveredIndex].commits[0] && (
              <div style={{ fontFamily, fontSize: "10px", color: theme.muted, marginTop: "2px" }}>
                {buckets[hoveredIndex].commits[0].message.length > 40
                  ? buckets[hoveredIndex].commits[0].message.slice(0, 40) + "…"
                  : buckets[hoveredIndex].commits[0].message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary row */}
      <div style={{ marginTop: "16px", display: "flex", gap: "clamp(12px, 3vw, 24px)", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 100px" }}>
          <div style={sectionLabelStyle}>Avg per day</div>
          <div style={sectionValueStyle}>{(totalCommits / 30).toFixed(1)}</div>
        </div>
        <div style={{ width: "1px", background: theme.divider, alignSelf: "stretch", display: "none" }} className="summary-divider" />
        <div style={{ flex: "1 1 100px" }}>
          <div style={sectionLabelStyle}>Most active</div>
          <div style={sectionValueStyle}>{mostActiveLabel}</div>
        </div>
        <div style={{ width: "1px", background: theme.divider, alignSelf: "stretch", display: "none" }} className="summary-divider" />
        <div style={{ flex: "1 1 100px" }}>
          <div style={sectionLabelStyle}>Last commit</div>
          <div style={sectionValueStyle}>
            {commits.length > 0 ? formatRelativeTime(commits[0].authorDate) : "N/A"}
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 640px) {
          .summary-divider {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
