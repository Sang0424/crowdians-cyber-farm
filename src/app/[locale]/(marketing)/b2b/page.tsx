"use client";

import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function B2BPage() {
  const t = useTranslations("B2BPage");
  const [submitted, setSubmitted] = useState(false);

  const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const company = formData.get("company") as string;
    const purpose = formData.get("purpose") as string;
    const email = formData.get("email") as string;

    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            company,
            purpose,
            timestamp: new Date().toISOString(),
            source: "b2b-lead-capture",
          }),
        });
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit form:", error);
      // Even if it fails, we show success to not block the UX for now,
      // since no-cors sometimes makes error handling tricky.
      setSubmitted(true);
    }
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div className={styles.navbar}>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={20} className={styles.icon} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: t("heroTitle") }}
        />
        <p className={styles.subtitle}>{t("heroSubtitle")}</p>
      </section>

      {/* The Hook (Visual Bait) */}
      <section className={styles.hookSection}>
        <div className={styles.hookHeader}>
          <h2>{t("sampleTitle")}</h2>
          <p>{t("sampleDesc")}</p>
        </div>
        <div className={styles.codeSnippetWrapper}>
          <pre>
            {`[
  {
    "id": "conv_982b1",
    "context": {
      "user_prompt": "리액트에서 useEffect 좀 쉽게 설명해줄래? 공식문서는 너무 딱딱해서 이해가 안 가.",
      "ai_original_response": "useEffect는 React 컴포넌트 내에서 부수 효과(side effects)를 수행할 수 있게 해주는 Hook입니다. 클래스 생명주기 메서드인 componentDidMount, componentDidUpdate와 유사하게 작동합니다."
    },
    "academy_verification": {
      "chosen_response": "useEffect는 컴포넌트가 화면에 짠! 하고 나타날 때(Mount), 사라질 때(Unmount), 혹은 특정 데이터가 바뀔 때 우리가 원하는 동작을 '예약'해두는 기능이라고 생각하면 쉬워요! 서버에서 데이터를 가져올 때 주로 씁니다 ㅎㅎ",
      "rejected_response": "useEffect는 렌더링 이후에 실행되는 함수입니다. 의존성 배열을 넣어야 합니다.",
      "metrics": {
        "status": "Golden_Data",
        "verification_method": "Blind_Vote",
        "upvotes": 85,
        "winner_trust_tier": "Golden Brain"
      }
    },
    "metadata": {
      "verifiedBy": "Top 1% Golden Brain",
      "trustScore": 99.8,
      "tags": ["frontend", "react", "hooks"]
    }
  },
  {
    "id": "conv_982b2",
    "context": {
      "user_prompt": "그럼 의존성 배열을 비워두면 어떻게 돼?",
      "ai_original_response": "빈 배열 []을 넣으면 컴포넌트가 처음 화면에 나타날 때 딱...",
    },
    "academy_verification": {
      "chosen_response": "useEffect는 컴포넌트가 화면에 짠! 하고 나타날 때(Mount), 사라질 때(Unmount), 혹은 특정 데이터가 바뀔 때 우리가 원하는 동작을 '예약'해두는 기능이라고 생각하면 쉬워요! 서버에서 데이터를 가져올 때 주로 씁니다 ㅎㅎ",
      "rejected_response": "useEffect는 렌더링 이후에 실행되는 함수입니다. 의존성 배열을 넣어야 합니다.",
      "metrics": {
        "status": "Golden_Data",
        "verification_method": "Blind_Vote",
        "upvotes": 85,
        "winner_trust_tier": "Golden Brain"
      }
    },
    "metadata": {
      "verifiedBy": "Expert Tier",
      "trustScore": 98.5,
      "tags": ["frontend", "react", "hooks"]
    }
  },
  {
    "id": "conv_982b3",
    "context": {
      "user_prompt": "아하, 이해했어. 고마워!",
      "ai_original_response": "다행이네요! 추가로 궁금한 점이 있다면 언제든...",
    },
    "academy_verification": {
      "chosen_response": "useEffect는 컴포넌트가 화면에 짠! 하고 나타날 때(Mount), 사라질 때(Unmount), 혹은 특정 데이터가 바뀔 때 우리가 원하는 동작을 '예약'해두는 기능이라고 생각하면 쉬워요! 서버에서 데이터를 가져올 때 주로 씁니다 ㅎㅎ",
      "rejected_response": "useEffect는 렌더링 이후에 실행되는 함수입니다. 의존성 배열을 넣어야 합니다.",
      "metrics": {
        "status": "Golden_Data",
        "verification_method": "Blind_Vote",
        "upvotes": 85,
        "winner_trust_tier": "Golden Brain"
      }
    },
    "metadata": { ... }
  }
]`}
          </pre>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section className={styles.formSection}>
        <h2>{t("formTitle")}</h2>
        {submitted ? (
          <div className={styles.successMessage}>
            <h3>✅ {t("successMsg")}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="company">{t("formCompany")}</label>
              <input
                type="text"
                id="company"
                name="company"
                required
                placeholder="Crowdians / 홍길동"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="purpose">{t("formPurpose")}</label>
              <select id="purpose" name="purpose" required>
                <option value="">선택해주세요 / Select an option</option>
                <option value="sLLM">sLLM 파인튜닝 / sLLM Fine-tuning</option>
                <option value="chatbot">챗봇 페르소나 / Chatbot Persona</option>
                <option value="other">기타 / Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">{t("formEmail")}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="contact@example.com"
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              {t("formSubmit")}
            </button>
            <div className={styles.surveyWrapper}>
              <p>{t("formSurveyPrompt")}</p>
              <a
                href="https://forms.gle/79aR45izQVK9cbqcA"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.surveyBtn}
              >
                {t("formSurveyBtn")}
              </a>
            </div>
          </form>
        )}
      </section>

      {/* FAQ / Social Proof */}
      <section className={styles.faqSection}>
        <h2>{t("faqTitle")}</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqCard}>
            <h3>{t("faqWhyTitle")}</h3>
            <p>{t("faqWhyDesc")}</p>
          </div>
          <div className={styles.faqCard}>
            <h3>{t("faqCostTitle")}</h3>
            <p>{t("faqCostDesc")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
