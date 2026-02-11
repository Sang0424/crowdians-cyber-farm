"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import {
  ArrowLeft,
  Bookmark,
  MessageCircle,
  SendHorizontal,
  Share2,
  ThumbsUp,
} from "lucide-react";

type QuestionDetail = {
  id: string;
  title: string;
  body: string[];
  tags: string[];
  rewardLabel: string;
  deadline: string;
  likes: number;
  comments: number;
  postedAgo: string;
  requester: string;
};

type Answer = {
  id: string;
  nickname: string;
  role: string;
  body: string;
  likes: number;
  postedAgo: string;
  isBest?: boolean;
};

type RelatedPost = {
  id: string;
  title: string;
  reward?: string;
};

const QUESTION: QuestionDetail = {
  id: "q-1",
  title: "AI가 인간을 대체할 수 있을까요?",
  body: [
    "최근 ChatGPT와 같은 AI의 발전이 눈부신데, 정말로 인간의 일자리를 완전히 대체할 수 있을까요?",
    "창의성이나 감성 같은 영역도 AI가 따라잡을 수 있는지 다양한 의견을 듣고 싶어요.",
  ],
  tags: ["과학", "일상"],
  rewardLabel: "보상 50 G",
  deadline: "D-7",
  likes: 24,
  comments: 2,
  postedAgo: "15분 전",
  requester: "의뢰인: UserName",
};

const ANSWERS: Answer[] = [
  {
    id: "a-1",
    nickname: "AI 연구자",
    role: "머신러닝 엔지니어",
    body: "AI는 도구일 뿐 인간을 완전히 대체할 수는 없습니다. 특히 창의성과 감성은 여전히 인간 고유의 영역입니다.",
    likes: 24,
    postedAgo: "3시간 전",
    isBest: true,
  },
  {
    id: "a-2",
    nickname: "AI 연구자",
    role: "데이터 사이언티스트",
    body: "생산성 향상은 확실하지만, 협업과 윤리적 판단은 아직 인간의 몫입니다.",
    likes: 12,
    postedAgo: "3시간 전",
  },
];

const BOUNTIES: RelatedPost[] = [
  { id: "b-1", title: "성수동 파스타 말고 추천 있을까요?", reward: "80 G" },
  { id: "b-2", title: "LLM 프롬프트 작성 꿀팁 공유해주세요", reward: "150 G" },
  { id: "b-3", title: "퇴근길 팟캐 추천", reward: "30 G" },
];

const TRENDING: RelatedPost[] = [
  { id: "t-1", title: "Next.js Server Actions 정리" },
  { id: "t-2", title: "디자이너와 협업하는 법" },
  { id: "t-3", title: "하루 10분 영어 루틴" },
];

export default function BoardDetailPage() {
  return (
    <main className={styles.page}>
      <section className={styles.mainColumn}>
        <button className={styles.backButton} type="button">
          <ArrowLeft size={18} /> 목록으로
        </button>

        <article className={styles.questionCard}>
          <header className={styles.questionHeader}>
            <div className={styles.requesterBlock}>
              <Image
                src={
                  "http://localhost:3845/assets/0e587ebbdc1e84e3fe531a6948ebc41ca28c647a.png"
                }
                alt="avatar"
                width={64}
                height={64}
                className={styles.avatar}
                unoptimized
              />
              <div>
                <p className={styles.requester}>{QUESTION.requester}</p>
                <p className={styles.meta}>{QUESTION.postedAgo}</p>
              </div>
            </div>

            <div className={styles.actions}>
              <button aria-label="share">
                <Share2 size={18} />
              </button>
              <button aria-label="bookmark">
                <Bookmark size={18} />
              </button>
            </div>
          </header>

          <div className={styles.tags}>
            {QUESTION.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <div className={styles.questionBody}>
            <div className={styles.badges}>
              <span className={styles.rewardBadge}>{QUESTION.rewardLabel}</span>
              <span className={styles.deadlineBadge}>{QUESTION.deadline}</span>
            </div>
            <h1>{QUESTION.title}</h1>
            {QUESTION.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.reactions}>
            <div>
              <ThumbsUp size={18} />
              <span>{QUESTION.likes}</span>
            </div>
            <div>
              <MessageCircle size={18} />
              <span>{QUESTION.comments}</span>
            </div>
          </div>
        </article>

        <div className={styles.answerHeader}>
          <div>
            <span>답변</span>
            <strong>{ANSWERS.length}개</strong>
          </div>
          <div className={styles.sortTabs}>
            <button className={styles.activeSort}>신뢰순</button>
            <button>최신순</button>
          </div>
        </div>

        <div className={styles.answers}>
          {ANSWERS.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>

        <div className={styles.composer}>
          <textarea placeholder="답을 알려주세요" />
          <button type="button" aria-label="send">
            <SendHorizontal size={20} />
          </button>
        </div>
      </section>

      <aside className={styles.sidebar}>
        <RelatedList
          title="💰 이 주제의 현상금 의뢰"
          items={BOUNTIES}
          showReward
        />
        <RelatedList title="🔥 이 주제의 인기글" items={TRENDING} />
      </aside>
    </main>
  );
}

function AnswerCard({ answer }: { answer: Answer }) {
  return (
    <article
      className={`${styles.answerCard} ${answer.isBest ? styles.bestAnswer : styles.normalAnswer}`}
    >
      <div className={styles.answerBadgeRow}>
        <span className={styles.answerBadge}>
          {answer.isBest ? "👑 BEST" : "#2"}
        </span>
        <span className={styles.answerMeta}>{answer.postedAgo}</span>
      </div>
      <header className={styles.answerHeaderRow}>
        <div>
          <p className={styles.answerNickname}>{answer.nickname}</p>
          <p className={styles.answerRole}>{answer.role}</p>
        </div>
        <button type="button" className={styles.adoptButton}>
          + 채택하기
        </button>
      </header>
      <p className={styles.answerBody}>{answer.body}</p>
      <div className={styles.answerReactions}>
        <div>
          <ThumbsUp size={18} />
          <span>{answer.likes}</span>
        </div>
      </div>
    </article>
  );
}

function RelatedList({
  title,
  items,
  showReward = false,
}: {
  title: string;
  items: RelatedPost[];
  showReward?: boolean;
}) {
  return (
    <section className={styles.relatedCard}>
      <header>
        <h2>{title}</h2>
        <button type="button">+ 더보기</button>
      </header>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            {showReward && item.reward && <strong>{item.reward}</strong>}
          </li>
        ))}
      </ul>
    </section>
  );
}
