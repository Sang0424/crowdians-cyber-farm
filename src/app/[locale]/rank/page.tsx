// @crowdians/src/app/[locale]/rank/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import Image from "next/image";
import GEOS from "@/../public/Crowdy/GEOS.gif";
import { Shield, Activity } from "lucide-react";
import { useUserStore } from "@/../store/useUserStore";

type RankMode = "trust" | "activity";
type TabMode = "all" | "weekly";

// ── Mock Data ──
const TRUST_LEADERS = [
  { rank: 1, name: "내가짱이다", score: 1827, delta: 2, avatar: GEOS },
  { rank: 2, name: "내가2짱이다", score: 1800, delta: -1, avatar: GEOS },
  { rank: 3, name: "내가3짱이다", score: 1700, delta: 0, avatar: GEOS },
];

const ACTIVITY_LEADERS = [
  { rank: 1, name: "활동왕", score: 2450, delta: 3, avatar: GEOS },
  { rank: 2, name: "매일출석", score: 2200, delta: 0, avatar: GEOS },
  { rank: 3, name: "크라우디언마스터", score: 2100, delta: -2, avatar: GEOS },
];

const TRUST_RANKS = [
  { rank: 4, name: "내가4짱이다", score: 1650, delta: 0 },
  { rank: 5, name: "내가5짱이다", score: 1640, delta: 0 },
  { rank: 6, name: "내가6짱이다", score: 1620, delta: 0 },
  { rank: 7, name: "내가7짱이다", score: 1600, delta: 0 },
];

const ACTIVITY_RANKS = [
  { rank: 4, name: "열심히하자", score: 2050, delta: 1 },
  { rank: 5, name: "꾸준함이답", score: 1980, delta: 0 },
  { rank: 6, name: "지식탐험가", score: 1900, delta: -1 },
  { rank: 7, name: "도전정신", score: 1850, delta: 0 },
];

const WEEKLY_LEADERS = [
  { rank: 1, name: "이번주핫", score: 520, delta: 5, avatar: GEOS },
  { rank: 2, name: "주간달리기", score: 480, delta: 1, avatar: GEOS },
  { rank: 3, name: "신인왕", score: 420, delta: 3, avatar: GEOS },
];

const WEEKLY_RANKS = [
  { rank: 4, name: "성장중", score: 390, delta: 0 },
  { rank: 5, name: "열공중", score: 370, delta: 2 },
  { rank: 6, name: "시작이반", score: 350, delta: -1 },
];

function getDeltaDisplay(delta: number) {
  if (delta > 0) return { text: `▲ ${delta}`, color: "up" as const };
  if (delta < 0)
    return { text: `▼ ${Math.abs(delta)}`, color: "down" as const };
  return { text: "---", color: "equal" as const };
}

function getCardColor(rank: number) {
  if (rank === 1) return styles.gold;
  if (rank === 2) return styles.silver;
  if (rank === 3) return styles.bronze;
  return "";
}

export default function RankPage() {
  const t = useTranslations("Rank");
  const router = useRouter();
  const { user } = useUserStore();
  const [rankMode, setRankMode] = useState<RankMode>("trust");
  const [tabMode, setTabMode] = useState<TabMode>("all");

  // Select data based on mode
  const leaders =
    tabMode === "weekly"
      ? WEEKLY_LEADERS
      : rankMode === "trust"
        ? TRUST_LEADERS
        : ACTIVITY_LEADERS;

  const rankList =
    tabMode === "weekly"
      ? WEEKLY_RANKS
      : rankMode === "trust"
        ? TRUST_RANKS
        : ACTIVITY_RANKS;

  const myRank = {
    rank: 105,
    name: user?.nickname ?? "Crowdian",
    score: user?.stats?.trust ?? 825,
    delta: 0,
    avatar: GEOS,
  };

  const handleUserClick = (name: string) => {
    router.push(`/user/${name}`);
  };

  return (
    <div className={styles.rankPage}>
      <header className={styles.hero}>
        <p className={styles.kicker}>{t("kicker")}</p>
        <h1 className={styles.title}>{t("title")}</h1>
      </header>

      {/* ── Toggle ── */}
      <div className={styles.toggle}>
        <button
          className={`${styles.toggleBtn} ${rankMode === "trust" ? styles.activeToggle : ""}`}
          onClick={() => setRankMode("trust")}
        >
          <Shield size={18} />
          {t("toggleTrust")}
        </button>
        <button
          className={`${styles.toggleBtn} ${rankMode === "activity" ? styles.activeToggle : ""}`}
          onClick={() => setRankMode("activity")}
        >
          <Activity size={18} />
          {t("toggleActivity")}
        </button>
      </div>

      {/* ── Tabs ── */}
      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${tabMode === "all" ? styles.activeTab : ""}`}
          onClick={() => setTabMode("all")}
        >
          {t("tabAll")}
        </button>
        <button
          className={`${styles.tab} ${tabMode === "weekly" ? styles.activeTab : ""}`}
          onClick={() => setTabMode("weekly")}
        >
          {t("tabWeekly")}
        </button>
        <span className={styles.notice}>{t("weeklyNotice")}</span>
      </nav>

      {/* ── Leaders (Top 3) ── */}
      <section className={styles.leaders}>
        {leaders.map((leader) => {
          const d = getDeltaDisplay(leader.delta);
          return (
            <article
              key={leader.rank}
              className={`${styles.leaderCard} ${getCardColor(leader.rank)}`}
              onClick={() => handleUserClick(leader.name)}
            >
              <span className={styles.rank}>{`# ${leader.rank}`}</span>
              <Image
                src={leader.avatar}
                alt={leader.name}
                width={96}
                height={96}
                className={styles.avatar}
                unoptimized
              />
              <div className={styles.leaderInfo}>
                <p className={styles.name}>{leader.name}</p>
                <p className={styles.score}>
                  {leader.score.toLocaleString()}
                  {t("unit")}
                </p>
              </div>
              <p className={`${styles.delta} ${styles[d.color]}`}>{d.text}</p>
            </article>
          );
        })}
      </section>

      {/* ── Rank List (4+) ── */}
      <section className={styles.rankList}>
        {rankList.map((item) => {
          const d = getDeltaDisplay(item.delta);
          return (
            <article
              key={item.rank}
              className={styles.rankRow}
              onClick={() => handleUserClick(item.name)}
            >
              <span className={styles.rank}>{`# ${item.rank}`}</span>
              <div className={styles.rowInfo}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.score}>
                  {item.score.toLocaleString()}
                  {t("unit")}
                </span>
              </div>
              <span className={`${styles.delta} ${styles[d.color]}`}>
                {d.text}
              </span>
            </article>
          );
        })}
      </section>

      {/* ── My Rank (Sticky Bottom) ── */}
      <section className={styles.myRank}>
        <article
          className={styles.myRankRow}
          onClick={() => handleUserClick(myRank.name)}
        >
          <span className={styles.myRankBadge}>{t("myRankBadge")}</span>
          <span className={styles.rank}>{`# ${myRank.rank}`}</span>
          <Image
            src={myRank.avatar}
            alt={myRank.name}
            width={40}
            height={40}
            className={styles.miniAvatar}
            unoptimized
          />
          <div className={styles.rowInfo}>
            <span className={styles.name}>{myRank.name}</span>
            <span className={styles.score}>
              {myRank.score.toLocaleString()}
              {t("unit")}
            </span>
          </div>
          <span className={styles.delta}>
            {getDeltaDisplay(myRank.delta).text}
          </span>
        </article>
      </section>
    </div>
  );
}
