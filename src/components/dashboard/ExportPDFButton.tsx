"use client";

import { FileDown, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import type { FC } from "react";

import { PDFExporter } from "@/lib/pdf-export";
import type { PDFExportData } from "@/lib/pdf-export";
import type { DashboardTheme } from "@/lib/types";

type ExportPDFButtonProps = {
  theme: DashboardTheme;
  data: PDFExportData;
  repoName: string;
};

type ButtonState = "idle" | "loading" | "success" | "error";

export const ExportPDFButton: FC<ExportPDFButtonProps> = ({ theme, data, repoName }) => {
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleExportPDF = async (): Promise<void> => {
    if (buttonState === "loading") return;

    setButtonState("loading");
    setErrorMessage("");

    try {
      // Validate required data
      if (!data.repo || !data.scores) {
        throw new Error("Missing repository data. Please try analyzing the repository again.");
      }

      // Generate PDF
      const exporter = new PDFExporter();
      const pdfBlob = exporter.generatePDF(data);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = PDFExporter.getFileName(repoName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);

      setButtonState("success");

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setButtonState("idle");
      }, 3000);
    } catch (error) {
      console.error("PDF Export Error:", error);
      setButtonState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to generate PDF. Please try again."
      );

      // Reset to idle after 5 seconds
      setTimeout(() => {
        setButtonState("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case "loading":
        return (
          <>
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid #ffffff",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
            <span>Generating...</span>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle size={18} strokeWidth={2.5} />
            <span>Downloaded!</span>
          </>
        );
      case "error":
        return (
          <>
            <XCircle size={18} strokeWidth={2.5} />
            <span>Failed</span>
          </>
        );
      default:
        return (
          <>
            <FileDown size={18} strokeWidth={2.5} />
            <span>Export PDF</span>
          </>
        );
    }
  };

  const getButtonColor = () => {
    switch (buttonState) {
      case "success":
        return "#22c55e"; // Green
      case "error":
        return "#ef4444"; // Red
      default:
        return "#a855f7"; // Purple (theme purple color)
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", width: "100%", maxWidth: "300px" }}>
      <button
        type="button"
        onClick={handleExportPDF}
        disabled={buttonState === "loading"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px 20px",
          background: getButtonColor(),
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: buttonState === "loading" ? "not-allowed" : "pointer",
          fontWeight: 600,
          fontSize: "clamp(13px, 2.5vw, 14px)",
          transition: "all 0.2s ease",
          opacity: buttonState === "loading" ? 0.7 : 1,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          width: "100%",
          minHeight: "44px",
        }}
        onMouseEnter={(e) => {
          if (buttonState === "idle") {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
        }}
      >
        {getButtonContent()}
      </button>

      {errorMessage && (
        <div
          style={{
            padding: "8px 12px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "6px",
            color: "#ef4444",
            fontSize: "clamp(11px, 2vw, 13px)",
            maxWidth: "300px",
            lineHeight: 1.4,
          }}
        >
          {errorMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
