// @crowdians/src/app/[locale]/rank/page.tsx
"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import GEOS from "@/../public/Crowdy/GEOS.gif";

const LEADER_DATA = [
  {
    rank: 1,
    name: "내가짱이다",
    score: "1,827점",
    delta: "▲ 2",
    deltaColor: "up",
    cardColor: styles.gold,
    avatar: GEOS,
  },
  {
    rank: 2,
    name: "내가2짱이다",
    score: "1,800점",
    delta: "▼ 1",
    deltaColor: "down",
    cardColor: styles.silver,
    avatar: GEOS,
  },
  {
    rank: 3,
    name: "내가3짱이다",
    score: "1,700점",
    delta: "---",
    deltaColor: "equal",
    cardColor: styles.bronze,
    avatar: GEOS,
  },
];

const RANK_LIST = [
  { rank: 4, name: "내가4짱이다", score: "1,650점", delta: "---" },
  { rank: 5, name: "내가5짱이다", score: "1,640점", delta: "---" },
  { rank: 6, name: "내가6짱이다", score: "1,620점", delta: "---" },
  { rank: 7, name: "내가7짱이다", score: "1,600점", delta: "---" },
];

const MY_RANK = {
  rank: 105,
  name: "내계정입니다",
  score: "825점",
  delta: "---",
  avatar: GEOS,
};

export default function RankPage() {
  return (
    <div className={styles.rankPage}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>
            가장 활발하게 활동하는 크라우디언들의 순위입니다
          </p>
          <h1 className={styles.title}>크라우디언 랭크</h1>
        </div>
      </header>

      <div className={styles.toggle}>
        <button className={styles.toggleBtn + " " + styles.activeToggle}>
          <span className={styles.shieldIcon} />
          신뢰도 랭킹
        </button>
        <button className={styles.toggleBtn}>
          <span className={styles.activityIcon} />
          누적 활동 랭킹
        </button>
      </div>

      <nav className={styles.tabs}>
        <button className={styles.tab + " " + styles.activeTab}>
          전체 랭킹
        </button>
        <button className={styles.tab}>주간 랭킹</button>
        <span className={styles.notice}>
          주간 랭킹은 매주 월요일 0시에 업데이트됩니다
        </span>
      </nav>

      <section className={styles.leaders}>
        {LEADER_DATA.map((leader) => (
          <article
            key={leader.rank}
            className={styles.leaderCard + " " + leader.cardColor}
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
              <p className={styles.score}>{leader.score}</p>
            </div>
            <p className={styles.delta + " " + styles[leader.deltaColor]}>
              {leader.delta}
            </p>
          </article>
        ))}
      </section>

      <section className={styles.rankList}>
        {RANK_LIST.map((item) => (
          <article key={item.rank} className={styles.rankRow}>
            <span className={styles.rank}>{`# ${item.rank}`}</span>
            <div className={styles.rowInfo}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.score}>{item.score}</span>
            </div>
            <span className={styles.delta}>{item.delta}</span>
          </article>
        ))}
      </section>

      <section className={styles.myRank}>
        <article className={styles.rankRow}>
          <span className={styles.rank}>{`# ${MY_RANK.rank}`}</span>
          <Image
            src={MY_RANK.avatar}
            alt={MY_RANK.name}
            width={48}
            height={48}
            className={styles.miniAvatar}
            unoptimized
          />
          <div className={styles.rowInfo}>
            <span className={styles.name}>{MY_RANK.name}</span>
            <span className={styles.score}>{MY_RANK.score}</span>
          </div>
          <span className={styles.delta}>{MY_RANK.delta}</span>
        </article>
      </section>
    </div>
  );
}
