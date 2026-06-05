"use client";
import type { JSX } from "react";

import { useEffect, useRef } from "react";
import { globalStyles } from "@/lib/styles";
import type { Dot } from "@/lib/types";

export function DotGridBackground({ isDark }: { isDark: boolean }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

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
        const distanceToMouse = Math.hypot(dot.x - mouse.currentX, dot.y - mouse.currentY);
        const influence = distanceToMouse < 120 ? 1 - distanceToMouse / 120 : 0;
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
        ...globalStyles.dotCanvas,
        background: isDark ? "#000000" : "transparent",
      }}
      aria-hidden="true"
    />
  );
}
