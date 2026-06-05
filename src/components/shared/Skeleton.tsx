"use client";

import type { CSSProperties, FC } from "react";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: CSSProperties;
};

export const Skeleton: FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  style = {},
}) => {
  return (
    <>
      <div
        className="skeleton-pulse"
        style={{
          width,
          height,
          borderRadius,
          background: "rgba(255,255,255,0.08)",
          ...style,
        }}
      />
      <style jsx>{`
        @keyframes skeleton-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .skeleton-pulse {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};
