"use client";

import { Activity, Radar, ShieldAlert, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type ThemeMode = "dark" | "light";

const fontFamily =
  "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const monoFamily =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace";

const themes = {
  dark: {
    pageBg: "#000000",
    primary: "#e4e1ee",
    secondary: "#c7c4d8",
    muted: "#918fa1",
    inputBg: "rgba(255,255,255,0.03)",
    inputBorder: "rgba(255,255,255,0.1)",
    badgeBg: "rgba(79,70,229,0.15)",
    badgeBorder: "rgba(79,70,229,0.3)",
    badgeColor: "#c3c0ff",
    footer: "#464555",
    divider: "rgba(255,255,255,0.08)",
    navbarBg: "rgba(0,0,0,0.85)",
    navbarBorder: "rgba(255,255,255,0.06)",
    toggleBg: "rgba(255,255,255,0.05)",
    toggleBorder: "rgba(255,255,255,0.08)",
    inputFocusShadow: "rgba(79,70,229,0.2)",
    glowBg:
      "radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 70%)",
    healthColor: "#4ae176",
    riskColor: "#ffb95f",
    insightColor: "#c3c0ff",
  },
  light: {
    pageBg: "#ffffff",
    primary: "#13121b",
    secondary: "#464555",
    muted: "#918fa1",
    inputBg: "#ffffff",
    inputBorder: "#d1d0dd",
    badgeBg: "rgba(79,70,229,0.1)",
    badgeBorder: "rgba(79,70,229,0.25)",
    badgeColor: "#4f46e5",
    footer: "#c7c4d8",
    divider: "#e4e1ee",
    navbarBg: "rgba(255,255,255,0.9)",
    navbarBorder: "#e4e1ee",
    toggleBg: "#f0f0f5",
    toggleBorder: "#e4e1ee",
    inputFocusShadow: "rgba(79,70,229,0.15)",
    glowBg:
      "radial-gradient(ellipse, rgba(79,70,229,0.05) 0%, transparent 70%)",
    healthColor: "#16a34a",
    riskColor: "#b45309",
    insightColor: "#4f46e5",
  },
} satisfies Record<ThemeMode, Record<string, string>>;

const featureHints = [
  {
    Icon: Activity,
    colorKey: "healthColor",
    text: "Health Score",
  },
  {
    Icon: ShieldAlert,
    colorKey: "riskColor",
    text: "Risk Detection",
  },
  {
    Icon: Sparkles,
    colorKey: "insightColor",
    text: "AI Insights",
  },
] as const;

const stats = [
  ["500+", "Repos Analyzed"],
  ["20+", "Metrics Tracked"],
  ["AI", "Powered Analysis"],
  ["Free", "No Signup Needed"],
];

type Dot = {
  x: number;
  y: number;
};

function DotGridBackground({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

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
        const distanceToMouse = Math.hypot(
          dot.x - mouse.currentX,
          dot.y - mouse.currentY,
        );
        const influence =
          distanceToMouse < 120 ? 1 - distanceToMouse / 120 : 0;
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
        ...styles.dotCanvas,
        background: isDark ? "#000000" : "transparent",
      }}
      aria-hidden="true"
    />
  );
}

