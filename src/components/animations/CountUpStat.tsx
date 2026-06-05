"use client";
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

interface CountUpStatProps {
  end: number;
  duration?: number;
  suffix?: string;
  label: string;
  sublabel: string;
  color: string;
  monoFamily: string;
  fontFamily: string;
}

export function CountUpStat({
  end,
  duration = 1500,
  suffix = "",
  label,
  sublabel,
  color,
  monoFamily,
  fontFamily,
}: CountUpStatProps): JSX.Element {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} style={{ textAlign: "center", minWidth: "128px", padding: "0 20px" }}>
      <div
        style={{
          fontFamily,
          fontSize: "22px",
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: "4px",
          color,
        }}
      >
        {count}{suffix}
      </div>
      <div
        style={{
          fontFamily: monoFamily,
          fontSize: "12px",
          lineHeight: 1.4,
          color: "#918fa1",
        }}
      >
        {sublabel}
      </div>
    </div>
  );
}
