"use client";

import { useEffect, useRef } from "react";

export function MouseGradient() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gradientRef.current) {
        gradientRef.current.style.setProperty("--x", `${e.clientX}px`);
        gradientRef.current.style.setProperty("--y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={gradientRef}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background:
          "radial-gradient(600px circle at var(--x, 100px) var(--y, 100px), rgba(29, 78, 216, 0.15), transparent 80%)",
      }}
    />
  );
}
