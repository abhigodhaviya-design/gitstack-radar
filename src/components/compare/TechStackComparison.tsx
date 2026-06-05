"use client";
import type { ComponentType, JSX } from "react";

import {
  Atom,
  Box,
  Check,
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
  Lightbulb,
  Package,
  Server,
  Share2,
  Shield,
  Sparkles,
  TestTube,
  Triangle,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import type { DashboardTheme, TechItem, TechStackComparison } from "@/lib/types";

type TechStackComparisonProps = {
  theme: DashboardTheme;
  comparison: TechStackComparison;
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

function Section({
  title,
  icon: Icon,
  color,
  items,
  theme,
  emptyLabel,
  countLabel,
}: {
  title: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  items: TechItem[];
  theme: DashboardTheme;
  emptyLabel: string;
  countLabel?: (n: number) => string;
}): JSX.Element {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "12px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: `${color}14`,
              border: `1px solid ${color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={14} color={color} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily,
                fontSize: 13,
                fontWeight: 600,
                color: theme.primary,
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            {countLabel && (
              <div
                style={{
                  fontFamily: monoFamily,
                  fontSize: 10,
                  color: theme.muted,
                  marginTop: 2,
                }}
              >
                {countLabel(items.length)}
              </div>
            )}
          </div>
        </div>
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 11,
            fontWeight: 600,
            color,
            background: `${color}1A`,
            border: `1px solid ${color}33`,
            padding: "2px 10px",
            borderRadius: "999px",
            minWidth: 32,
            textAlign: "center",
          }}
        >
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            fontFamily,
            fontSize: 12,
            color: theme.muted,
            fontStyle: "italic",
            padding: "8px 0",
          }}
        >
          {emptyLabel}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {items.map((item) => (
            <span
              key={item.id}
              title={`${item.name} · ${item.confidence}% confidence`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 10px",
                borderRadius: "8px",
                background: `${color}0F`,
                border: `1px solid ${color}33`,
                fontFamily,
                fontSize: 11,
                fontWeight: 500,
                color: theme.primary,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {(() => {
                const TechIcon = TECH_ICONS[item.id] ?? Hash;
                return <TechIcon size={11} color={color} />;
              })()}
              {item.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TechStackComparisonSection({
  theme,
  comparison,
}: TechStackComparisonProps): JSX.Element {
  const {
    repo1Name,
    repo2Name,
    shared,
    onlyRepo1,
    onlyRepo2,
    counts,
    insights,
  } = comparison;

  const totalUnique = shared.length + onlyRepo1.length + onlyRepo2.length;
  const overlapPct =
    totalUnique > 0 ? Math.round((shared.length / totalUnique) * 100) : 0;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "16px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
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
          <h3
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 600,
              color: theme.primary,
              margin: 0,
            }}
          >
            Tech stack comparison
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.06em",
          }}
        >
          <span>
            <span style={{ color: theme.primary, fontWeight: 600 }}>
              {counts.repo1Total}
            </span>{" "}
            {repo1Name}
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            <span style={{ color: theme.primary, fontWeight: 600 }}>
              {counts.repo2Total}
            </span>{" "}
            {repo2Name}
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            <span style={{ color: "#4ae176", fontWeight: 600 }}>{counts.shared}</span>{" "}
            shared
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            <span style={{ color: theme.primary, fontWeight: 600 }}>
              {overlapPct}%
            </span>{" "}
            overlap
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        <Section
          title="Shared"
          icon={Share2}
          color="#4ae176"
          items={shared}
          theme={theme}
          emptyLabel="No shared technologies detected."
          countLabel={(n) => `${n} used by both`}
        />
        <Section
          title={`Only ${repo1Name}`}
          icon={Check}
          color="#a5b4fc"
          items={onlyRepo1}
          theme={theme}
          emptyLabel={`No unique technologies in ${repo1Name}.`}
          countLabel={(n) => `${n} unique`}
        />
        <Section
          title={`Only ${repo2Name}`}
          icon={Check}
          color="#ffb95f"
          items={onlyRepo2}
          theme={theme}
          emptyLabel={`No unique technologies in ${repo2Name}.`}
          countLabel={(n) => `${n} unique`}
        />
      </div>

      {insights.length > 0 && (
        <div
          style={{
            background: "rgba(79,70,229,0.05)",
            border: "1px solid rgba(79,70,229,0.2)",
            borderRadius: "12px",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Lightbulb size={14} color="#a5b4fc" />
            <span
              style={{
                fontFamily: monoFamily,
                fontSize: 10,
                color: "#a5b4fc",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Stack insights
            </span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {insights.map((insight, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontFamily,
                  fontSize: 12,
                  color: theme.secondary,
                  lineHeight: 1.55,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#a5b4fc",
                    marginTop: 8,
                    flexShrink: 0,
                  }}
                />
                <span style={{ minWidth: 0, flex: 1 }}>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
