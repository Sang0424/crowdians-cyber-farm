// /Users/isang-yeob/Crowdians/crowdians/components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from "./theme-toggle.module.scss";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration Mismatch 방지 (클라이언트 마운트 후 렌더링)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={styles.themeToggle}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      <div className={styles.toggleContainer}>
        <div
          className={`${styles.icon} ${styles.sun} ${theme === "light" ? styles.active : ""}`}
        >
          ☀️
        </div>
        <div
          className={`${styles.icon} ${styles.moon} ${theme === "dark" ? styles.active : ""}`}
        >
          🌙
        </div>
        <div
          className={`${styles.thumb} ${theme === "dark" ? styles.darkThumb : ""}`}
        />
      </div>
    </button>
  );
}
