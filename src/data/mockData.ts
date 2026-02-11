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
  question: string;
  category: string;
  /** Vote 카드일 때만 존재 */
  answerA?: string;
  answerB?: string;
  /** Teach 카드일 때 힌트 */
  hint?: string;
  expReward: number;
}

export const MOCK_KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: "kc_1",
    type: "vote",
    question: "React에서 useEffect의 cleanup 함수는 언제 실행될까요?",
    category: "프론트엔드",
    answerA:
      "컴포넌트가 언마운트될 때만 실행됩니다. 마운트 시점에 설정한 리소스를 정리하는 역할을 합니다.",
    answerB:
      "의존성이 변경되어 리렌더링될 때와 언마운트될 때 모두 실행됩니다. 이전 이펙트를 정리한 후 새 이펙트가 실행됩니다.",
    expReward: 50,
  },
  {
    id: "kc_2",
    type: "teach",
    question: "자바스크립트에서 '호이스팅(Hoisting)'이란 무엇인가요?",
    category: "자바스크립트",
    hint: "변수와 함수 선언이 어떻게 처리되는지 생각해보세요.",
    expReward: 80,
  },
  {
    id: "kc_3",
    type: "vote",
    question: "CSS에서 Flexbox와 Grid의 가장 큰 차이점은 무엇인가요?",
    category: "CSS",
    answerA:
      "Flexbox는 1차원(행 또는 열), Grid는 2차원(행과 열 동시) 레이아웃에 적합합니다.",
    answerB:
      "Flexbox는 구형 브라우저 호환용이고, Grid가 Flexbox의 완전한 상위 호환입니다.",
    expReward: 50,
  },
  {
    id: "kc_4",
    type: "teach",
    question: "REST API와 GraphQL의 장단점을 비교해주세요.",
    category: "백엔드",
    hint: "데이터 패칭 방식과 오버페칭/언더페칭 관점에서 생각해보세요.",
    expReward: 100,
  },
  {
    id: "kc_5",
    type: "vote",
    question:
      "TypeScript에서 interface와 type의 차이점은 무엇인가요?",
    category: "타입스크립트",
    answerA:
      "둘은 거의 동일하지만, interface는 선언 병합(declaration merging)이 가능하고 type은 유니온/인터섹션이 자유롭습니다.",
    answerB:
      "interface는 객체에만 쓸 수 있고, type은 모든 타입에 사용할 수 있어서 type이 항상 더 좋습니다.",
    expReward: 50,
  },
];

// ==========================================
// ⚔️ Adventure (모험)
// ==========================================

export interface Monster {
  id: string;
  name: string;
  emoji: string;
  hp: number;
  rewardGold: number;
  damage: number;
}

export interface Treasure {
  id: string;
  name: string;
  emoji: string;
  goldMin: number;
  goldMax: number;
}

export const MONSTERS: Monster[] = [
  { id: "m1", name: "글리치 슬라임", emoji: "👾", hp: 30, rewardGold: 50, damage: 10 },
  { id: "m2", name: "버그 스파이더", emoji: "🕷️", hp: 50, rewardGold: 80, damage: 15 },
  { id: "m3", name: "데이터 고렘", emoji: "🤖", hp: 80, rewardGold: 120, damage: 20 },
  { id: "m4", name: "바이러스 드래곤", emoji: "🐉", hp: 100, rewardGold: 200, damage: 30 },
  { id: "m5", name: "팬텀 해커", emoji: "👻", hp: 60, rewardGold: 100, damage: 25 },
];

export const TREASURES: Treasure[] = [
  { id: "t1", name: "데이터 조각 상자", emoji: "🎁", goldMin: 20, goldMax: 60 },
  { id: "t2", name: "비트코인 지갑", emoji: "💰", goldMin: 50, goldMax: 150 },
  { id: "t3", name: "고대 USB", emoji: "💎", goldMin: 80, goldMax: 200 },
  { id: "t4", name: "네온 크리스탈", emoji: "✨", goldMin: 30, goldMax: 100 },
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
