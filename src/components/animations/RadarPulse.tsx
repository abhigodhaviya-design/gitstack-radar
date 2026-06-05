"use client";
import type { JSX, CSSProperties } from "react";

export function RadarPulse(): JSX.Element {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div style={pulseRing1} />
      <div style={pulseRing2} />
      <div style={pulseRing3} />
    </div>
  );
}

const basePulseStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid rgba(79,70,229,0.1)",
  borderRadius: "50%",
  willChange: "transform, opacity",
};

const pulseRing1: CSSProperties = {
  ...basePulseStyle,
  width: "200px",
  height: "200px",
  animation: "radarPulse 4s ease-out infinite",
};

const pulseRing2: CSSProperties = {
  ...basePulseStyle,
  width: "200px",
  height: "200px",
  animation: "radarPulse 4s ease-out infinite 1.3s",
};

const pulseRing3: CSSProperties = {
  ...basePulseStyle,
  width: "200px",
  height: "200px",
  animation: "radarPulse 4s ease-out infinite 2.6s",
};
