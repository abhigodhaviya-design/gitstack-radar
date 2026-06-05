"use client";
import type { JSX } from "react";

import { fontFamily, monoFamily } from "@/lib/fonts";
import { globalStyles } from "@/lib/styles";
import { theme } from "@/lib/theme";
import { DotGridBackground } from "@/components/shared/DotGridBackground";
import { NavBar } from "@/components/shared/NavBar";
import { Skeleton } from "@/components/shared/Skeleton";

export function DashboardLoader(): JSX.Element {
  return (
    <main
      style={{
        ...globalStyles.page,
        background: theme.pageBg,
        color: theme.primary,
      }}
    >
      <DotGridBackground isDark={true} />
      <NavBar theme={theme} />
      <div style={globalStyles.content}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: "32px" }}>
          <Skeleton width="min(300px, 80%)" height="28px" borderRadius="6px" style={{ marginBottom: "8px" }} />
          <Skeleton width="min(400px, 100%)" height="14px" borderRadius="4px" style={{ marginBottom: "16px" }} />
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Skeleton width="100px" height="28px" borderRadius="20px" />
            <Skeleton width="100px" height="28px" borderRadius="20px" />
            <Skeleton width="80px" height="28px" borderRadius="20px" />
            <Skeleton width="120px" height="28px" borderRadius="20px" />
          </div>
        </div>

        {/* Stat Cards Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "16px", marginBottom: "20px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${theme.divider}`,
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <Skeleton width="40px" height="40px" borderRadius="8px" />
                <Skeleton width="100px" height="16px" borderRadius="4px" />
              </div>
              <Skeleton width="60px" height="32px" borderRadius="6px" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "20px", marginTop: "20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${theme.divider}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <Skeleton width="150px" height="18px" borderRadius="4px" style={{ marginBottom: "24px" }} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "280px" }}>
              <Skeleton width="min(280px, 100%)" height="min(280px, 100%)" borderRadius="50%" />
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${theme.divider}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <Skeleton width="150px" height="18px" borderRadius="4px" style={{ marginBottom: "16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width="100%" height="60px" borderRadius="8px" />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Skeleton */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${theme.divider}`,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <Skeleton width="150px" height="18px" borderRadius="4px" style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ display: "flex", gap: "16px" }}>
                  <Skeleton width="8px" height="100px" borderRadius="4px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="200px" height="16px" borderRadius="4px" style={{ marginBottom: "8px" }} />
                    <Skeleton width="100%" height="40px" borderRadius="6px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
