// ==========================================
// 🧪 Crowdians Mock Data
// ==========================================

export interface User {
  id: string;
  name: string;
  avatar: string; // 이미지 경로
  level: number;
  exp: number;
  maxExp: number;
  stamina: number; // 피로도
  maxStamina: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Quest {
  id: string;
  title: string;
  reward: number;
  status: "open" | "closed" | "selected";
  commentCount: number;
  requesterName: string;
  date: string;
}

// 1. 👤 유저 정보 (로그인한 내 정보)
export const MOCK_USER: User = {
  id: "user_001",
  name: "픽셀장인",
  avatar: "/Crowdy/GEOS.gif", // 기본 캐릭터
  level: 5,
  exp: 450,
  maxExp: 1000,
  stamina: 15,
  maxStamina: 20,
};

// 2. 💬 채팅 내역 (AI와의 대화)
export const MOCK_CHATS: Message[] = [
  {
    id: "msg_1",
    role: "assistant",
    content: "안녕! 나는 크라우디야. 오늘은 어떤 지식을 나눠줄거니?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
  },
  {
    id: "msg_2",
    role: "user",
    content: "Next.js 14의 Server Actions에 대해 알려줄게.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3분 전
  },
  {
    id: "msg_3",
    role: "assistant",
    content:
      "오, 흥미로운 주제네! Server Actions가 기존 API 라우트랑 다른 점이 뭐야?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1), // 1분 전
  },
];

// 3. 📜 퀘스트 목록 (지식 광장 / Data Pool)
export const MOCK_QUESTS: Quest[] = [
  {
    id: "q_1",
    title:
      "React Query의 staleTime과 cacheTime의 차이를 정확히 알고 싶어요 (상세 설명 부탁)",
    reward: 500,
    status: "open",
    commentCount: 3,
    requesterName: "뉴비개발자",
    date: "2026.01.28",
  },
  {
    id: "q_2",
    title: "픽셀 아트 찍을 때 사용하는 툴 추천해주세요!",
    reward: 100,
    status: "selected",
    commentCount: 12,
    requesterName: "도트매니아",
    date: "2026.01.25",
  },
  {
    id: "q_3",
    title: "Next.js Middleware에서 로그인 체크하는 법",
    reward: 300,
    status: "closed",
    commentCount: 5,
    requesterName: "풀스택지망생",
    date: "2026.01.20",
  },
  {
    id: "q_4",
    title: "자바스크립트 클로저(Closure) 쉽게 설명해주실 분 구합니다 ㅠㅠ",
    reward: 1000,
    status: "open",
    commentCount: 0,
    requesterName: "코딩포기직전",
    date: "2026.01.28",
  },
];

// ==========================================
// 🃏 Knowledge Cards (지식 카드)
// ==========================================

export interface KnowledgeCard {
  id: string;
  type: "vote" | "teach";
  /** i18n key for question, e.g. "cards.kc_1.question" */
  questionKey: string;
  /** i18n key for category, e.g. "cards.kc_1.category" */
  categoryKey: string;
  /** i18n key for answer A (vote only), e.g. "cards.kc_1.answerA" */
  answerAKey?: string;
  /** i18n key for answer B (vote only), e.g. "cards.kc_1.answerB" */
  answerBKey?: string;
  /** i18n key for hint (teach only), e.g. "cards.kc_2.hint" */
  hintKey?: string;
  expReward: number;
}

export const MOCK_KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: "kc_1",
    type: "vote",
    questionKey: "cards.kc_1.question",
    categoryKey: "cards.kc_1.category",
    answerAKey: "cards.kc_1.answerA",
    answerBKey: "cards.kc_1.answerB",
    expReward: 50,
  },
  {
    id: "kc_2",
    type: "teach",
    questionKey: "cards.kc_2.question",
    categoryKey: "cards.kc_2.category",
    hintKey: "cards.kc_2.hint",
    expReward: 80,
  },
  {
    id: "kc_3",
    type: "vote",
    questionKey: "cards.kc_3.question",
    categoryKey: "cards.kc_3.category",
    answerAKey: "cards.kc_3.answerA",
    answerBKey: "cards.kc_3.answerB",
    expReward: 50,
  },
  {
    id: "kc_4",
    type: "teach",
    questionKey: "cards.kc_4.question",
    categoryKey: "cards.kc_4.category",
    hintKey: "cards.kc_4.hint",
    expReward: 100,
  },
  {
    id: "kc_5",
    type: "vote",
    questionKey: "cards.kc_5.question",
    categoryKey: "cards.kc_5.category",
    answerAKey: "cards.kc_5.answerA",
    answerBKey: "cards.kc_5.answerB",
    expReward: 50,
  },
];

// ==========================================
// ⚔️ Adventure (모험)
// ==========================================

export interface Monster {
  id: string;
  /** i18n key for name, e.g. "monsters.m1" */
  nameKey: string;
  emoji: string;
  hp: number;
  rewardGold: number;
  damage: number;
}

export interface Treasure {
  id: string;
  /** i18n key for name, e.g. "treasures.t1" */
  nameKey: string;
  emoji: string;
  goldMin: number;
  goldMax: number;
}

export const MONSTERS: Monster[] = [
  { id: "m1", nameKey: "monsters.m1", emoji: "👾", hp: 30, rewardGold: 50, damage: 10 },
  { id: "m2", nameKey: "monsters.m2", emoji: "🕷️", hp: 50, rewardGold: 80, damage: 15 },
  { id: "m3", nameKey: "monsters.m3", emoji: "🤖", hp: 80, rewardGold: 120, damage: 20 },
  { id: "m4", nameKey: "monsters.m4", emoji: "🐉", hp: 100, rewardGold: 200, damage: 30 },
  { id: "m5", nameKey: "monsters.m5", emoji: "👻", hp: 60, rewardGold: 100, damage: 25 },
];

export const TREASURES: Treasure[] = [
  { id: "t1", nameKey: "treasures.t1", emoji: "🎁", goldMin: 20, goldMax: 60 },
  { id: "t2", nameKey: "treasures.t2", emoji: "💰", goldMin: 50, goldMax: 150 },
  { id: "t3", nameKey: "treasures.t3", emoji: "💎", goldMin: 80, goldMax: 200 },
  { id: "t4", nameKey: "treasures.t4", emoji: "✨", goldMin: 30, goldMax: 100 },
];

// ==========================================
// 🎓 Academy State (아카데미)
// ==========================================

export interface PendingReward {
  cardId: string;
  expAmount: number;
  status: "grading" | "approved" | "rejected";
}

export interface AcademyState {
  learningTickets: number;
  maxTickets: number;
  questionsPerTicket: number;
  trustScore: number;
  pendingRewards: PendingReward[];
}

export const INITIAL_ACADEMY_STATE: AcademyState = {
  learningTickets: 3,
  maxTickets: 3,
  questionsPerTicket: 5,
  trustScore: 50,
  pendingRewards: [],
};
