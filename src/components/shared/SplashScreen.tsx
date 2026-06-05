"use client";
import type { JSX } from "react";

import {
  Atom,
  Container,
  Database,
  FileCode,
  Hexagon,
  Layers,
  Radar,
  Share2,
  Triangle,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import styles from "./SplashScreen.module.css";

const SPLASH_DURATION = 5000;  // 5 seconds total
const FADE_DURATION = 800;     // 0.8 seconds fade out

type TechIcon = { name: string; Icon: LucideIcon };

const techIcons: readonly TechIcon[] = [
  { name: "React", Icon: Atom },
  { name: "TypeScript", Icon: FileCode },
  { name: "Next.js", Icon: Triangle },
  { name: "Node.js", Icon: Hexagon },
  { name: "Docker", Icon: Container },
  { name: "MongoDB", Icon: Database },
  { name: "GraphQL", Icon: Share2 },
  { name: "Redis", Icon: Layers },
];

export function SplashScreen(): JSX.Element | null {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const hasShown = useRef(false);

  useEffect(() => {
    // Only show once per component lifecycle
    if (hasShown.current) {
      return;
    }

    hasShown.current = true;
    
    // Show splash immediately
    setVisible(true);

    // Start fade out animation
    const fadeTimer = window.setTimeout(
      () => setFading(true),
      SPLASH_DURATION - FADE_DURATION
    );
    
    // Remove splash from DOM
    const removeTimer = window.setTimeout(
      () => {
        setVisible(false);
      },
      SPLASH_DURATION
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  // Don't render if not visible - prevents faint background appearance
  if (!visible) return null;
  
  // Render splash screen
  return (
    <div
      className={`${styles.overlay} ${fading ? styles.fadeOut : ""}`}
      aria-hidden={fading}
      role="status"
      aria-label="Loading GitStack Radar"
    >
      <div className={styles.stage}>
        <div className={styles.radar}>
          <div className={`${styles.ring} ${styles.ring1}`} />
          <div className={`${styles.ring} ${styles.ring2}`} />
          <div className={`${styles.ring} ${styles.ring3}`} />
          <div className={styles.sweep} />
          <div className={`${styles.pulse} ${styles.pulse1}`} />
          <div className={`${styles.pulse} ${styles.pulse2}`} />
          <div className={`${styles.pulse} ${styles.pulse3}`} />
        </div>

        <div className={styles.core}>
          <div className={styles.logoWrap}>
            <Radar size={32} color="#a5a3ff" strokeWidth={1.8} />
          </div>
          <span className={styles.title}>GitStack Radar</span>
          <span className={styles.subtitle}>Scanning tech stack</span>
        </div>

        {techIcons.map(({ name, Icon }, index) => (
          <span
            key={name}
            className={`${styles.tag} ${styles[`tag${index + 1}`]}`}
            aria-label={name}
            title={name}
          >
            <Icon size={20} strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </div>
  );
}
