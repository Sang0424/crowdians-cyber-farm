"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  FormEvent,
} from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@radix-ui/themes";
import { Mail, Check, Sparkles } from "lucide-react";
import styles from "./waitListModal.module.scss";

// ============================================
// 📌 Google Apps Script Web App URL
// Google Sheets에서 확장 프로그램 > Apps Script로 배포한 URL을 여기에 넣으세요
// ============================================
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

// ============================================
// Context 타입 정의
// ============================================
type WaitListContextType = {
  openWaitListModal: () => void;
  closeWaitListModal: () => void;
};

const WaitListContext = createContext<WaitListContextType | undefined>(
  undefined
);

// ============================================
// Provider 컴포넌트
// ============================================
export function WaitListModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const navCountRef = useRef(0);
  const prevPathRef = useRef(pathname);

  // 페이지 이동 감지 및 카운트
  useEffect(() => {
    // 초기 렌더링 시 이전 경로와 같으면 무시
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    // 이미 닫았거나, 제출한 적이 있으면 무시
    if (dismissed) return;

    // sessionStorage에서 이미 제출/닫기 여부 확인
    const alreadyActed = sessionStorage.getItem("waitlist_acted");
    if (alreadyActed) {
      setDismissed(true);
      return;
    }

    navCountRef.current += 1;

    // 3번째 이동 시 모달 오픈
    if (navCountRef.current >= 3) {
      setIsOpen(true);
    }
  }, [pathname, dismissed]);

  const openWaitListModal = () => setIsOpen(true);

  const closeWaitListModal = () => {
    setIsOpen(false);
    setDismissed(true);
    sessionStorage.setItem("waitlist_acted", "true");
  };

  return (
    <WaitListContext.Provider value={{ openWaitListModal, closeWaitListModal }}>
      {children}
      {isOpen && <WaitListModal onClose={closeWaitListModal} />}
    </WaitListContext.Provider>
  );
}

// ============================================
// Hook
// ============================================
export function useWaitListModal() {
  const context = useContext(WaitListContext);
  if (!context) {
    throw new Error(
      "useWaitListModal must be used within a WaitListModalProvider"
    );
  }
  return context;
}

// ============================================
// WaitList 모달 컴포넌트
// ============================================
function WaitListModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("WaitListModal");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError(t("invalidEmail"));
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          timestamp: new Date().toISOString(),
          source: "crowdians-cyber-farm",
        }),
      });

      // no-cors 모드에서는 응답을 읽을 수 없으므로, 요청이 성공한 것으로 간주
      setIsSuccess(true);
      sessionStorage.setItem("waitlist_acted", "true");
    } catch {
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.waitListModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {isSuccess ? (
          // 성공 상태
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <Check size={32} />
            </div>
            <div className={styles.successTitle}>{t("successTitle")}</div>
            <div className={styles.successMessage}>{t("successMessage")}</div>
          </div>
        ) : (
          // 입력 폼
          <>
            <div className={styles.iconArea}>
              <div className={styles.iconCircle}>
                <Sparkles size={28} />
              </div>
            </div>

            <h1 className={styles.title}>{t("title")}</h1>
            <p className={styles.subtitle}>{t("subtitle")}</p>

            <form className={styles.emailForm} onSubmit={handleSubmit}>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className={styles.emailInput}
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoFocus
                />
              </div>

              {error && <p className={styles.errorMessage}>{error}</p>}

              <Button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !email.trim()}
              >
                <Mail size={18} style={{ marginRight: "0.5rem" }} />
                {isSubmitting ? "..." : t("submit")}
              </Button>
            </form>

            <p className={styles.footerText}>{t("footer")}</p>
          </>
        )}
      </div>
    </div>
  );
}
