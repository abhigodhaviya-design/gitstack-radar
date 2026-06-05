"use client";
import { useEffect, useState } from "react";
import type { JSX } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface AnalysisStep {
  label: string;
  completed: boolean;
}

const steps = [
  "Scanning Repository...",
  "Detecting Languages",
  "Detecting Frameworks",
  "Analyzing Activity",
  "Calculating Health Score",
  "Generating AI Insights",
];

interface AnalysisLoaderProps {
  onComplete?: () => void;
}

export function AnalysisLoader({ onComplete }: AnalysisLoaderProps): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "24px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        minWidth: "300px",
      }}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              opacity: isUpcoming ? 0.3 : 1,
              transform: isCurrent ? "translateX(0)" : "translateX(-8px)",
              transition: "all 0.3s ease",
            }}
          >
            {isCompleted ? (
              <CheckCircle2 size={18} color="#4ae176" strokeWidth={2} />
            ) : isCurrent ? (
              <Loader2
                size={18}
                color="#4f46e5"
                strokeWidth={2}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              />
            )}
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: isCompleted ? "#4ae176" : isCurrent ? "#e4e1ee" : "#918fa1",
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
