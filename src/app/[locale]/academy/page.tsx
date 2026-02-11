// @crowdians/src/app/[locale]/academy/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import {
  MOCK_KNOWLEDGE_CARDS,
  KnowledgeCard,
  INITIAL_ACADEMY_STATE,
} from "@/data/mockData";

type Phase = "intro" | "card" | "grading" | "feedback" | "complete" | "suspended";
type FeedbackKind = "correct" | "rejected" | "failed";

export default function AcademyPage() {
  const cards = MOCK_KNOWLEDGE_CARDS;

  // ── Core state ──
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [teachAnswer, setTeachAnswer] = useState("");
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);
  const [npcVisible, setNpcVisible] = useState(false);
  const [feedbackKind, setFeedbackKind] = useState<FeedbackKind>("correct");

  // ── Academy systems ──
  const [learningTickets, setLearningTickets] = useState(INITIAL_ACADEMY_STATE.learningTickets);
  const [questionsInTicket, setQuestionsInTicket] = useState(0);
  const [trustScore, setTrustScore] = useState(INITIAL_ACADEMY_STATE.trustScore);
  const [earnedGold, setEarnedGold] = useState(0);
  const [pendingExp, setPendingExp] = useState(0);
  const [rejectCount, setRejectCount] = useState(0);
  const [isLowEfficiency, setIsLowEfficiency] = useState(false);

  // ── Per-card feedback data ──
  const [lastGold, setLastGold] = useState(0);
  const [lastExp, setLastExp] = useState(0);
  const [lastTrustDelta, setLastTrustDelta] = useState(0);

  // NPC bounce-in
  useEffect(() => {
    const t = setTimeout(() => setNpcVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Auto-start from intro
  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => {
        if (trustScore < 30) {
          setPhase("suspended");
        } else {
          setPhase("card");
        }
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [phase, trustScore]);

  const currentCard: KnowledgeCard | undefined = cards[currentIndex];
  const questionsPerTicket = INITIAL_ACADEMY_STATE.questionsPerTicket;
  const maxTickets = INITIAL_ACADEMY_STATE.maxTickets;

  // Efficiency multiplier
  const efficiencyMult = isLowEfficiency ? 0.15 : 1.0;

  // ── Advance to next card or complete ──
  const advanceCard = useCallback(() => {
    setSelectedSide(null);
    setTeachAnswer("");

    const nextQ = questionsInTicket + 1;
    setQuestionsInTicket(nextQ);

    // Check ticket boundary
    if (nextQ >= questionsPerTicket) {
      const newTickets = learningTickets - 1;
      setLearningTickets(newTickets);
      setQuestionsInTicket(0);

      if (newTickets <= 0) {
        setIsLowEfficiency(true);
      }

      // Show complete screen after each ticket
      setPhase("complete");
      return;
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((i) => i + 1);
      setPhase("card");
    } else {
      setPhase("complete");
    }
  }, [questionsInTicket, questionsPerTicket, learningTickets, currentIndex, cards.length]);

  // ── Submit answer (Vote A/B or Teach) ──
  const handleSubmit = useCallback(
    (side?: "A" | "B") => {
      if (!currentCard) return;
      if (side) setSelectedSide(side);

      // Enter grading phase
      setPhase("grading");

      setTimeout(() => {
        // For teach: check minimum length
        if (currentCard.type === "teach" && teachAnswer.trim().length < 3) {
          const goldAmt = 0;
          const expAmt = 0;
          const trustDelta = -5;
          setLastGold(goldAmt);
          setLastExp(expAmt);
          setLastTrustDelta(trustDelta);
          setTrustScore((s) => Math.max(0, s + trustDelta));
          setFeedbackKind("failed");
          setPhase("feedback");

          setTimeout(() => advanceCard(), 2000);
          return;
        }

        // Normal grading pass
        const baseGold = Math.floor(currentCard.expReward * 0.3);
        const baseExp = currentCard.expReward;
        const goldAmt = Math.floor(baseGold * efficiencyMult);
        const expAmt = Math.floor(baseExp * efficiencyMult);
        const trustDelta = 3;

        setLastGold(goldAmt);
        setLastExp(expAmt);
        setLastTrustDelta(trustDelta);
        setEarnedGold((g) => g + goldAmt);
        setPendingExp((e) => e + expAmt);
        setTrustScore((s) => Math.min(100, s + trustDelta));
        setFeedbackKind("correct");
        setPhase("feedback");

        setTimeout(() => advanceCard(), 2000);
      }, 3000); // 3s grading delay
    },
    [currentCard, teachAnswer, efficiencyMult, advanceCard]
  );

  // ── Reject (둘 다 별로예요) ──
  const handleReject = useCallback(() => {
    if (!currentCard) return;

    setPhase("grading");

    setTimeout(() => {
      const goldAmt = Math.floor(10 * efficiencyMult);
      const trustDelta = 2;

      setLastGold(goldAmt);
      setLastExp(0);
      setLastTrustDelta(trustDelta);
      setEarnedGold((g) => g + goldAmt);
      setRejectCount((c) => c + 1);
      setTrustScore((s) => Math.min(100, s + trustDelta));
      setFeedbackKind("rejected");
      setPhase("feedback");

      setTimeout(() => advanceCard(), 2200);
    }, 2000); // shorter grading for reject
  }, [currentCard, efficiencyMult, advanceCard]);

  // ── Pass (teach) ──
  const handlePass = useCallback(() => {
    setTeachAnswer("");
    advanceCard();
  }, [advanceCard]);

  // ── Continue studying ──
  const handleContinue = useCallback(() => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((i) => i + 1);
      setQuestionsInTicket(0);
      setPhase("card");
    } else {
      // Reset for demo
      setCurrentIndex(0);
      setQuestionsInTicket(0);
      setPhase("card");
    }
  }, [currentIndex, cards.length]);

  // ── Full restart ──
  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setEarnedGold(0);
    setPendingExp(0);
    setRejectCount(0);
    setQuestionsInTicket(0);
    setLearningTickets(INITIAL_ACADEMY_STATE.learningTickets);
    setIsLowEfficiency(false);
    setTrustScore(INITIAL_ACADEMY_STATE.trustScore);
    setPhase("intro");
    setTeachAnswer("");
    setSelectedSide(null);
  }, []);

  // ── NPC speech helper ──
  const getNpcSpeech = () => {
    if (phase === "intro") return "자, 수업을 시작하자!";
    if (phase === "suspended") return "정학 처분 중이야... 신뢰도를 회복해야 해.";
    if (phase === "grading") return "🔍 채점 중... 잠깐만 기다려!";
    if (phase === "feedback") {
      if (feedbackKind === "rejected") return "역시 예리하군! 쓰레기 데이터를 걸러냈어. 👏";
      if (feedbackKind === "failed") return "이건 좀... 다시 생각해봐. 😅";
      return "오! 훌륭한 식견이야! 👏";
    }
    if (phase === "complete") return isLowEfficiency
      ? "뇌가 과부하 걸렸어... 보상이 줄어들고 있어."
      : "오늘의 수업을 끝냈어! 대단해!";
    if (phase === "card" && currentCard) {
      return currentCard.type === "vote"
        ? "두 답변 중 더 나은 것을 골라봐!"
        : "네 생각을 직접 알려줘!";
    }
    return "";
  };

  // Trust score color
  const trustColor = trustScore >= 70 ? "#9bbc0f" : trustScore >= 30 ? "#ffd700" : "#ff2a6d";

  return (
    <div className={styles.board}>
      {/* ── HUD Bar ── */}
      <div className={styles.hudBar}>
        <div className={styles.hudLeft}>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>🎟️</span>
            <span className={styles.hudLabel}>학습권</span>
            <span className={styles.hudValue}>{learningTickets}/{maxTickets}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>🧠</span>
            <span className={styles.hudLabel}>뇌 충전</span>
            <div className={styles.brainBar}>
              <div
                className={styles.brainBarFill}
                style={{
                  width: `${((questionsPerTicket - questionsInTicket) / questionsPerTicket) * 100}%`,
                }}
              />
            </div>
            <span className={styles.hudValue}>
              {questionsPerTicket - questionsInTicket}/{questionsPerTicket}
            </span>
          </div>
        </div>
        <div className={styles.hudRight}>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>🛡️</span>
            <span className={styles.hudLabel}>신뢰도</span>
            <span className={styles.trustValue} style={{ color: trustColor }}>
              {trustScore}
            </span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>💰</span>
            <span className={styles.goldValue}>{earnedGold} G</span>
          </div>
        </div>
      </div>

      {/* Low efficiency banner */}
      {isLowEfficiency && phase !== "complete" && (
        <div className={styles.lowEffBanner}>
          ⚠️ 자율 학습 모드 — 보상이 15%로 감소합니다
        </div>
      )}

      {/* ── NPC Section ── */}
      <div
        className={`${styles.npcSection} ${npcVisible ? styles.npcVisible : ""}`}
      >
        <div className={styles.npcAvatar}>
          <Image
            src="/Crowdy/Prof_Bit.png"
            alt="닥터 비트"
            width={140}
            height={140}
            unoptimized
            priority
          />
        </div>
        <div className={styles.speechBubble}>
          <span className={styles.npcName}>닥터 비트</span>
          <p className={styles.speechText}>{getNpcSpeech()}</p>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      {phase !== "complete" && phase !== "suspended" && (
        <div className={styles.progressWrapper}>
          <div className={styles.progressInfo}>
            <span>
              {currentIndex + 1} / {cards.length}
            </span>
            <span className={styles.expBadge}>📋 EXP +{pendingExp} (대기)</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((currentIndex + (phase === "feedback" || phase === "grading" ? 1 : 0)) / cards.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ── Card Stack ── */}
      {(phase === "card" || phase === "feedback" || phase === "grading") && currentCard && (
        <div className={styles.cardStack}>
          {cards.length - currentIndex > 1 && (
            <div className={`${styles.ghostCard} ${styles.ghost2}`} />
          )}
          {cards.length - currentIndex > 2 && (
            <div className={`${styles.ghostCard} ${styles.ghost3}`} />
          )}

          <div
            className={`${styles.knowledgeCard} ${
              phase === "feedback" || phase === "grading" ? styles.cardDone : ""
            }`}
          >
            <div className={styles.cardHeader}>
              <span className={styles.categoryTag}>{currentCard.category}</span>
              <span className={styles.rewardTag}>
                +{Math.floor(currentCard.expReward * efficiencyMult)} EXP
                {isLowEfficiency && <span className={styles.effNote}> (15%)</span>}
              </span>
            </div>

            <h2 className={styles.questionText}>{currentCard.question}</h2>

            {/* ── Vote UI (3-Way) ── */}
            {currentCard.type === "vote" && phase === "card" && (
              <div className={styles.voteSection}>
                <button
                  className={`${styles.voteBtn} ${styles.voteBtnA}`}
                  onClick={() => handleSubmit("A")}
                >
                  <span className={styles.voteLabelBadge}>A</span>
                  <p>{currentCard.answerA}</p>
                </button>
                <span className={styles.vsLabel}>VS</span>
                <button
                  className={`${styles.voteBtn} ${styles.voteBtnB}`}
                  onClick={() => handleSubmit("B")}
                >
                  <span className={styles.voteLabelBadge}>B</span>
                  <p>{currentCard.answerB}</p>
                </button>

                {/* Reject button */}
                <button
                  className={styles.rejectBtn}
                  onClick={handleReject}
                >
                  <span className={styles.rejectEmoji}>🙅</span>
                  <span>둘 다 별로예요</span>
                </button>
              </div>
            )}

            {/* ── Teach UI ── */}
            {currentCard.type === "teach" && phase === "card" && (
              <div className={styles.teachSection}>
                {currentCard.hint && (
                  <p className={styles.hintText}>💡 {currentCard.hint}</p>
                )}
                <textarea
                  className={styles.teachTextarea}
                  placeholder="여기에 답변을 작성해주세요..."
                  value={teachAnswer}
                  onChange={(e) => setTeachAnswer(e.target.value)}
                  rows={4}
                />
                <div className={styles.teachActions}>
                  <button className={styles.passBtn} onClick={handlePass}>
                    모름 / 패스
                  </button>
                  <button
                    className={styles.submitBtn}
                    onClick={() => handleSubmit()}
                    disabled={teachAnswer.trim().length === 0}
                  >
                    제출하기
                  </button>
                </div>
              </div>
            )}

            {/* ── Grading Overlay ── */}
            {phase === "grading" && (
              <div className={styles.gradingOverlay}>
                <div className={styles.gradingIcon}>🔍</div>
                <p className={styles.gradingText}>닥터 비트가 채점 중...</p>
                <div className={styles.gradingDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}

            {/* ── Feedback Overlay ── */}
            {phase === "feedback" && (
              <div className={styles.feedbackOverlay}>
                {feedbackKind === "correct" && (
                  <>
                    <div className={styles.feedbackCircle}>⭕</div>
                    <p className={styles.feedbackGold}>💰 +{lastGold} Gold (활동비)</p>
                    <p className={styles.feedbackPending}>📋 +{lastExp} EXP 채점 후 지급</p>
                    <p className={styles.feedbackTrust}>🛡️ 신뢰도 +{lastTrustDelta}</p>
                  </>
                )}
                {feedbackKind === "rejected" && (
                  <>
                    <div className={styles.feedbackRejectAnim}>🗑️</div>
                    <p className={styles.feedbackGold}>💰 +{lastGold} Gold (기각 보너스)</p>
                    <p className={styles.feedbackTrust}>🛡️ 신뢰도 +{lastTrustDelta}</p>
                  </>
                )}
                {feedbackKind === "failed" && (
                  <>
                    <div className={styles.feedbackCircle}>❌</div>
                    <p className={styles.feedbackFailed}>
                      채점 불합격 — 답변이 너무 짧아요
                    </p>
                    <p className={styles.feedbackTrustDown}>🛡️ 신뢰도 {lastTrustDelta}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Suspended Screen ── */}
      {phase === "suspended" && (
        <div className={styles.suspendedSection}>
          <div className={styles.suspendedCard}>
            <div className={styles.suspendedEmoji}>🚫</div>
            <h2 className={styles.suspendedTitle}>정학 처분</h2>
            <p className={styles.suspendedDesc}>
              신뢰도가 30 미만이라 아카데미에 입장할 수 없습니다.<br/>
              다른 활동으로 신뢰도를 회복해주세요.
            </p>
            <div className={styles.suspendedTrust}>
              🛡️ 현재 신뢰도: <span style={{ color: "#ff2a6d" }}>{trustScore}</span>
            </div>
            <Link href="/adventure" className={styles.adventureLink}>
              ⚔️ 모험하러 가기
            </Link>
          </div>
        </div>
      )}

      {/* ── Complete Screen ── */}
      {phase === "complete" && (
        <div className={styles.completeSection}>
          <div className={styles.completeCard}>
            <div className={styles.completeEmoji}>🎉</div>
            <h2 className={styles.completeTitle}>
              {isLowEfficiency ? "자율 학습 완료!" : "수업 완료!"}
            </h2>

            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>즉시 보상 (활동비)</span>
              <span className={styles.completeGold}>💰 {earnedGold} Gold</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>채점 대기 (경험치)</span>
              <span className={styles.completePending}>📋 {pendingExp} EXP</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>기각 카드</span>
              <span className={styles.completeReject}>🗑️ {rejectCount}건</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>신뢰도</span>
              <span className={styles.completeTrust} style={{ color: trustColor }}>
                🛡️ {trustScore}
              </span>
            </div>

            <p className={styles.completeMsg}>
              {isLowEfficiency
                ? "💤 뇌가 과부하 걸렸어. 보상이 줄어들고 있어..."
                : "닥터 비트가 채점을 끝내면 EXP를 우편함으로 보내줄게!"}
            </p>

            <div className={styles.completeBtns}>
              {!isLowEfficiency && learningTickets > 0 ? (
                <button className={styles.continueBtn} onClick={handleContinue}>
                  🔥 아직 뇌가 쌩쌩해! 다음 수업 듣기
                </button>
              ) : (
                <Link href="/adventure" className={styles.adventureBtn}>
                  💤 뇌가 과부하야. 모험이나 갈까?
                </Link>
              )}
              <button className={styles.restartBtn} onClick={handleRestart}>
                🔄 처음부터 다시하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
