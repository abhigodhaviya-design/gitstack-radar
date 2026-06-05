"use client";
import type { JSX } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { getGlassSurface } from "@/lib/styles";
import type { CompareMetrics, DashboardTheme } from "@/lib/types";

type CompareRadarChartProps = {
  theme: DashboardTheme;
  repo1Name: string;
  repo2Name: string;
  repo1Metrics: CompareMetrics;
  repo2Metrics: CompareMetrics;
};

function getPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation = -90
): { x: number; y: number }[] {
  const points = [];
  const angleStep = (Math.PI * 2) / sides;
  const rotationRad = (rotation * Math.PI) / 180;
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep + rotationRad;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return points;
}

function valueToPx(value: number, maxRadius: number): number {
  return (Math.max(0, Math.min(value, 100)) / 100) * maxRadius;
}

function pointsToSVGString(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function metricsToPoints(
  metrics: CompareMetrics,
  cx: number,
  cy: number,
  maxRadius: number,
  sides: number
): { x: number; y: number }[] {
  const values = [
    metrics.popularity,
    metrics.activity,
    metrics.complexity,
    metrics.maintainability,
    metrics.communityHealth,
  ];
  const angleStep = (Math.PI * 2) / sides;
  const rotationRad = (-90 * Math.PI) / 180;
  return values.map((val, i) => {
    const angle = i * angleStep + rotationRad;
    const r = valueToPx(val, maxRadius);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

const LABELS = [
  "Popularity",
  "Activity",
  "Complexity",
  "Maintainability",
  "Community",
];

export function CompareRadarChart({
  theme,
  repo1Name,
  repo2Name,
  repo1Metrics,
  repo2Metrics,
}: CompareRadarChartProps): JSX.Element {
  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 110;
  const sides = 5;
  const rings = [0.25, 0.5, 0.75, 1];
  const outerRingPoints = getPolygonPoints(cx, cy, maxRadius, sides);
  const repo1Points = metricsToPoints(repo1Metrics, cx, cy, maxRadius, sides);
  const repo2Points = metricsToPoints(repo2Metrics, cx, cy, maxRadius, sides);

  return (
    <div
      style={{
        ...getGlassSurface(),
        width: "100%",
        padding: "clamp(16px, 3vw, 24px)",
        marginTop: "20px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", background: "#4f46e5", borderRadius: "999px" }} />
          <h2 style={{ fontFamily, fontSize: "14px", fontWeight: 600, color: theme.primary, margin: 0 }}>
            Radar Comparison
          </h2>
        </div>
        <div style={{ display: "flex", gap: "16px", fontFamily: monoFamily, fontSize: "10px" }}>
          <span style={{ color: "#4f46e5" }}>● {repo1Name}</span>
          <span style={{ color: theme.secondary }}>○ {repo2Name}</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "12px", overflow: "hidden" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: "400px", maxHeight: "400px" }} preserveAspectRatio="xMidYMid meet">
          {rings.map((ratio, index) => (
            <polygon
              key={`ring-${index}`}
              points={pointsToSVGString(getPolygonPoints(cx, cy, maxRadius * ratio, sides))}
              fill="none"
              stroke={theme.divider}
              strokeWidth={1}
            />
          ))}

          {outerRingPoints.map((p, i) => (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={theme.divider}
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          ))}

          <polygon
            points={pointsToSVGString(repo2Points)}
            fill="rgba(255,255,255,0.04)"
            stroke={theme.secondary}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
          <polygon
            points={pointsToSVGString(repo1Points)}
            fill="rgba(79,70,229,0.15)"
            stroke="#4f46e5"
            strokeWidth={2}
          />

          {repo1Points.map((p, i) => (
            <circle key={`r1-${i}`} cx={p.x} cy={p.y} r={4} fill="#4f46e5" stroke={theme.pageBg} strokeWidth={2} />
          ))}

          {LABELS.map((label, i) => {
            const angleStep = (Math.PI * 2) / sides;
            const rotationRad = (-90 * Math.PI) / 180;
            const angle = i * angleStep + rotationRad;
            const r = maxRadius + 28;
            const lx = cx + r * Math.cos(angle);
            const ly = cy + r * Math.sin(angle);
            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.abs(Math.cos(angle)) > 0.1) {
              textAnchor = Math.cos(angle) > 0 ? "start" : "end";
            }
            return (
              <text
                key={label}
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                style={{ fontFamily, fontSize: "10px", fill: theme.muted }}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
