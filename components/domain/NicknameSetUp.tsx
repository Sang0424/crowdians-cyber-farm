"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./NicknameSetUp.module.scss";

export function NicknameSetup() {
  const [isVisible, setIsVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // useEffect(() => {
  //   // 1. 로그인 상태 감지
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUserId(user.uid);
  //       // 2. Firestore에서 '온보딩 여부' 확인
  //       const userRef = doc(db, "users", user.uid);
  //       const userSnap = await getDoc(userRef);

  //       if (userSnap.exists()) {
  //         const userData = userSnap.data();
  //         // 🚩 아직 설정 안 했으면 팝업 띄움!
  //         if (userData.isOnboardingDone === false) {
  //           setNickname(userData.nickname || ""); // 기존 구글 이름 넣어주기
  //           setIsVisible(true);
  //         }
  //       }
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!userId || !nickname.trim()) return;

  //   setLoading(true);
  //   try {
  //     // 3. 닉네임 저장 & 온보딩 완료 처리
  //     const userRef = doc(db, "users", userId);
  //     await updateDoc(userRef, {
  //       nickname: nickname.trim(),
  //       isOnboardingDone: true, // ✅ 이제 팝업 안 뜸
  //     });

  //     setIsVisible(false); // 팝업 닫기
  //     alert(`반가워요, ${nickname}님! 모험을 시작합니다.`);
  //   } catch (error) {
  //     console.error("닉네임 저장 실패:", error);
  //     alert("저장에 실패했습니다.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!isVisible) return null; // 설정 완료된 유저는 아무것도 안 보임

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>신분증 발급</h2>
        <p className={styles.desc}>
          Crowdians 세계에서 사용할
          <br />
          멋진 이름을 지어주세요!
        </p>

        <form onSubmit={() => {}} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력 (2~10자)"
              maxLength={10}
              className={styles.input}
              autoFocus
            />
            <span className={styles.count}>{nickname.length}/10</span>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "발급 중..." : "모험 시작하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
