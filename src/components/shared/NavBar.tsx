"use client";
import type { JSX } from "react";

import { Radar } from "lucide-react";
import Link from "next/link";
import { globalStyles } from "@/lib/styles";
import type { DashboardTheme } from "@/lib/types";

type NavBarProps = {
  theme: DashboardTheme;
  showCompareLink?: boolean;
};

export function NavBar({
  theme,
  showCompareLink = false,
}: NavBarProps): JSX.Element {
  return (
    <nav
      style={{
        ...globalStyles.navbar,
        background: theme.navbarBg,
        borderBottomColor: theme.navbarBorder,
      }}
      aria-label="Main navigation"
    >
      <Link href="/" style={{ ...globalStyles.brand, textDecoration: "none" }}>
        <Radar size={20} color="#4f46e5" strokeWidth={1.5} />
        <span style={{ ...globalStyles.brandText, color: theme.primary }}>
          GitStack Radar
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {showCompareLink && (
          <Link
            href="/compare"
            style={{
              fontFamily: globalStyles.brandText.fontFamily,
              fontSize: "13px",
              fontWeight: 500,
              color: theme.muted,
              textDecoration: "none",
            }}
          >
            Compare
          </Link>
        )}
      </div>
    </nav>
  );
}
