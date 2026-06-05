"use client";
import type { JSX } from "react";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CompareRepoForm } from "@/components/compare/CompareRepoForm";
import { CompareResults } from "@/components/compare/CompareResults";
import { CompareSkeleton } from "@/components/compare/CompareSkeleton";
import { DotGridBackground } from "@/components/shared/DotGridBackground";
import { NavBar } from "@/components/shared/NavBar";
import { fontFamily } from "@/lib/fonts";
import { getGlassSurface, globalStyles } from "@/lib/styles";
import { theme } from "@/lib/theme";
import type { CompareApiResponse } from "@/lib/types";

function ComparePageInner(): JSX.Element {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CompareApiResponse | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleCompare = async (repo1: string, repo2: string) => {
    setError(null);
    setData(null);

    if (repo1.toLowerCase() === repo2.toLowerCase()) {
      setError("Please choose two different repositories.");
      return;
    }

    setLoading(true);
    setShowForm(false); // Hide form during loading
    
    try {
      const res = await fetch("/api/compare-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo1, repo2 }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to compare repositories");
      }
      setData(json);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : "An unexpected error occurred";
      setError(errorMessage);
      setShowForm(true); // Show form again on error
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Auto-compare when URLs are provided via query params
  useEffect(() => {
    const repo1 = searchParams.get("repo1");
    const repo2 = searchParams.get("repo2");

    if (repo1 && repo2 && initialLoad) {
      // Automatically trigger comparison
      handleCompare(repo1, repo2);
    } else if (!repo1 && !repo2) {
      // No params provided, show form
      setShowForm(true);
      setInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, initialLoad]);

  const handleNewComparison = () => {
    setData(null);
    setError(null);
    setShowForm(true);
  };

  return (
    <main
      style={{
        ...globalStyles.page,
        background: theme.pageBg,
        color: theme.primary,
        minHeight: "100vh",
      }}
    >
      <DotGridBackground isDark={true} />
      <NavBar theme={theme} showCompareLink={false} />

      <div style={{ ...globalStyles.content, paddingTop: "clamp(70px, 15vh, 80px)", paddingBottom: "clamp(32px, 8vh, 48px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div>
            <h1
              style={{
                fontFamily,
                fontSize: "clamp(22px, 5vw, 28px)",
                fontWeight: 700,
                color: theme.primary,
                margin: "0 0 8px 0",
              }}
            >
              Repository Comparison
            </h1>
            <p
              style={{
                fontFamily,
                fontSize: "clamp(13px, 2.5vw, 14px)",
                color: theme.muted,
                margin: "0",
                maxWidth: "560px",
                lineHeight: 1.5,
              }}
            >
              Compare two GitHub repositories side by side — metrics, AI insights,
              and radar visualization.
            </p>
          </div>
          
          {/* Show "New Comparison" button when results are displayed */}
          {data && !loading && (
            <button
              type="button"
              onClick={handleNewComparison}
              style={{
                background: "rgba(79,70,229,0.1)",
                border: "1px solid rgba(79,70,229,0.3)",
                borderRadius: "8px",
                color: "#4f46e5",
                cursor: "pointer",
                fontFamily,
                fontSize: "13px",
                fontWeight: 500,
                padding: "8px 16px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(79,70,229,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(79,70,229,0.1)";
              }}
            >
              New Comparison
            </button>
          )}
        </div>

        {/* Only show form if explicitly requested or on error */}
        {showForm && (
          <div
            style={{
              ...getGlassSurface(),
              padding: "clamp(20px, 4vw, 28px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            <CompareRepoForm
              onCompare={handleCompare}
              isLoading={loading}
              error={error}
            />
          </div>
        )}

        {loading && <CompareSkeleton theme={theme} />}
        {data && !loading && <CompareResults theme={theme} data={data} />}
      </div>
    </main>
  );
}

export default function ComparePage(): JSX.Element {
  return (
    <Suspense fallback={
      <main style={{ ...globalStyles.page, background: theme.pageBg, minHeight: "100vh" }}>
        <DotGridBackground isDark={true} />
        <NavBar theme={theme} showCompareLink={false} />
        <div style={{ ...globalStyles.content, paddingTop: "clamp(70px, 15vh, 80px)" }}>
          <CompareSkeleton theme={theme} />
        </div>
      </main>
    }>
      <ComparePageInner />
    </Suspense>
  );
}
