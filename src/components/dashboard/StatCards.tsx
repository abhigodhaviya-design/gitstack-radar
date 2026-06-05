"use client";
import type { JSX } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { getGlassSurface, globalStyles } from "@/lib/styles";
import type { DashboardTheme, StatCardItem } from "@/lib/types";

type StatCardsProps = {
  theme: DashboardTheme;
  cards: StatCardItem[];
};

export function StatCards({ theme, cards }: StatCardsProps): JSX.Element {
  const isDark = theme.pageBg === "#000000";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
        gap: "20px",
      }}
    >
      {cards.map(({ label, value, color, Icon, subtitle }) => (
        <div
          key={label}
          style={{
            ...getGlassSurface(),
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Icon size={20} color={color} strokeWidth={1.5} />
            <span style={{ ...globalStyles.statLabelSmall, color: theme.secondary }}>
              {label}
            </span>
          </div>
          <div
            style={{
              fontFamily,
              fontSize: "clamp(32px, 8vw, 48px)",
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: "11px",
              color: theme.muted,
              textAlign: "center",
              marginTop: "4px",
            }}
          >
            {subtitle ?? "Out of 100"}
          </div>
        </div>
      ))}
    </div>
  );
}
