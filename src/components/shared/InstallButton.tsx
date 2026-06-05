"use client";
import type { CSSProperties, JSX } from "react";

import { Download } from "lucide-react";
import { usePwaInstall } from "@/lib/use-pwa-install";

const baseStyle: CSSProperties = {
  alignItems: "center",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "999px",
  color: "#e4e1ee",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily:
    "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: "13px",
  fontWeight: 500,
  gap: "6px",
  lineHeight: 1.3,
  padding: "6px 14px",
  transition:
    "background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease",
  outline: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
};

const installedStyle: CSSProperties = {
  ...baseStyle,
  color: "#4ae176",
  cursor: "default",
  background: "rgba(74,225,118,0.08)",
  border: "1px solid rgba(74,225,118,0.2)",
};

export function InstallButton(): JSX.Element | null {
  const { isInstallable, isInstalled, isInstalling, install } = usePwaInstall();

  // Already installed — show Installed badge
  if (isInstalled) {
    return (
      <span style={installedStyle} aria-label="App is installed">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4ae176"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Installed
      </span>
    );
  }

  // Not installable — hide
  if (!isInstallable) return null;

  // Show install button
  return (
    <button
      type="button"
      onClick={install}
      disabled={isInstalling}
      aria-label="Install GitStack Radar App"
      style={{
        ...baseStyle,
        opacity: isInstalling ? 0.6 : 1,
        pointerEvents: isInstalling ? "none" : "auto",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(79,70,229,0.12)";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(79,70,229,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,0.05)";
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(255,255,255,0.08)";
      }}
    >
      <Download size={14} strokeWidth={2} />
      {isInstalling ? "Installing..." : "Install App"}
    </button>
  );
}
