"use client";
import type { ComponentType, JSX } from "react";

import {
  Atom,
  Box,
  Cloud,
  Code,
  Container,
  Cpu,
  Database,
  FileCode,
  FlaskConical,
  Globe,
  Hash,
  Hexagon,
  Layers,
  Package,
  Server,
  Shield,
  Sparkles,
  TestTube,
  Triangle,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import type { DashboardTheme, TechCategory, TechItem, TechStack } from "@/lib/types";

type TechStackCardProps = {
  theme: DashboardTheme;
  stack: TechStack;
};

const CATEGORY_ORDER: TechCategory[] = [
  "Frontend",
  "Backend",
  "Languages",
  "Database",
  "DevOps",
  "Testing",
];

const CATEGORY_ICONS: Record<TechCategory, ComponentType<{ size?: number; color?: string }>> = {
  Frontend: Code,
  Backend: Server,
  Languages: FileCode,
  Database: Database,
  DevOps: Workflow,
  Testing: TestTube,
};

const CATEGORY_COLORS: Record<TechCategory, string> = {
  Frontend: "#a5b4fc",
  Backend: "#4ae176",
  Languages: "#ffb95f",
  Database: "#c084fc",
  DevOps: "#67e8f9",
  Testing: "#f472b6",
};

const TECH_ICONS: Record<string, ComponentType<{ size?: number; color?: string }>> = {
  react: Atom,
  nextjs: Triangle,
  vue: Triangle,
  nuxt: Triangle,
  angular: Shield,
  svelte: Triangle,
  tailwind: Wrench,
  bootstrap: Package,
  materialui: Box,
  nodejs: Hexagon,
  express: Server,
  nestjs: Layers,
  django: Globe,
  flask: FlaskConical,
  fastapi: Zap,
  springboot: Cpu,
  laravel: Layers,
  aspnet: Globe,
  typescript: FileCode,
  javascript: FileCode,
  python: Hash,
  java: Hash,
  csharp: Hash,
  go: Zap,
  rust: Cpu,
  php: Code,
  cpp: Hash,
  c: Code,
  postgresql: Database,
  mysql: Database,
  mongodb: Database,
  redis: Database,
  sqlite: Database,
  firebase: Cloud,
  docker: Container,
  kubernetes: Hexagon,
  "github-actions": Workflow,
  vercel: Triangle,
  netlify: Globe,
  aws: Cloud,
  azure: Cloud,
  gcp: Cloud,
  jest: Sparkles,
  vitest: Zap,
  cypress: Hexagon,
  playwright: Hexagon,
  "testing-library": TestTube,
};

function TechBadge({ item, color }: { item: TechItem; color: string }): JSX.Element {
  const Icon = TECH_ICONS[item.id] ?? Hash;
  const tier =
    item.confidence >= 70 ? "high" : item.confidence >= 40 ? "medium" : "low";

  return (
    <span
      title={`${item.name} · ${item.confidence}% confidence · signals: ${item.sources.join(", ")}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: "8px",
        background:
          tier === "high"
            ? "rgba(79,70,229,0.10)"
            : tier === "medium"
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.02)",
        border:
          tier === "high"
            ? "1px solid rgba(79,70,229,0.25)"
            : "1px solid rgba(255,255,255,0.06)",
        fontFamily,
        fontSize: 12,
        fontWeight: 500,
        color: tier === "high" ? color : "#c7c4d8",
        lineHeight: 1.3,
        whiteSpace: "nowrap",
        maxWidth: "100%",
      }}
    >
      <Icon size={12} color={tier === "high" ? color : "#918fa1"} />
      {item.name}
    </span>
  );
}

function CategorySection({
  category,
  items,
  theme,
}: {
  category: TechCategory;
  items: TechItem[];
  theme: DashboardTheme;
}): JSX.Element | null {
  if (items.length === 0) return null;
  const Icon = CATEGORY_ICONS[category];
  const color = CATEGORY_COLORS[category];

  return (
    <div
      style={{
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
          gap: 8,
        }}
      >
        <Icon size={14} color={color} />
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {category}
        </span>
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 9,
            color,
            background: `${color}1A`,
            border: `1px solid ${color}33`,
            padding: "1px 6px",
            borderRadius: "999px",
          }}
        >
          {items.length}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {items.map((item) => (
          <TechBadge key={item.id} item={item} color={color} />
        ))}
      </div>
    </div>
  );
}

function ConfidenceRing({
  value,
  theme,
}: {
  value: number;
  theme: DashboardTheme;
}): JSX.Element {
  const size = 56;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const color = value >= 70 ? "#4ae176" : value >= 40 ? "#ffb95f" : "#ffb4ab";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
      aria-label={`${value}% confidence`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontSize: 13,
          fontWeight: 700,
          color: theme.primary,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function TechStackCard({ theme, stack }: TechStackCardProps): JSX.Element {
  const detectedCategories = CATEGORY_ORDER.filter(
    (c) => stack.byCategory[c].length > 0
  );

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#4f46e5",
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
            Tech Stack
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
            {stack.totalDetected} detected
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 9,
                color: theme.muted,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Confidence
            </span>
            <span
              style={{
                fontFamily,
                fontSize: 11,
                color: theme.secondary,
              }}
            >
              {stack.totalDetected > 0
                ? `${detectedCategories.length}/6 categories`
                : "No signals"}
            </span>
          </div>
          <ConfidenceRing value={stack.confidence} theme={theme} />
        </div>
      </div>

      {stack.totalDetected === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px dashed ${theme.divider}`,
            borderRadius: "12px",
            padding: "32px 20px",
            textAlign: "center",
            color: theme.muted,
            fontFamily,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          No specific technologies detected from topics, language data, or
          configuration files. This may happen if the repository is private, has
          minimal metadata, or uses uncommon tooling.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 20,
          }}
        >
          {CATEGORY_ORDER.map((category) => (
            <CategorySection
              key={category}
              category={category}
              items={stack.byCategory[category]}
              theme={theme}
            />
          ))}
        </div>
      )}

      <div
        style={{
          paddingTop: 14,
          borderTop: `1px solid ${theme.divider}`,
          fontFamily: monoFamily,
          fontSize: 9,
          color: theme.muted,
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span>Detected from</span>
        <span style={{ color: theme.secondary }}>topics</span>
        <span>·</span>
        <span style={{ color: theme.secondary }}>languages</span>
        <span>·</span>
        <span style={{ color: theme.secondary }}>config files</span>
        <span>·</span>
        <span style={{ color: theme.secondary }}>dependencies</span>
        <span>·</span>
        <span style={{ color: theme.secondary }}>description</span>
      </div>
    </div>
  );
}
