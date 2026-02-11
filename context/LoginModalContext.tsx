"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import styles from "./loginModal.module.scss";
import { Button } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

type ModalContextType = {
  isOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openLoginModal, closeLoginModal }}>
      {children}
      {/* 여기에 모달 컴포넌트를 직접 렌더링합니다 */}
      {isOpen && <LoginModal onClose={closeLoginModal} />}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
}

// 간단한 모달 컴포넌트 예시 (별도 파일로 분리 추천)
function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const t = useTranslations("LoginModal");
  const provider = new GoogleAuthProvider();

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();

  //   try {
  //     // 1. 구글 팝업 띄우기 (인증 시작)
      
  //     const user = result.user;
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const accessToken = credential?.accessToken;

  //     console.log("🔥 Firebase Auth 성공:", user.uid);
  //     console.log("google login result", result);
  //     console.log("google login credential", credential);

  //     // 2. Firestore에서 유저 정보 조회 (이미 가입된 유저인지 확인)
  //     const userRef = doc(db, "users", user.uid);
  //     const userSnap = await getDoc(userRef);

  //     if (userSnap.exists()) {
  //       // 🅰️ [기존 유저] -> 정보 업데이트 후 메인으로 이동
  //       console.log("✅ 이미 가입된 유저입니다. 로그인 처리합니다.");

  //       await updateDoc(userRef, {
  //         lastLoginAt: serverTimestamp(), // 마지막 접속 시간 갱신
  //       });

  //       router.push("/");
  //     } else {
  //       // 🅱️ [신규 유저] -> DB에 초기 데이터 저장(회원가입) 후 이동
  //       console.log("🎉 신규 유저입니다. 회원가입을 진행합니다.");

  //       // 우리가 설계했던 스키마대로 초기 데이터 생성
  //       const newUser = {
  //         uid: user.uid,
  //         email: user.email,
  //         nickname: user.displayName || "이름없음",

  //         // 🎮 게임 초기 스탯 설정
  //         stats: {
  //           level: 1,
  //           exp: 0,
  //           maxExp: 100,
  //           points: 0, // 초기 자금 (0원부터 시작)
  //           stamina: 20,
  //           maxStamina: 20,
  //         },

  //         // 캐릭터 정보
  //         character: {
  //           id: "char_default",
  //           evolutionStage: 0,
  //           name: "알",
  //         },

  //         role: "user",
  //         createdAt: serverTimestamp(),
  //         lastLoginAt: serverTimestamp(),
  //       };

  //       // Firestore에 저장 (회원가입 완료)
  //       await setDoc(userRef, newUser);

  //       router.push("/");
  //     }
  //   } catch (error) {
  //     console.error("❌ 로그인 실패:", error);
  //     // 에러 발생 시 사용자에게 토스트 메시지 등을 띄워주면 좋습니다.
  //   }
  // };

  return (
    <div className={styles.loginModal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h1
          style={{
            fontFamily: "DungGeunMo",
            fontSize: "2rem",
            marginBottom: "0.8rem",
          }}
        >
          Crowdians
        </h1>
        <h2
          style={{
            fontFamily: "Galmuri14",
            fontSize: "1rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {t("subtitle")}
        </h2>
        {/* Google Login */}
        <div className={styles.loginButtons}>
          <Button className={styles.googleLogin} onClick={() => {alert('Coming Soon')}}>
            <svg width="24" height="20" viewBox="0 0 20 20">
              <path
                fill="#4285F4"
                d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
              />
              <path
                fill="#34A853"
                d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
              />
              <path
                fill="#FBBC05"
                d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
              />
              <path
                fill="#EA4335"
                d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
              />
            </svg>
            <span>{t("googleLogin")}</span>
          </Button>
          {/* Kakao Login */}
          <Button className={styles.kakaoLogin} onClick={() => {alert('Coming Soon')}}>
            <svg width="24" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 3C5.589 3 2 5.906 2 9.5c0 2.387 1.588 4.488 4.009 5.664-.157.565-.978 3.532-1.119 4.026-.166.591.216.583.456.423.191-.128 3.103-2.047 4.24-2.796.471.064.954.097 1.414.097 4.411 0 8-2.906 8-6.5S14.411 3 10 3z"
                fill="#3C1E1E"
              />
            </svg>
            <span>{t("kakaoLogin")}</span>
          </Button>

          {/* Naver Login */}
          <Button className={styles.naverLogin} onClick={() => {alert('Coming Soon')}}>
            <svg width="24" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M13.6 10.8L6.4 2H2v16h6.4V9.2L15.6 18H20V2h-6.4v8.8z" />
            </svg>
            <span>{t("naverLogin")}</span>
          </Button>
        </div>
        <p
          style={{ fontSize: "0.8rem", textAlign: "center", color: "#D8D8D8" }}
        >
          {t("termsAndPrivacy")}
        </p>
      </div>
    </div>
  );
}
