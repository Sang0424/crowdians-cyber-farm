// @crowdians/src/app/[locale]/user/[id]/page.tsx
"use client";

import styles from "./page.module.scss";
import Image from "next/image";

const PROFILE = {
  level: 1,
  nickname: "내가짱이다",
  bio: "사용자 한줄 소개 메시지",
  daysActive: 88,
  avatar:
    "http://localhost:3845/assets/b6edd8f07e59a8d3f929be9b2deb91ce7fa0120b.png",
  exp: "420 EXP",
  solved: "5개",
  trust: "50 점",
  balance: "1,000 G",
  trustRank: "5위",
  activityRank: "5위",
};

const TABS = ["채택된 글", "답변한 글", "질문한 글", "저장한 글", "투표한 글"];
const ACTIVE_TAB = 0;

const QUESTIONS = [
  {
    id: "q1",
    tags: ["과학", "일상"],
    requester: "UserName",
    postedAgo: "15분 전",
    title: "AI가 인간을 대체할 수 있을까요?",
    body: "최근 ChatGPT와 같은 AI의 발전이 눈부신데, 정말로 인간의 일자리를 완전히 대체할 수 있을까요? 창의성이나 감성 같은 영역도 AI가 따라잡을 수 있나요?",
    likes: 24,
    comments: 2,
    reward: "보상 50 G",
    deadline: "D-7",
  },
  {
    id: "q2",
    tags: ["과학", "일상"],
    requester: "UserName",
    postedAgo: "30분 전",
    title: "AI가 인간을 대체할 수 있을까요?",
    body: "최근 ChatGPT와 같은 AI의 발전이 눈부신데...",
    likes: 18,
    comments: 1,
    reward: "보상 30 G",
    deadline: "D-2",
  },
];

export default function UserProfilePage() {
  return (
    <div className={styles.page}>
      <section className={styles.summaryCard}>
        <div className={styles.avatarWrapper}>
          <Image
            src={PROFILE.avatar}
            alt={PROFILE.nickname}
            width={160}
            height={160}
            className={styles.avatar}
            unoptimized
          />
        </div>

        <div className={styles.summary}>
          <div className={styles.titleLine}>
            <p className={styles.level}>Lv.{PROFILE.level}</p>
            <h1 className={styles.nickname}>{PROFILE.nickname}</h1>
          </div>
          <p className={styles.bio}>{PROFILE.bio}</p>
          <p className={styles.days}>{PROFILE.daysActive}일째 활동중</p>
          <button className={styles.primaryBtn}>직접 의뢰하기</button>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>누적 경험치</dt>
            <dd>{PROFILE.exp}</dd>
          </div>
          <div>
            <dt>해결한 질문</dt>
            <dd>{PROFILE.solved}</dd>
          </div>
          <div>
            <dt>신뢰도</dt>
            <dd>{PROFILE.trust}</dd>
          </div>
          <div>
            <dt>보유재화</dt>
            <dd>{PROFILE.balance}</dd>
          </div>
          <div>
            <dt>최고 신뢰도 랭킹</dt>
            <dd>{PROFILE.trustRank}</dd>
          </div>
          <div>
            <dt>최고 활동 랭킹</dt>
            <dd>{PROFILE.activityRank}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.tabs}>
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            className={idx === ACTIVE_TAB ? styles.activeTab : undefined}
          >
            {tab}
          </button>
        ))}
      </section>

      <section className={styles.list}>
        {QUESTIONS.map((question) => (
          <article key={question.id} className={styles.questionCard}>
            <header className={styles.questionHeader}>
              <div>
                <p className={styles.requester}>의뢰인: {question.requester}</p>
                <p className={styles.meta}>
                  {question.postedAgo} ·{" "}
                  {question.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              </div>
              <div className={styles.rewardBox}>
                <span>{question.reward}</span>
                <span className={styles.deadline}>{question.deadline}</span>
              </div>
            </header>

            <div className={styles.questionBody}>
              <span className={styles.qIcon}>Q.</span>
              <div>
                <h3>{question.title}</h3>
                <p>{question.body}</p>
              </div>
            </div>

            <footer className={styles.questionFooter}>
              <div className={styles.actions}>
                <span className={styles.iconLike} />
                <span>{question.likes}</span>
                <span className={styles.iconComment} />
                <span>{question.comments}</span>
              </div>
              <button className={styles.iconMore} aria-label="more" />
            </footer>
          </article>
        ))}
      </section>
    </div>
  );
}
