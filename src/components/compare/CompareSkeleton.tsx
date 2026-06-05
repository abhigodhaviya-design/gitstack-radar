"use client";
import type { CSSProperties, JSX } from "react";

import type { DashboardTheme } from "@/lib/types";

type CompareSkeletonProps = {
  theme: DashboardTheme;
};

function PulseBar({
  bg,
  width,
  height = 12,
  style,
}: {
  bg: string;
  width?: string;
  height?: number;
  style?: CSSProperties;
}): JSX.Element {
  return (
    <div
      style={{
        height,
        width,
        borderRadius: "6px",
        background: bg,
        animation: "compare-pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

export function CompareSkeleton({ theme }: CompareSkeletonProps): JSX.Element {
  const barBg = theme.divider;

  return (
    <>
      <style>{`
        @keyframes compare-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (max-width: 900px) {
          .gitsr-compare-skel-row {
            flex-direction: column !important;
          }
        }
      `}</style>
      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <PulseBar bg={barBg} width="80px" height={10} />
          <PulseBar bg={barBg} width="240px" height={20} />
        </div>

        <div
          className="gitsr-compare-skel-row"
          style={{ display: "flex", alignItems: "stretch", gap: 8 }}
        >
          {[1, 2].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                minWidth: 0,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${theme.divider}`,
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <PulseBar bg={barBg} width="44px" height={44} style={{ borderRadius: "50%" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <PulseBar bg={barBg} width="60px" height={10} />
                  <PulseBar bg={barBg} width="160px" height={16} />
                </div>
              </div>
              <PulseBar bg={barBg} width="100%" height={12} />
              <div style={{ display: "flex", gap: 6 }}>
                <PulseBar bg={barBg} width="60px" height={20} style={{ borderRadius: "999px" }} />
                <PulseBar bg={barBg} width="60px" height={20} style={{ borderRadius: "999px" }} />
                <PulseBar bg={barBg} width="80px" height={20} style={{ borderRadius: "999px" }} />
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${theme.divider}`,
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <PulseBar bg={barBg} width="80px" height={10} />
                <PulseBar bg={barBg} width="120px" height={120} style={{ borderRadius: "50%" }} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 12,
                    width: "100%",
                    paddingTop: 12,
                  }}
                >
                  <PulseBar bg={barBg} width="100%" height={30} />
                  <PulseBar bg={barBg} width="100%" height={30} />
                  <PulseBar bg={barBg} width="100%" height={30} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${theme.divider}`,
            borderRadius: "16px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <PulseBar bg={barBg} width="100%" height={48} style={{ borderRadius: "10px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <PulseBar bg={barBg} width="100%" height={68} style={{ borderRadius: "12px" }} />
            <PulseBar bg={barBg} width="100%" height={68} style={{ borderRadius: "12px" }} />
            <PulseBar bg={barBg} width="100%" height={68} style={{ borderRadius: "12px" }} />
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${theme.divider}`,
            borderRadius: "16px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <PulseBar bg={barBg} width="160px" height={14} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <PulseBar
                key={n}
                bg={barBg}
                width="100%"
                height={72}
                style={{ borderRadius: "12px" }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${theme.divider}`,
            borderRadius: "16px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <PulseBar bg={barBg} width="100%" height={280} style={{ borderRadius: "12px" }} />
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${theme.divider}`,
            borderRadius: "16px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <PulseBar bg={barBg} width="220px" height={16} />
          <PulseBar bg={barBg} width="100%" height={48} style={{ borderRadius: "12px" }} />
          <PulseBar bg={barBg} width="100%" height={48} style={{ borderRadius: "12px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <PulseBar bg={barBg} width="100%" height={120} style={{ borderRadius: "12px" }} />
            <PulseBar bg={barBg} width="100%" height={120} style={{ borderRadius: "12px" }} />
          </div>
        </div>
      </div>
    </>
  );
}
