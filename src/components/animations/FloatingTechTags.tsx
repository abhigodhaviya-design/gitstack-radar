"use client";
import { useEffect, useState } from "react";
import type { JSX, CSSProperties } from "react";

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "Python",
  "Rust",
  "Go",
];

interface FloatingTag {
  id: number;
  text: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export function FloatingTechTags(): JSX.Element {
  const [tags, setTags] = useState<FloatingTag[]>([]);

  useEffect(() => {
    const generatedTags = techStack.map((tech, index) => ({
      id: index,
      text: tech,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }));
    setTags(generatedTags);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {tags.map((tag) => (
        <div
          key={tag.id}
          style={{
            ...tagStyle,
            left: `${tag.x}%`,
            top: `${tag.y}%`,
            animationDuration: `${tag.duration}s`,
            animationDelay: `${tag.delay}s`,
          }}
        >
          {tag.text}
        </div>
      ))}
    </div>
  );
}

const tagStyle: CSSProperties = {
  position: "absolute",
  padding: "6px 12px",
  borderRadius: "6px",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  color: "rgba(228,225,238,0.15)",
  fontSize: "11px",
  fontWeight: 500,
  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace",
  animation: "float 20s ease-in-out infinite, fadeInOut 8s ease-in-out infinite",
  willChange: "transform, opacity",
};
