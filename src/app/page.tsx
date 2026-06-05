"use client";
import type { JSX } from "react";

import { Activity, Download, GitCompare, Radar, ShieldAlert, Sparkles, Search, GitFork } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { DotGridBackground } from "@/components/shared/DotGridBackground";
import { globalStyles } from "@/lib/styles";
import { usePwaInstall } from "@/lib/use-pwa-install";
import { CountUpStat } from "@/components/animations/CountUpStat";
import { FloatingTechTags } from "@/components/animations/FloatingTechTags";
import { RadarPulse } from "@/components/animations/RadarPulse";
import { AnalysisLoader } from "@/components/animations/AnalysisLoader";

const fontFamily =
  "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const monoFamily =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace";

const theme = {
  pageBg: "#000000",
  primary: "#e4e1ee",
  secondary: "#c7c4d8",
  muted: "#918fa1",
  inputBg: "rgba(255,255,255,0.03)",
  inputBorder: "rgba(255,255,255,0.08)",
  badgeBg: "rgba(79,70,229,0.15)",
  badgeBorder: "rgba(79,70,229,0.3)",
  badgeColor: "#c3c0ff",
  footer: "#464555",
  divider: "rgba(255,255,255,0.08)",
  navbarBg: "rgba(0,0,0,0.85)",
  navbarBorder: "rgba(255,255,255,0.06)",
  inputFocusShadow: "rgba(79,70,229,0.2)",
  glowBg:
    "radial-gradient(ellipse, rgba(79,70,229,0.07) 0%, transparent 70%)",
  healthColor: "#4ae176",
  riskColor: "#ffb95f",
  insightColor: "#c3c0ff",
  accent: "#4f46e5",
  accentHover: "#3730a3",
};

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
  { value: 500, suffix: "+", label: "Repos Analyzed" },
  { value: 20, suffix: "+", label: "Metrics Tracked" },
  { value: 0, suffix: "", label: "AI", sublabel: "Powered Analysis" },
  { value: 0, suffix: "", label: "Free", sublabel: "No Signup Needed" },
];

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { isInstallable, isInstalled, isInstalling, install } = usePwaInstall();
  
  // Segmented control state
  const [activeMode, setActiveMode] = useState<"analyze" | "compare">("analyze");
  
  // Analyze mode state
  const [repoUrl, setRepoUrl] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Compare mode state
  const [repo1Url, setRepo1Url] = useState("");
  const [repo2Url, setRepo2Url] = useState("");
  const [repo1Error, setRepo1Error] = useState(false);
  const [repo2Error, setRepo2Error] = useState(false);
  const [repo1Focused, setRepo1Focused] = useState(false);
  const [repo2Focused, setRepo2Focused] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [showAnalysisLoader, setShowAnalysisLoader] = useState(false);

  const handleAnalyzeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = repoUrl.trim();
    if (!value) {
      setHasError(true);
      return;
    }
    setIsLoading(true);
    setShowAnalysisLoader(true);
    
    // Show analysis loader for 2.4 seconds (6 steps × 400ms)
    setTimeout(() => {
      router.push(`/dashboard?repo=${encodeURIComponent(value)}`);
    }, 2400);
  };

  const handleCompareSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const val1 = repo1Url.trim();
    const val2 = repo2Url.trim();
    
    if (!val1) {
      setRepo1Error(true);
      return;
    }
    if (!val2) {
      setRepo2Error(true);
      return;
    }
    
    setCompareLoading(true);
    router.push(`/compare?repo1=${encodeURIComponent(val1)}&repo2=${encodeURIComponent(val2)}`);
  };

  return (
    <main
      style={{
        ...styles.page,
        background: theme.pageBg,
        color: theme.primary,
      }}
    >
      <DotGridBackground isDark={true} />
      <FloatingTechTags />
      <RadarPulse />

      <nav
        className="will-animate animate-fade-in-down"
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

        {/* Install Button - Only show when not installed */}
        {isInstalled ? (
          <span
            style={{
              ...globalStyles.installButton,
              color: "#4ae176",
              background: "rgba(74,225,118,0.08)",
              border: "1px solid rgba(74,225,118,0.2)",
              cursor: "default",
            }}
            aria-label="App is installed"
          >
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
        ) : isInstallable ? (
          <button
            type="button"
            onClick={async () => {
              const installed = await install();
              if (!installed) {
                // Only show message if there was a real error, not just "not available"
                console.log("ℹ️ PWA: Installation not completed");
              }
            }}
            disabled={isInstalling}
            aria-label="Install GitStack Radar App"
            style={{
              ...globalStyles.installButton,
              opacity: isInstalling ? 0.6 : 1,
              cursor: isInstalling ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isInstalling) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(79,70,229,0.12)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(79,70,229,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isInstalling) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(255,255,255,0.08)";
              }
            }}
          >
            <Download size={14} strokeWidth={2} />
            {isInstalling ? "Installing..." : "Install App"}
          </button>
        ) : null}
      </nav>

      <div style={{ ...styles.glow, background: theme.glowBg }} />

      <section style={styles.hero} aria-labelledby="home-title">
        <div
          className="will-animate animate-fade-in delay-200"
          style={{
            ...styles.badge,
            background: theme.badgeBg,
            borderColor: theme.badgeBorder,
            color: theme.badgeColor,
          }}
        >
          AI-Powered Repository Intelligence
        </div>

        <h1 id="home-title" className="will-animate animate-fade-in-up delay-300" style={{ ...styles.heading, color: theme.primary }}>
          <span style={styles.headingLine}>Analyze Any GitHub</span>
          <span style={styles.headingLine}>Repository Instantly</span>
        </h1>

        <p className="will-animate animate-fade-in-up delay-400" style={{ ...styles.subheading, color: theme.secondary }}>
          <span style={styles.subheadingLine}>
            Get AI-powered health scores, risk analysis, activity insights
          </span>
          <span style={styles.subheadingLine}>
            and learning recommendations for any public repository.
          </span>
        </p>

        {/* Modern Segmented Control + Search Panel */}
        <div className="will-animate animate-scale-in delay-500" style={styles.searchContainer}>
          {/* Segmented Control */}
          <div style={styles.segmentedControl}>
            <button
              type="button"
              onClick={() => setActiveMode("analyze")}
              style={{
                ...styles.segmentButton,
                background: activeMode === "analyze" ? "rgba(79,70,229,0.2)" : "transparent",
                color: activeMode === "analyze" ? theme.primary : theme.muted,
                borderColor: activeMode === "analyze" ? "rgba(79,70,229,0.4)" : "transparent",
              }}
            >
              <Search size={16} strokeWidth={2} />
              Analyze Repository
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("compare")}
              style={{
                ...styles.segmentButton,
                background: activeMode === "compare" ? "rgba(79,70,229,0.2)" : "transparent",
                color: activeMode === "compare" ? theme.primary : theme.muted,
                borderColor: activeMode === "compare" ? "rgba(79,70,229,0.4)" : "transparent",
              }}
            >
              <GitFork size={16} strokeWidth={2} />
              Compare Repositories
            </button>
          </div>

          {/* Search Panel */}
          <div style={{
            ...styles.searchPanel,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            {activeMode === "analyze" ? (
              <form onSubmit={handleAnalyzeSubmit} style={{ width: "100%" }}>
                <div style={styles.inputGroup}>
                  <div style={styles.inputWrapper}>
                    <input
                      type="text"
                      value={repoUrl}
                      disabled={isLoading}
                      placeholder="https://github.com/owner/repository"
                      onBlur={() => setIsFocused(false)}
                      onFocus={() => setIsFocused(true)}
                      onChange={(event) => {
                        setRepoUrl(event.target.value);
                        if (hasError) setHasError(false);
                      }}
                      style={{
                        ...styles.modernInput,
                        borderColor: hasError
                          ? "#ffb4ab"
                          : isFocused
                            ? "#4f46e5"
                            : theme.inputBorder,
                        boxShadow: isFocused
                          ? `0 0 0 3px ${theme.inputFocusShadow}`
                          : "none",
                        paddingLeft: "16px",  // Removed extra padding for icon
                      }}
                      aria-label="GitHub repository URL"
                      aria-invalid={hasError}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        ...styles.modernButton,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          (e.currentTarget as HTMLButtonElement).style.background = "#3730a3";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
                        }
                      }}
                    >
                      {isLoading ? "Analyzing..." : "Analyze →"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCompareSubmit} style={{ width: "100%" }}>
                <div style={styles.compareInputs}>
                  <div style={styles.inputWrapper}>
                    <input
                      type="text"
                      value={repo1Url}
                      disabled={compareLoading}
                      placeholder="https://github.com/owner/repository-1"
                      onBlur={() => setRepo1Focused(false)}
                      onFocus={() => setRepo1Focused(true)}
                      onChange={(event) => {
                        setRepo1Url(event.target.value);
                        if (repo1Error) setRepo1Error(false);
                      }}
                      style={{
                        ...styles.modernInput,
                        borderColor: repo1Error
                          ? "#ffb4ab"
                          : repo1Focused
                            ? "#4f46e5"
                            : theme.inputBorder,
                        boxShadow: repo1Focused
                          ? `0 0 0 3px ${theme.inputFocusShadow}`
                          : "none",
                        paddingLeft: "16px",  // Removed extra padding for icon
                        paddingRight: "16px",
                      }}
                      aria-label="First GitHub repository URL"
                      aria-invalid={repo1Error}
                    />
                  </div>
                  
                  <div style={styles.inputWrapper}>
                    <input
                      type="text"
                      value={repo2Url}
                      disabled={compareLoading}
                      placeholder="https://github.com/owner/repository-2"
                      onBlur={() => setRepo2Focused(false)}
                      onFocus={() => setRepo2Focused(true)}
                      onChange={(event) => {
                        setRepo2Url(event.target.value);
                        if (repo2Error) setRepo2Error(false);
                      }}
                      style={{
                        ...styles.modernInput,
                        borderColor: repo2Error
                          ? "#ffb4ab"
                          : repo2Focused
                            ? "#4f46e5"
                            : theme.inputBorder,
                        boxShadow: repo2Focused
                          ? `0 0 0 3px ${theme.inputFocusShadow}`
                          : "none",
                        paddingLeft: "16px",  // Removed extra padding for icon
                        paddingRight: "16px",
                      }}
                      aria-label="Second GitHub repository URL"
                      aria-invalid={repo2Error}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={compareLoading}
                    style={{
                      ...styles.modernButton,
                      width: "100%",
                      cursor: compareLoading ? "not-allowed" : "pointer",
                      opacity: compareLoading ? 0.7 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!compareLoading) {
                        (e.currentTarget as HTMLButtonElement).style.background = "#3730a3";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!compareLoading) {
                        (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5";
                      }
                    }}
                  >
                    {compareLoading ? "Comparing..." : "Compare →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div style={styles.featureRow} aria-label="Repository analysis features">
          {featureHints.map(({ Icon, colorKey, text }) => {
            const color = theme[colorKey];
            return (
              <span
                key={text}
                style={{
                  ...styles.featureHint,
                  color,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.filter = "brightness(1.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                <Icon size={16} color={color} strokeWidth={2.2} />
                {text}
              </span>
            );
          })}
        </div>

        <div style={styles.statsRow} aria-label="GitStack Radar stats">
          <div style={{ textAlign: "center", minWidth: "clamp(100px, 20%, 128px)", padding: "0 clamp(8px, 2vw, 20px)" }}>
            <CountUpStat
              end={500}
              suffix="+"
              label="500+"
              sublabel="Repos Analyzed"
              color={theme.primary}
              monoFamily={monoFamily}
              fontFamily={fontFamily}
            />
          </div>
          <div style={{ width: "1px", height: "40px", background: theme.divider, display: "none" }} className="stat-divider" />
          <div style={{ textAlign: "center", minWidth: "clamp(100px, 20%, 128px)", padding: "0 clamp(8px, 2vw, 20px)" }}>
            <CountUpStat
              end={20}
              suffix="+"
              label="20+"
              sublabel="Metrics Tracked"
              color={theme.primary}
              monoFamily={monoFamily}
              fontFamily={fontFamily}
            />
          </div>
          <div style={{ width: "1px", height: "40px", background: theme.divider, display: "none" }} className="stat-divider" />
          <div style={{ textAlign: "center", minWidth: "clamp(100px, 20%, 128px)", padding: "0 clamp(8px, 2vw, 20px)" }}>
            <div style={{ ...styles.statLabel, color: theme.primary }}>AI</div>
            <div style={{ ...styles.statSublabel, color: theme.muted }}>Powered Analysis</div>
          </div>
          <div style={{ width: "1px", height: "40px", background: theme.divider, display: "none" }} className="stat-divider" />
          <div style={{ textAlign: "center", minWidth: "clamp(100px, 20%, 128px)", padding: "0 clamp(8px, 2vw, 20px)" }}>
            <div style={{ ...styles.statLabel, color: theme.primary }}>Free</div>
            <div style={{ ...styles.statSublabel, color: theme.muted }}>No Signup Needed</div>
          </div>
        </div>
        <style jsx>{`
          @media (min-width: 768px) {
            .stat-divider {
              display: block !important;
            }
          }
        `}</style>
      </section>

      <footer style={{ ...styles.footer, color: theme.footer }}>
        Built with Next.js · GitHub API · Gemini AI
      </footer>

      {/* Analysis Loader Modal */}
      {showAnalysisLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <AnalysisLoader />
        </div>
      )}
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
    padding: "80px clamp(16px, 3vw, 24px) clamp(40px, 10vh, 96px)",
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
    padding: "0 clamp(16px, 5vw, 40px)",
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
    fontSize: "clamp(32px, 8vw, 52px)",
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
    fontSize: "clamp(15px, 3vw, 18px)",
    fontWeight: 400,
    lineHeight: 1.5,
    margin: "0 0 40px",
    textAlign: "center",
  },
  subheadingLine: {
    display: "block",
  },
  searchContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
  },
  segmentedControl: {
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    display: "flex",
    gap: "8px",
    padding: "6px",
    width: "100%",
    boxSizing: "border-box",
  },
  segmentButton: {
    alignItems: "center",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: "8px",
    color: "#918fa1",
    cursor: "pointer",
    display: "flex",
    flex: 1,
    fontFamily,
    fontSize: "14px",
    fontWeight: 500,
    gap: "8px",
    justifyContent: "center",
    outline: "none",
    padding: "10px 16px",
    transition: "all 0.2s ease",
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  searchPanel: {
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    width: "100%",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputIcon: {
    left: "16px",
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
  },
  modernInput: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    boxSizing: "border-box",
    color: "#e4e1ee",
    fontFamily,
    fontSize: "15px",
    height: "52px",
    outline: "none",
    padding: "0 16px",
    transition: "all 0.2s ease",
    width: "100%",
  },
  modernButton: {
    background: "#4f46e5",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontFamily,
    fontSize: "15px",
    fontWeight: 600,
    height: "52px",
    marginTop: "12px",
    outline: "none",
    padding: "0 28px",
    transition: "all 0.2s ease",
    width: "auto",
  },
  compareInputs: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  featureRow: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px 24px",
    justifyContent: "center",
    marginTop: "32px",
    maxWidth: "700px",
    width: "100%",
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
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginTop: "32px",
    maxWidth: "100%",
    width: "100%",
  },
  statItem: {
    minWidth: "clamp(100px, 25%, 128px)",
    padding: "0 clamp(8px, 2vw, 20px)",
    textAlign: "center",
  },
  statLabel: {
    fontFamily,
    fontSize: "clamp(18px, 4vw, 22px)",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: "4px",
  },
  statSublabel: {
    fontFamily,
    fontSize: "clamp(11px, 2vw, 12px)",
    lineHeight: 1.4,
  },
  footer: {
    bottom: "clamp(16px, 4vh, 32px)",
    fontFamily: monoFamily,
    fontSize: "clamp(10px, 2vw, 12px)",
    left: "50%",
    lineHeight: 1.5,
    position: "absolute",
    textAlign: "center",
    transform: "translateX(-50%)",
    width: "calc(100% - 48px)",
    zIndex: 1,
  },
};
