"use client";

import { ArrowUpRight, Dot, Globe, Loader2, Radar, Star, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ThemeMode = "dark" | "light";

const fontFamily = "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const monoFamily = "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace";

const themes = {
  dark: {
    pageBg: "#000000",
    primary: "#e4e1ee",
    secondary: "#c7c4d8",
    muted: "#918fa1",
    navbarBg: "rgba(0,0,0,0.85)",
    navbarBorder: "rgba(255,255,255,0.06)",
    toggleBg: "rgba(255,255,255,0.06)",
    toggleBorder: "rgba(255,255,255,0.08)",
    divider: "rgba(255,255,255,0.08)",
    healthColor: "#4ae176",
    activityColor: "#4ae176",
    complexityColor: "#ffb95f",
    riskColor: "#ffb4ab",
  },
  light: {
    pageBg: "#ffffff",
    primary: "#13121b",
    secondary: "#464555",
    muted: "#918fa1",
    navbarBg: "rgba(255,255,255,0.9)",
    navbarBorder: "#e4e1ee",
    toggleBg: "#f0f0f5",
    toggleBorder: "#e4e1ee",
    divider: "#e4e1ee",
    healthColor: "#16a34a",
    activityColor: "#16a34a",
    complexityColor: "#b45309",
    riskColor: "#dc2626",
  },
} satisfies Record<ThemeMode, Record<string, string>>;

const mockData = {
  repoName: "vercel/next.js",
  stars: 124000,
  forks: 26500,
  language: "TypeScript",
  lastUpdated: "2 hours ago",
  healthScore: 94,
  activityScore: 88,
  complexityScore: 72,
  riskLevel: "Low",
  riskScore: 18,
};

type Dot = { x: number; y: number };

function DotGridBackground({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    let dots: Dot[] = [];
    const mouse = {
      currentX: window.innerWidth / 2,
      currentY: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
    };

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      dots = [];
      for (let x = 0; x <= width + 60; x += 60) {
        for (let y = 0; y <= height + 60; y += 60) {
          dots.push({ x, y });
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = event.clientX;
      mouse.targetY = event.clientY;
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const activeDots: Array<Dot & { influence: number }> = [];

      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.08;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.08;

      context.clearRect(0, 0, width, height);

      for (const dot of dots) {
        const distanceToMouse = Math.hypot(dot.x - mouse.currentX, dot.y - mouse.currentY);
        const influence = distanceToMouse < 120 ? 1 - distanceToMouse / 120 : 0;
        const opacity = 0.15 + influence * 0.55;
        const radius = 1.2 + influence * 1.3;
        const colorChannel = isDark ? "255,255,255" : "0,0,0";

        if (distanceToMouse < 150) {
          activeDots.push({ ...dot, influence: 1 - distanceToMouse / 150 });
        }

        context.beginPath();
        context.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${colorChannel},${opacity})`;
        context.fill();
      }

      for (let index = 0; index < activeDots.length; index += 1) {
        for (let nextIndex = index + 1; nextIndex < activeDots.length; nextIndex += 1) {
          const first = activeDots[index];
          const second = activeDots[nextIndex];
          const dotDistance = Math.hypot(first.x - second.x, first.y - second.y);

          if (dotDistance <= 80) {
            const distanceInfluence = 1 - dotDistance / 80;
            const mouseInfluence = Math.min(first.influence, second.influence);
            const lineOpacity = distanceInfluence * mouseInfluence * 0.25;
            const colorChannel = isDark ? "255,255,255" : "0,0,0";

            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(second.x, second.y);
            context.strokeStyle = `rgba(${colorChannel},${lineOpacity})`;
            context.lineWidth = 0.5;
            context.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        ...globalStyles.dotCanvas,
        background: isDark ? "#000000" : "transparent",
      }}
      aria-hidden="true"
    />
  );
}

function DashboardInner() {
  const searchParams = useSearchParams();
  const repoParam = searchParams.get("repo") || "";
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  const theme = themes[themeMode];
  const isDark = themeMode === "dark";

  const repoName = (() => {
    if (!repoParam) return mockData.repoName;
    try {
      const url = new URL(repoParam);
      const path = url.pathname.replace(/^\/|\/$/g, "");
      return path || repoParam.replace(/^https?:\/\//, "").replace(/\/$/, "");
    } catch {
      return repoParam.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }
  })();

  const statCards = [
    {
      label: "Health Score",
      value: mockData.healthScore,
      color: theme.healthColor,
      Icon: Star,
    },
    {
      label: "Activity Score",
      value: mockData.activityScore,
      color: theme.activityColor,
      Icon: Star,
    },
    {
      label: "Complexity Score",
      value: mockData.complexityScore,
      color: theme.complexityColor,
      Icon: TriangleAlert,
    },
    {
      label: "Risk Level",
      value: `${mockData.riskScore}%`,
      color: theme.riskColor,
      Icon: ArrowUpRight,
    },
  ];

  const chipStyle: CSSProperties = {
    ...globalStyles.chip,
    color: theme.secondary,
    borderColor: theme.divider,
  };

  return (
    <main
      style={{
        ...globalStyles.page,
        background: theme.pageBg,
        color: theme.primary,
      }}
    >
      <DotGridBackground isDark={isDark} />

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
        <div
          style={{
            ...globalStyles.themeToggle,
            background: theme.toggleBg,
            borderColor: theme.toggleBorder,
          }}
          aria-label="Theme toggle"
        >
          {(["dark", "light"] as const).map((mode) => {
            const isActive = themeMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setThemeMode(mode)}
                style={{
                  ...globalStyles.themeOption,
                  ...(isActive ? globalStyles.themeOptionActive : undefined),
                  color: isActive ? "white" : theme.muted,
                }}
                aria-pressed={isActive}
              >
                {mode === "dark" ? "Dark" : "Light"}
              </button>
            );
          })}
        </div>
      </nav>

      <div style={globalStyles.content}>
        <div style={globalStyles.repoHeader}>
          <div>
            <h1
              style={{
                fontFamily,
                fontSize: "24px",
                fontWeight: 600,
                color: theme.primary,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {repoName}
            </h1>
            <a
              href={repoParam || `https://github.com/${repoName}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: monoFamily,
                fontSize: "12px",
                color: theme.muted,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <Globe size={12} strokeWidth={1.5} />
              {repoParam || `https://github.com/${repoName}`}
            </a>
          </div>
          <div style={globalStyles.chipRow}>
            <span style={chipStyle}>
              <Star size={12} strokeWidth={1.5} style={{ marginRight: "6px", verticalAlign: "middle" }} />
              {mockData.stars.toLocaleString()} stars
            </span>
            <span style={chipStyle}>
              <Dot size={12} strokeWidth={1.5} style={{ marginRight: "6px", verticalAlign: "middle" }} />
              {mockData.forks.toLocaleString()} forks
            </span>
            <span style={chipStyle}>{mockData.language}</span>
            <span style={chipStyle}>Updated {mockData.lastUpdated}</span>
          </div>
        </div>

        <div style={globalStyles.dashboardGrid}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {statCards.map(({ label, value, color, Icon }) => (
              <div
                key={label}
                style={{
                  ...globalStyles.glassSurface,
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
                    fontSize: "48px",
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
                  Out of 100
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "20px", marginTop: "20px" }}>
            <div
              style={{
                ...globalStyles.glassSurface,
                gridColumn: "span 7",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Radar size={48} strokeWidth={1} color={theme.muted} />
                <p style={{ fontFamily, fontSize: "14px", color: theme.muted }}>
                  Radar Chart — Coming Next
                </p>
              </div>
            </div>
            <div
              style={{
                ...globalStyles.glassSurface,
                gridColumn: "span 5",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.muted}
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 12V2" />
                  <path d="M12 12l6.5 3.5" />
                </svg>
                <p style={{ fontFamily, fontSize: "14px", color: theme.muted }}>
                  AI Insights — Coming Next
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                ...globalStyles.glassSurface,
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ fontFamily, fontSize: "14px", color: theme.muted }}>
                Commit Timeline — Coming Next
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardLoader() {
  const [themeMode] = useState<ThemeMode>("dark");
  const theme = themes[themeMode];
  const isDark = themeMode === "dark";

  return (
    <main
      style={{
        ...globalStyles.page,
        background: theme.pageBg,
        color: theme.primary,
      }}
    >
      <DotGridBackground isDark={isDark} />
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
        <div
          style={{
            ...globalStyles.themeToggle,
            background: theme.toggleBg,
            borderColor: theme.toggleBorder,
          }}
          aria-label="Theme toggle"
        >
          {(["dark", "light"] as const).map((mode) => {
            const isActive = themeMode === mode;
            return (
              <button
                key={mode}
                type="button"
                style={{
                  ...globalStyles.themeOption,
                  ...(isActive ? globalStyles.themeOptionActive : undefined),
                  color: isActive ? "white" : theme.muted,
                }}
                aria-pressed={isActive}
              >
                {mode === "dark" ? "Dark" : "Light"}
              </button>
            );
          })}
        </div>
      </nav>
      <div style={globalStyles.loaderContainer}>
        <div style={{ ...globalStyles.loaderIcon, color: "#4f46e5" }}>
          <Loader2
            size={48}
            color="#4f46e5"
            strokeWidth={1.5}
            style={{ animation: "spin 1s linear infinite" }}
          />
        </div>
        <p
          style={{
            fontFamily,
            fontSize: "16px",
            color: "#c7c4d8",
            marginTop: "16px",
          }}
        >
          Analyzing repository...
        </p>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardInner />
    </Suspense>
  );
}

const globalStyles: Record<string, CSSProperties> = {
  page: {
    alignItems: "flex-start",
    display: "flex",
    fontFamily,
    minHeight: "100vh",
    overflow: "auto",
    padding: 0,
    position: "relative",
    transition: "background 0.2s ease, color 0.2s ease",
  },
  navbar: {
    alignItems: "center",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxSizing: "border-box",
    display: "flex",
    height: "56px",
    justifyContent: "space-between",
    left: 0,
    padding: "0 40px",
    position: "fixed",
    right: 0,
    top: 0,
    width: "100%",
    zIndex: 2,
  },
  brand: {
    alignItems: "center",
    display: "flex",
    gap: "8px",
  },
  brandText: {
    fontFamily,
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  themeToggle: {
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "999px",
    display: "flex",
    padding: "4px",
  },
  themeOption: {
    background: "transparent",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    fontFamily,
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: 1.3,
    padding: "4px 14px",
    transition: "background 0.2s ease, color 0.2s ease",
  },
  themeOptionActive: {
    background: "#4f46e5",
  },
  loaderContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  loaderIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dotCanvas: {
    height: "100%",
    left: 0,
    pointerEvents: "none",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 0,
  },
  spin: {
    animation: "spin 1s linear infinite",
  },
  content: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 40px",
  },
  repoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    paddingTop: "80px",
    paddingBottom: "32px",
  },
  chipRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  chip: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "999px",
    fontFamily: monoFamily,
    fontSize: "12px",
    padding: "6px 14px",
    lineHeight: 1.5,
    display: "inline-flex",
    alignItems: "center",
  },
  dashboardGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  glassSurface: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "24px",
  },
  statLabelSmall: {
    fontFamily,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.4,
  },
};