export default function HomePage() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  const theme = themes[themeMode];
  const isDark = themeMode === "dark";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = repoUrl.trim();

    if (!value) {
      setHasError(true);
      return;
    }

    setIsLoading(true);
    router.push(`/dashboard?repo=${encodeURIComponent(value)}`);
  };

  const inputBorderColor = hasError
    ? "#ffb4ab"
    : isFocused
      ? "#4f46e5"
      : theme.inputBorder;

  return (
    <main
      style={{
        ...styles.page,
        background: theme.pageBg,
        color: theme.primary,
      }}
    >
      <DotGridBackground isDark={isDark} />

      <nav
        style={{
          ...styles.navbar,
          background: theme.navbarBg,
          borderBottomColor: theme.navbarBorder,
        }}
        aria-label="Main navigation"
      >
        <div style={styles.brand}>
          <Radar size={20} color="#4f46e5" strokeWidth={2.2} />
          <span style={{ ...styles.brandText, color: theme.primary }}>
            GitStack Radar
          </span>
        </div>

        <div
          style={{
            ...styles.themeToggle,
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
                  ...styles.themeOption,
                  ...(isActive ? styles.themeOptionActive : undefined),
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

      <div style={{ ...styles.glow, background: theme.glowBg }} />

      <section style={styles.hero} aria-labelledby="home-title">
        <div
          style={{
            ...styles.badge,
            background: theme.badgeBg,
            borderColor: theme.badgeBorder,
            color: theme.badgeColor,
          }}
        >
          AI-Powered Repository Intelligence
        </div>

        <h1 id="home-title" style={{ ...styles.heading, color: theme.primary }}>
          <span style={styles.headingLine}>Analyze Any GitHub</span>
          <span style={styles.headingLine}>Repository Instantly</span>
        </h1>

        <p style={{ ...styles.subheading, color: theme.secondary }}>
          <span style={styles.subheadingLine}>
            Get AI-powered health scores, risk analysis, activity insights
          </span>
          <span style={styles.subheadingLine}>
            and learning recommendations for any public repository.
          </span>
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputRow}>
            <input
              type="text"
              value={repoUrl}
              disabled={isLoading}
              placeholder="https://github.com/username/repo"
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onChange={(event) => {
                setRepoUrl(event.target.value);
                if (hasError) {
                  setHasError(false);
                }
              }}
              style={{
                ...styles.input,
                background: theme.inputBg,
                borderColor: inputBorderColor,
                boxShadow: isFocused
                  ? `0 0 0 3px ${theme.inputFocusShadow}`
                  : "none",
                color: theme.primary,
              }}
              aria-label="GitHub repository URL"
              aria-invalid={hasError}
            />

            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                ...styles.button,
                background: isHovered && !isLoading ? "#3730a3" : "#4f46e5",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          <div style={styles.featureRow} aria-label="Repository analysis features">
            {featureHints.map(({ Icon, colorKey, text }) => {
              const color = theme[colorKey];

              return (
              <span key={text} style={{ ...styles.featureHint, color }}>
                <Icon size={16} color={color} strokeWidth={2.2} />
                {text}
              </span>
              );
            })}
          </div>

          <div style={styles.statsRow} aria-label="GitStack Radar stats">
            {stats.map(([label, sublabel], index) => (
              <div
                key={label}
                style={{
                  ...styles.statItem,
                  borderLeft:
                    index === 0 ? "none" : `1px solid ${theme.divider}`,
                }}
              >
                <div style={{ ...styles.statLabel, color: theme.primary }}>
                  {label}
                </div>
                <div style={{ ...styles.statSublabel, color: theme.muted }}>
                  {sublabel}
                </div>
              </div>
            ))}
          </div>
        </form>
      </section>

      <footer style={{ ...styles.footer, color: theme.footer }}>
        Built with Next.js · GitHub API · Gemini AI
      </footer>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    alignItems: "center",
    display: "flex",
    fontFamily,
    justifyContent: "center",
    minHeight: "100vh",
    overflow: "hidden",
    padding: "80px 24px 96px",
    position: "relative",
    transition: "background 0.2s ease, color 0.2s ease",
  },
  navbar: {
    alignItems: "center",
    backdropFilter: "blur(12px)",
    background: "rgba(0,0,0,0.85)",
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
    background: "rgba(255,255,255,0.06)",
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
  glow: {
    height: "800px",
    left: "50%",
    pointerEvents: "none",
    position: "absolute",
    top: "44%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    zIndex: 0,
  },
  hero: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    maxWidth: "900px",
    position: "relative",
    textAlign: "center",
    width: "100%",
    zIndex: 1,
  },
  badge: {
    border: "1px solid rgba(79,70,229,0.3)",
    borderRadius: "999px",
    color: "#c3c0ff",
    fontFamily: monoFamily,
    fontSize: "12px",
    lineHeight: 1.4,
    marginBottom: "20px",
    padding: "6px 16px",
  },
  heading: {
    fontFamily,
    fontSize: "52px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    margin: "0 0 16px",
    overflowWrap: "anywhere",
    textAlign: "center",
  },
  headingLine: {
    display: "block",
  },
  subheading: {
    fontFamily,
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: 1.5,
    margin: "0 0 40px",
    textAlign: "center",
  },
  subheadingLine: {
    display: "block",
  },
  form: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    maxWidth: "600px",
    width: "100%",
  },
  input: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    boxSizing: "border-box",
    flex: 1,
    fontFamily,
    fontSize: "15px",
    height: "52px",
    minWidth: 0,
    outline: "none",
    padding: "0 18px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  button: {
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontFamily,
    fontSize: "15px",
    fontWeight: 600,
    height: "52px",
    padding: "0 28px",
    transition: "background 0.2s ease, opacity 0.2s ease",
    whiteSpace: "nowrap",
    width: "140px",
  },
  featureRow: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px 24px",
    justifyContent: "center",
    marginTop: "16px",
  },
  featureHint: {
    alignItems: "center",
    display: "inline-flex",
    fontFamily,
    fontSize: "13px",
    gap: "6px",
    lineHeight: 1.5,
  },
  statsRow: {
    alignItems: "stretch",
    display: "flex",
    gap: 0,
    justifyContent: "center",
    marginTop: "40px",
  },
  statItem: {
    minWidth: "128px",
    padding: "0 20px",
    textAlign: "center",
  },
  statLabel: {
    fontFamily,
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: "4px",
  },
  statSublabel: {
    fontFamily,
    fontSize: "12px",
    lineHeight: 1.4,
  },
  footer: {
    bottom: "32px",
    fontFamily: monoFamily,
    fontSize: "12px",
    left: "50%",
    lineHeight: 1.5,
    position: "absolute",
    textAlign: "center",
    transform: "translateX(-50%)",
    width: "calc(100% - 48px)",
    zIndex: 1,
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
};
