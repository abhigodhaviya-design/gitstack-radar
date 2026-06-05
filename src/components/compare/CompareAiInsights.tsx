"use client";
import type { JSX } from "react";
import { Check, Sparkles, TriangleAlert } from "lucide-react";
import { fontFamily, monoFamily } from "@/lib/fonts";
import type { DashboardTheme } from "@/lib/types";

type CompareAiInsightsProps = {
  theme: DashboardTheme;
  summary: string;
  recommendation: string;
  modelBadge?: string;
  strengths1: string[];
  weaknesses1: string[];
  strengths2: string[];
  weaknesses2: string[];
  repo1Name: string;
  repo2Name: string;
};

function ListColumn({
  title,
  color,
  items,
  icon,
  theme,
}: {
  title: string;
  color: string;
  items: string[];
  icon: JSX.Element;
  theme: DashboardTheme;
}): JSX.Element {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${theme.divider}`,
        borderRadius: "12px",
        padding: "14px 16px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: monoFamily,
          fontSize: 10,
          color,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {icon}
        {title}
      </div>
      {items.length === 0 ? (
        <div
          style={{
            fontFamily,
            fontSize: 12,
            color: theme.muted,
            fontStyle: "italic",
          }}
        >
          None reported
        </div>
      ) : (
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
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                fontFamily,
                fontSize: 12,
                color: theme.secondary,
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: color,
                  marginTop: 8,
                  flexShrink: 0,
                }}
              />
              <span style={{ minWidth: 0, flex: 1 }}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CompareAiInsights({
  theme,
  summary,
  recommendation,
  modelBadge = "Groq Llama 3",
  strengths1,
  weaknesses1,
  strengths2,
  weaknesses2,
  repo1Name,
  repo2Name,
}: CompareAiInsightsProps): JSX.Element {
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
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
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
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "rgba(79,70,229,0.1)",
              border: "1px solid rgba(79,70,229,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={16} color="#a5b4fc" />
          </div>
          <h3
            style={{
              fontFamily,
              fontSize: 14,
              fontWeight: 600,
              color: theme.primary,
              margin: 0,
            }}
          >
            AI comparison insights
          </h3>
        </div>
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: 10,
            color: "#a5b4fc",
            background: "rgba(79,70,229,0.1)",
            border: "1px solid rgba(79,70,229,0.25)",
            padding: "3px 10px",
            borderRadius: "999px",
            letterSpacing: "0.06em",
          }}
        >
          {modelBadge}
        </span>
      </div>

      <p
        style={{
          fontFamily,
          fontSize: 13,
          color: theme.secondary,
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {summary}
      </p>

      <div
        style={{
          background: "rgba(74,225,118,0.05)",
          border: "1px solid rgba(74,225,118,0.2)",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <Check size={16} color="#4ae176" style={{ marginTop: 2, flexShrink: 0 }} />
        <p
          style={{
            fontFamily,
            fontSize: 13,
            color: theme.primary,
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {recommendation}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <ListColumn
          title={`${repo1Name} · Strengths`}
          color="#4ae176"
          items={strengths1}
          icon={<Check size={12} color="#4ae176" />}
          theme={theme}
        />
        <ListColumn
          title={`${repo2Name} · Strengths`}
          color="#4ae176"
          items={strengths2}
          icon={<Check size={12} color="#4ae176" />}
          theme={theme}
        />
        <ListColumn
          title={`${repo1Name} · Weaknesses`}
          color={theme.riskColor}
          items={weaknesses1}
          icon={<TriangleAlert size={12} color={theme.riskColor} />}
          theme={theme}
        />
        <ListColumn
          title={`${repo2Name} · Weaknesses`}
          color={theme.riskColor}
          items={weaknesses2}
          icon={<TriangleAlert size={12} color={theme.riskColor} />}
          theme={theme}
        />
      </div>
    </div>
  );
}
