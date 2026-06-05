"use client";
import type { JSX } from "react";

import { fontFamily } from "@/lib/fonts";
import { getGlassSurface } from "@/lib/styles";
import type { DashboardTheme } from "@/lib/types";

type RadarChartProps = {
  theme: DashboardTheme;
  scores: {
    healthScore: number;
    activityScore: number;
    complexityScore: number;
    riskScore: number;
  };
};

function getPolygonPoints(cx: number, cy: number, radius: number, sides: number, rotation: number = -90): { x: number; y: number }[] {
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

function valueToPx(value: number, maxValue: number, maxRadius: number): number {
  return (Math.max(0, Math.min(value, maxValue)) / maxValue) * maxRadius;
}

function pointsToSVGString(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function RadarChart({ theme, scores }: RadarChartProps): JSX.Element {
  const isDark = theme.pageBg === "#000000";

  const width = 340;
  const height = 340;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = 90;
  const sides = 5;

  const momentumScore = Math.round((scores.healthScore + scores.activityScore) / 2);
  const dataValues = [
    scores.healthScore,
    scores.activityScore,
    scores.complexityScore,
    scores.riskScore,
    momentumScore,
  ];

  const labels = [
    { name: "Health", value: scores.healthScore },
    { name: "Activity", value: scores.activityScore },
    { name: "Complexity", value: scores.complexityScore },
    { name: "Risk", value: scores.riskScore },
    { name: "Momentum", value: momentumScore },
  ];

  const rings = [0.25, 0.5, 0.75, 1];
  const outerRingPoints = getPolygonPoints(cx, cy, maxRadius, sides);

  const dataPoints = dataValues.map((val, i) => {
    const angleStep = (Math.PI * 2) / sides;
    const rotationRad = (-90 * Math.PI) / 180;
    const angle = i * angleStep + rotationRad;
    const r = valueToPx(val, 100, maxRadius);
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <div
      style={{
        ...getGlassSurface(),
        gridColumn: "span 12",
        minHeight: "420px",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(16px, 4vw, 24px)",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            background: "#4f46e5",
            borderRadius: "999px",
          }}
        />
        <div>
          <h2
            style={{
              fontFamily,
              fontSize: "14px",
              fontWeight: 600,
              color: theme.primary,
              margin: 0,
            }}
          >
            Repo Radar
          </h2>
          <p
            style={{
              fontFamily,
              fontSize: "11px",
              color: theme.muted,
              margin: "4px 0 0 0",
            }}
          >
            Multi-dimensional repository analysis
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
          minHeight: "280px",
          width: "100%",
          position: "relative",
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`}
          style={{ 
            maxWidth: "100%", 
            maxHeight: "340px", 
            height: "auto",
            display: "block",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="radar-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4f46e5" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Grid Rings */}
          {rings.map((ratio, index) => (
            <polygon
              key={`ring-${index}`}
              points={pointsToSVGString(
                getPolygonPoints(cx, cy, maxRadius * ratio, sides)
              )}
              fill="none"
              stroke={theme.divider}
              strokeWidth={1}
            />
          ))}

          {/* Axis Lines */}
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

          {/* Data Polygon */}
          <polygon
            points={pointsToSVGString(dataPoints)}
            fill="rgba(79,70,229,0.15)"
            stroke="#4f46e5"
            strokeWidth={2}
            filter="url(#radar-shadow)"
          />

          {/* Data Dots */}
          {dataPoints.map((p, i) => (
            <circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#4f46e5"
              stroke={theme.pageBg}
              strokeWidth={2}
            />
          ))}

          {/* Axis Labels */}
          {labels.map((label, i) => {
            const angleStep = (Math.PI * 2) / sides;
            const rotationRad = (-90 * Math.PI) / 180;
            const angle = i * angleStep + rotationRad;
            // Place label 20px beyond outer ring
            const r = maxRadius + 20;
            const lx = cx + r * Math.cos(angle);
            const ly = cy + r * Math.sin(angle);

            // Adjust text anchoring based on position
            let textAnchor: "middle" | "start" | "end" = "middle";
            if (Math.abs(Math.cos(angle)) > 0.1) {
              textAnchor = Math.cos(angle) > 0 ? "start" : "end";
            }

            return (
              <g key={`label-${i}`} transform={`translate(${lx}, ${ly})`}>
                <text
                  x={0}
                  y={0}
                  textAnchor={textAnchor}
                  style={{
                    fontFamily,
                    fontSize: "10px",
                    fill: theme.secondary,
                  }}
                >
                  {label.name}
                </text>
                <text
                  x={0}
                  y={14}
                  textAnchor={textAnchor}
                  style={{
                    fontFamily,
                    fontSize: "12px",
                    fontWeight: 700,
                    fill: theme.primary,
                  }}
                >
                  {label.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
