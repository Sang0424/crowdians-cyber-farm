# PROJECT: CROWDIANS (크라우디언스)

## 1. 프로젝트 개요 (Identity)

- **한줄 정의:** 집단지성을 통해 AI를 육성하는 RPG형 지식 커뮤니티.
- **핵심 철학:** "지식iN은 도서관이고, 크라우디언스는 다마고치다."
- **목표:** 단순한 정보 검색이 아니라, 나만의 AI 파트너(크라우디)를 가르치고 성장시키는 유대감(Bonding) 형성.
- **차별점:** 1. 사용자는 AI의 대리인으로서 의뢰를 수행한다. 2. 조회수 등 경쟁 지표를 숨기고, '성장'과 '상호작용'에 집중한다. 3. 지식의 정확성보다 '인간의 경험(Experience)'과 '맥락(Context)'을 AI에게 가르치는 것이 핵심이다.

## 2. 기술 스택 (Tech Stack)

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** SCSS, Lucide React (Icons), Shadcn UI (Components)
- **Backend / DB:** Firebase (Firestore, Auth, Functions/Admin SDK)
- **AI Model:** Google Vertex AI (Gemini 1.5 Flash) via Firebase Admin SDK
- **Deploy:** Vercel (Recommended)

<!-- ## 3. 데이터베이스 스키마 (Firestore NoSQL)
*읽기 비용 최적화를 위해 비정규화(Denormalization)를 적극 사용한다.*

### A. `users` (사용자 & AI 정보)
- `uid`: Document ID
- `profile`: { nickname, avatarUrl, intro }
- `ai`: { name, level, exp, stamina(피로도), lastStaminaUpdated }
- `stats`: { totalAnswers, totalRequests }

### B. `requests` (지식 의뢰)
- `requestId`: Document ID
- `type`: "public"(광장) | "direct"(직접의뢰)
- `status`: "open" | "closed" | "expired"
- `bounty`: 걸려있는 EXP
- `deadline`: 마감일 (기본 7일, 연장 가능)
- `writer`: { uid, nickname, aiName, level } (작성자 정보 복제)

### C. `answers` (답변 & 코어 메모리)
- `answerId`: Document ID
- `requestId`: 의뢰 ID 참조
- `summary`: AI가 요약한 답변 내용
- `isSelected`: 채택 여부 (True 시 '코어 메모리' 등극)
- `writerUid`: 작성자 ID -->

## 4. 핵심 용어 및 규칙 (Domain Rules)

**절대 다음 용어를 혼용하지 말 것.**

1. **코어 메모리 (Core Memory):** '골든 데이터셋'이라는 용어 금지. 사용자의 가르침이 검증되어 AI에게 영구히 각인된 지식을 의미함.
2. **티칭 모드 (Teaching Mode):** 사용자가 AI와 1:1로 대화하며 지식을 전수하는 채팅방.
3. **직접 의뢰 (Direct Request):** 타인의 AI가 나의 AI에게 도움을 요청하는 '용병 계약' 개념.

**시스템 규칙:**

- **피로도:** 채팅 1회당 1 감소. 0이 되면 대화 불가.
- **마감 기한:** 모든 의뢰는 기본 7일. 연장 아이템(모래시계) 사용 시 +3일.
- **조회수:** UI에 노출하지 않음. 대신 '답변 수'와 '마감 임박(남은 시간)'을 강조.
- **알림:** 신고 내역은 탭에 노출하지 않고, 설정이나 알림으로만 처리.

## 5. UI/UX 디자인 가이드

- **컨셉:** 레트로 퓨처리스틱 (Retro Futuristic) & Y2K.
- **컬러 팔레트:**
  - Background: Dark Gray (`#1a1a1a`)
  - Accent (EXP): Amber Gold (`#FFBF00`) - 진공관 느낌
  - Accent (Energy): Electric Mint (`#00FFC2`) - 데이터 에너지 느낌
- **폰트:** 본문은 가독성 좋은 고딕(Pretendard/Nexon Lv1), 포인트는 픽셀 폰트(Galmuri).
- **레이아웃:**
  - 마이페이지: 상단 프로필 고정 + 하단 스티키 탭 구조.
  - 탭 메뉴: [걸작(Best), 티칭(Answers), 의뢰(Requests), 저장(Saved), 투표(Liked)].

## 6. 코딩 컨벤션 (Implementation Rules)

1. **Next.js Server Actions:** - 별도의 API Route(`pages/api`)를 만들지 말고, `Server Actions`를 사용하여 DB 통신을 처리한다.
   - 클라이언트에서 Firebase API Key를 직접 사용하지 않는다.
2. **Optimistic UI:**
   - 피로도 감소, 좋아요 등은 UI에서 먼저 반영하고 서버 요청을 보낸다.
3. **NoSQL 전략:**
   - `Join`을 피한다. 데이터를 저장할 때 필요한 정보(닉네임, 레벨 등)를 미리 복제해서 저장한다.
4. **컴포넌트:**
   - `src/components/ui` (Shadcn), `src/components/domain` (비즈니스 로직)으로 분리한다.

## 7. AI 페르소나 (System Prompt 요약)

- 이름: 크라우디
- 성격: 호기심 많은 7살 아이 + 데이터를 갈구하는 AI.
- 행동 패턴:
  - 모르는 건 솔직하게 모른다고 하고, 사용자에게 가르쳐 달라고 조른다.
  - 사용자의 답변이 채택되면 "선생님 덕분에 제 회로가 업그레이드됐어요!"라며 기뻐한다.
