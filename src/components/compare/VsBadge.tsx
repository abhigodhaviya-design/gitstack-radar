"use client";
import type { CSSProperties, JSX } from "react";
import { Swords } from "lucide-react";
import { monoFamily } from "@/lib/fonts";
import type { DashboardTheme } from "@/lib/types";

type VsBadgeProps = {
  theme: DashboardTheme;
};

const wrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  padding: "0 8px",
};

const lineStyle: CSSProperties = {
  width: 1,
  flex: 1,
  minHeight: 40,
  background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)",
};

const circleStyle: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(79,70,229,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "8px 0",
  boxShadow: "0 4px 16px rgba(79,70,229,0.15)",
};

export function VsBadge({ theme }: VsBadgeProps): JSX.Element {
  return (
    <>
      <style>{`
        .gitsr-vs-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0 8px;
        }
        .gitsr-vs-line {
          width: 1px;
          flex: 1;
          min-height: 40px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent);
        }
        .gitsr-vs-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(79,70,229,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px 0;
          box-shadow: 0 4px 16px rgba(79,70,229,0.15);
        }
        @media (max-width: 768px) {
          .gitsr-vs-divider {
            flex-direction: row;
            padding: 8px 0;
            width: 100%;
          }
          .gitsr-vs-line {
            width: auto;
            height: 1px;
            min-height: 0;
            min-width: 40px;
            flex: 1;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent);
          }
          .gitsr-vs-circle {
            margin: 0 8px;
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
      <div className="gitsr-vs-divider" style={wrapperStyle} aria-label="versus divider">
        <div className="gitsr-vs-line" style={lineStyle} />
        <div className="gitsr-vs-circle" style={circleStyle}>
          <Swords size={22} color={theme.healthColor} strokeWidth={1.6} />
        </div>
        <div
          style={{
            fontFamily: monoFamily,
            fontSize: 10,
            color: theme.muted,
            letterSpacing: "0.2em",
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          VS
        </div>
        <div className="gitsr-vs-line" style={lineStyle} />
      </div>
    </>
  );
}
