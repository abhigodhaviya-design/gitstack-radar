"use client";
import type { JSX } from "react";

import { GitCompare } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

import { extractRepoPath } from "@/lib/github";
import { fontFamily, monoFamily } from "@/lib/fonts";
import { theme } from "@/lib/theme";

interface CompareRepoFormProps {
  onCompare: (repo1: string, repo2: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function CompareRepoForm({
  onCompare,
  isLoading,
  error,
}: CompareRepoFormProps): JSX.Element {
  const [repo1Url, setRepo1Url] = useState("");
  const [repo2Url, setRepo2Url] = useState("");
  const [repo1Error, setRepo1Error] = useState<string | null>(null);
  const [repo2Error, setRepo2Error] = useState<string | null>(null);

  // Validate and update repo1
  const handleRepo1Change = (value: string) => {
    setRepo1Url(value);
    if (!value.trim()) {
      setRepo1Error(null);
    } else {
      const extracted = extractRepoPath(value);
      if (!extracted) {
        setRepo1Error("Invalid GitHub URL or format");
      } else {
        setRepo1Error(null);
      }
    }
  };

  // Validate and update repo2
  const handleRepo2Change = (value: string) => {
    setRepo2Url(value);
    if (!value.trim()) {
      setRepo2Error(null);
    } else {
      const extracted = extractRepoPath(value);
      if (!extracted) {
        setRepo2Error("Invalid GitHub URL or format");
      } else {
        setRepo2Error(null);
      }
    }
  };

  const handleCompare = () => {
    // Reset errors
    setRepo1Error(null);
    setRepo2Error(null);

    // Validate inputs
    if (!repo1Url.trim()) {
      setRepo1Error("Repository 1 URL is required");
      return;
    }

    if (!repo2Url.trim()) {
      setRepo2Error("Repository 2 URL is required");
      return;
    }

    // Extract repo paths
    const repo1 = extractRepoPath(repo1Url);
    const repo2 = extractRepoPath(repo2Url);

    if (!repo1) {
      setRepo1Error("Invalid GitHub URL or format");
      return;
    }

    if (!repo2) {
      setRepo2Error("Invalid GitHub URL or format");
      return;
    }

    if (repo1.toLowerCase() === repo2.toLowerCase()) {
      setRepo1Error("Please choose two different repositories");
      setRepo2Error("Please choose two different repositories");
      return;
    }

    // Call the onCompare callback with normalized values
    onCompare(repo1, repo2);
  };

  const isFormValid =
    repo1Url.trim() &&
    repo2Url.trim() &&
    !repo1Error &&
    !repo2Error;

  const getInputBorderColor = (inputError: string | null, isFocused: boolean) => {
    if (inputError) return theme.riskColor;
    if (isFocused) return "#4f46e5";
    return theme.divider;
  };

  const inputStyle = (error: string | null, isFocused: boolean): CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    fontFamily,
    fontSize: "14px",
    padding: "12px 14px",
    borderRadius: "8px",
    border: `1px solid ${getInputBorderColor(error, isFocused)}`,
    background: "rgba(255,255,255,0.03)",
    color: theme.primary,
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <GitCompare size={22} color="#4f46e5" strokeWidth={1.5} />
        <h2
          style={{
            fontFamily,
            fontSize: "20px",
            fontWeight: 700,
            color: theme.primary,
            margin: 0,
          }}
        >
          Enter Repository URLs
        </h2>
      </div>

      <p
        style={{
          fontFamily,
          fontSize: "14px",
          color: theme.muted,
          margin: 0,
          maxWidth: "560px",
        }}
      >
        Paste the full GitHub URLs or owner/repo format (e.g., facebook/react)
      </p>

      {/* Repository 1 Input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor="repo1-url"
          style={{
            fontFamily: monoFamily,
            fontSize: "11px",
            color: theme.muted,
            letterSpacing: "0.08em",
            fontWeight: 600,
            margin: 0,
          }}
        >
          REPOSITORY 1 URL
        </label>
        <input
          id="repo1-url"
          type="text"
          value={repo1Url}
          onChange={(e) => handleRepo1Change(e.target.value)}
          placeholder="https://github.com/facebook/react"
          disabled={isLoading}
          style={{
            ...inputStyle(repo1Error, repo1Url.length > 0),
            cursor: isLoading ? "not-allowed" : "text",
          }}
        />
        {repo1Error && (
          <p
            style={{
              fontFamily,
              fontSize: "12px",
              color: theme.riskColor,
              margin: 0,
              marginTop: "4px",
            }}
          >
            {repo1Error}
          </p>
        )}
      </div>

      {/* Repository 2 Input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor="repo2-url"
          style={{
            fontFamily: monoFamily,
            fontSize: "11px",
            color: theme.muted,
            letterSpacing: "0.08em",
            fontWeight: 600,
            margin: 0,
          }}
        >
          REPOSITORY 2 URL
        </label>
        <input
          id="repo2-url"
          type="text"
          value={repo2Url}
          onChange={(e) => handleRepo2Change(e.target.value)}
          placeholder="https://github.com/vuejs/core"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isFormValid && !isLoading) {
              handleCompare();
            }
          }}
          style={{
            ...inputStyle(repo2Error, repo2Url.length > 0),
            cursor: isLoading ? "not-allowed" : "text",
          }}
        />
        {repo2Error && (
          <p
            style={{
              fontFamily,
              fontSize: "12px",
              color: theme.riskColor,
              margin: 0,
              marginTop: "4px",
            }}
          >
            {repo2Error}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "8px",
            background: "rgba(255,185,95,0.08)",
            border: `1px solid ${theme.divider}`,
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: "13px",
              color: theme.riskColor,
              margin: 0,
            }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Compare Button */}
      <button
        type="button"
        onClick={handleCompare}
        disabled={!isFormValid || isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter" && isFormValid && !isLoading) {
            handleCompare();
          }
        }}
        style={{
          fontFamily,
          fontSize: "15px",
          fontWeight: 600,
          padding: "12px 28px",
          borderRadius: "8px",
          border: "none",
          background:
            !isFormValid || isLoading
              ? theme.divider
              : "#4f46e5",
          color: "#ffffff",
          cursor:
            !isFormValid || isLoading
              ? "not-allowed"
              : "pointer",
          transition: "background-color 0.2s",
          width: "100%",
          maxWidth: "200px",
        }}
      >
        {isLoading ? "Comparing…" : "Compare Now"}
      </button>

      {/* Info Message */}
      <p
        style={{
          fontFamily,
          fontSize: "12px",
          color: theme.muted,
          margin: 0,
          marginTop: "8px",
        }}
      >
        Supports full GitHub URLs (https://github.com/owner/repo) or
        owner/repo format
      </p>
    </div>
  );
}
