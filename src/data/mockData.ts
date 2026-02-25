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
  gold: number;
  trust: number; // 신뢰도
  intelligence: number; // 지능
  courage: number; // 용기
  intimacy: number; // 친밀도
  dailyArchiveViews: number;
  maxDailyArchiveViews: number;
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
  gold: 500,
  trust: 1000,
  intelligence: 0,
  courage: 0,
  intimacy: 0,
  dailyArchiveViews: 0,
  maxDailyArchiveViews: 5,
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
  type: "choice" | "descriptive";
  /** i18n key for question, e.g. "cards.kc_1.question" */
  questionKey: string;
  /** i18n key for category, e.g. "cards.kc_1.category" */
  typeKey: string;
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
    type: "choice",
    questionKey: "cards.kc_1.question",
    typeKey: "cards.kc_1.type",
    answerAKey: "cards.kc_1.answerA",
    answerBKey: "cards.kc_1.answerB",
    expReward: 50,
  },
  {
    id: "kc_2",
    type: "descriptive",
    questionKey: "cards.kc_2.question",
    typeKey: "cards.kc_2.type",
    hintKey: "cards.kc_2.hint",
    expReward: 80,
  },
  {
    id: "kc_3",
    type: "choice",
    questionKey: "cards.kc_3.question",
    typeKey: "cards.kc_3.type",
    answerAKey: "cards.kc_3.answerA",
    answerBKey: "cards.kc_3.answerB",
    expReward: 50,
  },
  {
    id: "kc_4",
    type: "descriptive",
    questionKey: "cards.kc_4.question",
    typeKey: "cards.kc_4.type",
    hintKey: "cards.kc_4.hint",
    expReward: 100,
  },
  {
    id: "kc_5",
    type: "choice",
    questionKey: "cards.kc_5.question",
    typeKey: "cards.kc_5.type",
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
  {
    id: "m1",
    nameKey: "monsters.m1",
    emoji: "👾",
    hp: 30,
    rewardGold: 50,
    damage: 10,
  },
  {
    id: "m2",
    nameKey: "monsters.m2",
    emoji: "🕷️",
    hp: 50,
    rewardGold: 80,
    damage: 15,
  },
  {
    id: "m3",
    nameKey: "monsters.m3",
    emoji: "🤖",
    hp: 80,
    rewardGold: 120,
    damage: 20,
  },
  {
    id: "m4",
    nameKey: "monsters.m4",
    emoji: "🐉",
    hp: 100,
    rewardGold: 200,
    damage: 30,
  },
  {
    id: "m5",
    nameKey: "monsters.m5",
    emoji: "👻",
    hp: 60,
    rewardGold: 100,
    damage: 25,
  },
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

// ==========================================
// 📚 Academy Archive (지식 도서관)
// ==========================================

export interface ArchiveAnswer {
  id: string;
  content: string;
  authorName: string;
  votes: number;
  isTop?: boolean;
}

export interface ArchiveItem {
  id: string;
  question: string;
  type: string;
  tags: string[];
  likes: number;
  authorName: string; // 해결사(질문자x) or Top answerer
  createdAt: string;
  answers: ArchiveAnswer[]; // Top 3
}

export const MOCK_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "arc_1",
    question:
      "React Query의 staleTime과 cacheTime의 차이를 완벽하게 이해하고 싶습니다.",
    type: "choice",
    tags: ["React", "ReactQuery", "StateManagement"],
    likes: 142,
    authorName: "DevWizard",
    createdAt: "2024.02.10",
    answers: [
      {
        id: "a1",
        content:
          "staleTime은 데이터가 '신선함'에서 '상함'으로 변경되는 시간입니다. staleTime 동안은 캐시된 데이터를 그대로 사용하며 재요청을 하지 않습니다.\n반면 cacheTime은 데이터가 '사용되지 않을 때' 메모리에 남아있는 시간입니다. 컴포넌트가 언마운트되어 쿼리가 비활성화된 후 cacheTime만큼 지나면 GC됩니다.",
        authorName: "DevWizard",
        votes: 56,
        isTop: true,
      },
      {
        id: "a2",
        content:
          "쉽게 말해 staleTime은 '재요청 방지 시간', cacheTime은 '메모리 유지 시간'입니다. 많은 분들이 이 둘을 혼동하여 불필요한 네트워크 요청을 발생시킵니다.",
        authorName: "CodeNinja",
        votes: 34,
      },
      {
        id: "a3",
        content:
          "Default 값은 staleTime: 0, cacheTime: 5분입니다. 즉, 기본적으로 React Query는 모든 데이터를 즉시 상한 것으로 간주하여 매번 다시 가져오려고 시도합니다.",
        authorName: "ReactLover",
        votes: 12,
      },
    ],
  },
  {
    id: "arc_2",
    question:
      "Next.js 14 Server Actions에서 클라이언트 컴포넌트와 상호작용하는 베스트 프랙티스",
    type: "descriptive",
    tags: ["Next.js", "ServerActions", "RSC"],
    likes: 98,
    authorName: "VercelFan",
    createdAt: "2024.02.08",
    answers: [
      {
        id: "b1",
        content:
          "Server Action을 Props로 내려주는 것보다는, 별도의 파일(actions.ts)로 분리하여 'use server' 지시어를 최상단에 선언하고 import해서 사용하는 것이 좋습니다. 클라이언트 컴포넌트에서 직접 정의할 수는 없기 때문입니다.",
        authorName: "VercelFan",
        votes: 45,
        isTop: true,
      },
      {
        id: "b2",
        content:
          "useFormState(현재 useActionState) 훅을 사용하여 서버 액션의 결과(성공/실패/에러메시지)를 상태로 관리하는 패턴이 권장됩니다.",
        authorName: "HookMaster",
        votes: 28,
      },
    ],
  },
  {
    id: "arc_3",
    question: "CSS Grid: minmax()와 auto-fit, auto-fill의 차이점 정리",
    type: "choice",
    tags: ["CSS", "Grid", "Layout"],
    likes: 215,
    authorName: "StyleGuru",
    createdAt: "2024.01.25",
    answers: [
      {
        id: "c1",
        content:
          "auto-fill은 남는 공간이 있을 때 빈 컬럼을 계속 생성하여 채웁니다. 반면 auto-fit은 남는 공간이 있으면 현재 존재하는 컬럼들을 늘려서 꽉 채웁니다(stretch).",
        authorName: "StyleGuru",
        votes: 110,
        isTop: true,
      },
    ],
  },
  {
    id: "arc_4",
    question:
      "TypeScript 유틸리티 타입 Pick, Omit, Partial, Required 마스터하기",
    type: "choice",
    tags: ["TypeScript", "UtilityTypes"],
    likes: 76,
    authorName: "TypeSafety",
    createdAt: "2024.02.01",
    answers: [
      {
        id: "d1",
        content:
          "Mapped Type을 이해하면 유틸리티 타입을 직접 만들 수 있습니다. Pick<T, K>는 { [P in K]: T[P] }와 같습니다.",
        authorName: "TypeSafety",
        votes: 30,
        isTop: true,
      },
    ],
  },
  {
    id: "arc_5",
    question:
      "도커(Docker) 컨테이너와 가상머신(VM)의 성능 차이가 발생하는 근본적인 이유",
    type: "descriptive",
    tags: ["Docker", "VM", "OS"],
    likes: 320,
    authorName: "InfraKing",
    createdAt: "2024.01.15",
    answers: [
      {
        id: "e1",
        content:
          "VM은 하이퍼바이저 위에 게스트 OS를 통째로 올리기 때문에 무겁습니다. 반면 Docker 컨테이너는 호스트 OS의 커널을 공유하며 프로세스 격리(namespace, cgroups)만 수행하므로 오버헤드가 훨씬 적습니다.",
        authorName: "InfraKing",
        votes: 150,
        isTop: true,
      },
    ],
  },
  {
    id: "arc_6",
    question: "클린 코드: 함수는 한 가지 일만 해야 한다는 원칙의 구체적인 기준",
    type: "descriptive",
    tags: ["CleanCode", "Refactoring"],
    likes: 88,
    authorName: "UncleBobFan",
    createdAt: "2024.02.05",
    answers: [
      {
        id: "f1",
        content:
          "추상화 레벨이 하나여야 한다는 뜻입니다. 함수 내의 모든 문장이 동일한 추상화 수준에 있다면 그 함수는 한 가지 일만 하는 것입니다.",
        authorName: "UncleBobFan",
        votes: 40,
        isTop: true,
      },
    ],
  },
];
