// @crowdians/src/app/[locale]/academy/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";
import {
  MOCK_KNOWLEDGE_CARDS,
  KnowledgeCard,
  INITIAL_ACADEMY_STATE,
} from "@/data/mockData";

type Phase = "intro" | "card" | "grading" | "feedback" | "complete" | "suspended";
type FeedbackKind = "correct" | "rejected" | "failed";

export default function AcademyPage() {
  const t = useTranslations("Academy");
  const tData = useTranslations("MockData");
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
      const timer = setTimeout(() => {
        if (trustScore < 30) {
          setPhase("suspended");
        } else {
          setPhase("card");
        }
      }, 2400);
      return () => clearTimeout(timer);
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
    if (phase === "intro") return t("npc.intro");
    if (phase === "suspended") return t("npc.suspended");
    if (phase === "grading") return t("npc.grading");
    if (phase === "feedback") {
      if (feedbackKind === "rejected") return t("npc.feedbackRejected");
      if (feedbackKind === "failed") return t("npc.feedbackFailed");
      return t("npc.feedbackCorrect");
    }
    if (phase === "complete") return isLowEfficiency
      ? t("npc.completeLowEff")
      : t("npc.completeNormal");
    if (phase === "card" && currentCard) {
      return currentCard.type === "vote"
        ? t("npc.votePrompt")
        : t("npc.teachPrompt");
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
            <span className={styles.hudLabel}>{t("hud.learningTicket")}</span>
            <span className={styles.hudValue}>{learningTickets}/{maxTickets}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudIcon}>🧠</span>
            <span className={styles.hudLabel}>{t("hud.brainCharge")}</span>
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
            <span className={styles.hudLabel}>{t("hud.trust")}</span>
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
          {t("hud.lowEffBanner")}
        </div>
      )}

      {/* ── NPC Section ── */}
      <div
        className={`${styles.npcSection} ${npcVisible ? styles.npcVisible : ""}`}
      >
        <div className={styles.npcAvatar}>
          <Image
            src="/Crowdy/Prof_Bit.png"
            alt={t("npc.name")}
            width={140}
            height={140}
            unoptimized
            priority
          />
        </div>
        <div className={styles.speechBubble}>
          <span className={styles.npcName}>{t("npc.name")}</span>
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
            <span className={styles.expBadge}>{t("progress.expPending", { exp: pendingExp })}</span>
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
              <span className={styles.categoryTag}>{tData(currentCard.categoryKey)}</span>
              <span className={styles.rewardTag}>
                +{Math.floor(currentCard.expReward * efficiencyMult)} EXP
                {isLowEfficiency && <span className={styles.effNote}> (15%)</span>}
              </span>
            </div>

            <h2 className={styles.questionText}>{tData(currentCard.questionKey)}</h2>

            {/* ── Vote UI (3-Way) ── */}
            {currentCard.type === "vote" && phase === "card" && (
              <div className={styles.voteSection}>
                <button
                  className={`${styles.voteBtn} ${styles.voteBtnA}`}
                  onClick={() => handleSubmit("A")}
                >
                  <span className={styles.voteLabelBadge}>A</span>
                  <p>{currentCard.answerAKey && tData(currentCard.answerAKey)}</p>
                </button>
                <span className={styles.vsLabel}>VS</span>
                <button
                  className={`${styles.voteBtn} ${styles.voteBtnB}`}
                  onClick={() => handleSubmit("B")}
                >
                  <span className={styles.voteLabelBadge}>B</span>
                  <p>{currentCard.answerBKey && tData(currentCard.answerBKey)}</p>
                </button>

                {/* Reject button */}
                <button
                  className={styles.rejectBtn}
                  onClick={handleReject}
                >
                  <span className={styles.rejectEmoji}>🙅</span>
                  <span>{t("card.rejectBoth")}</span>
                </button>
              </div>
            )}

            {/* ── Teach UI ── */}
            {currentCard.type === "teach" && phase === "card" && (
              <div className={styles.teachSection}>
                {currentCard.hintKey && (
                  <p className={styles.hintText}>💡 {tData(currentCard.hintKey)}</p>
                )}
                <textarea
                  className={styles.teachTextarea}
                  placeholder={t("card.teachPlaceholder")}
                  value={teachAnswer}
                  onChange={(e) => setTeachAnswer(e.target.value)}
                  rows={4}
                />
                <div className={styles.teachActions}>
                  <button className={styles.passBtn} onClick={handlePass}>
                    {t("card.pass")}
                  </button>
                  <button
                    className={styles.submitBtn}
                    onClick={() => handleSubmit()}
                    disabled={teachAnswer.trim().length === 0}
                  >
                    {t("card.submit")}
                  </button>
                </div>
              </div>
            )}

            {/* ── Grading Overlay ── */}
            {phase === "grading" && (
              <div className={styles.gradingOverlay}>
                <div className={styles.gradingIcon}>🔍</div>
                <p className={styles.gradingText}>{t("card.gradingText")}</p>
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
                    <p className={styles.feedbackGold}>{t("feedback.goldActivity", { gold: lastGold })}</p>
                    <p className={styles.feedbackPending}>{t("feedback.expPending", { exp: lastExp })}</p>
                    <p className={styles.feedbackTrust}>{t("feedback.trustUp", { delta: lastTrustDelta })}</p>
                  </>
                )}
                {feedbackKind === "rejected" && (
                  <>
                    <div className={styles.feedbackRejectAnim}>🗑️</div>
                    <p className={styles.feedbackGold}>{t("feedback.goldReject", { gold: lastGold })}</p>
                    <p className={styles.feedbackTrust}>{t("feedback.trustUp", { delta: lastTrustDelta })}</p>
                  </>
                )}
                {feedbackKind === "failed" && (
                  <>
                    <div className={styles.feedbackCircle}>❌</div>
                    <p className={styles.feedbackFailed}>
                      {t("feedback.failedMsg")}
                    </p>
                    <p className={styles.feedbackTrustDown}>{t("feedback.trustDown", { delta: lastTrustDelta })}</p>
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
            <h2 className={styles.suspendedTitle}>{t("suspended.title")}</h2>
            <p className={styles.suspendedDesc}>
              {t("suspended.desc")}
            </p>
            <div className={styles.suspendedTrust}>
              {t("suspended.currentTrust")} <span style={{ color: "#ff2a6d" }}>{trustScore}</span>
            </div>
            <Link href="/adventure" className={styles.adventureLink}>
              {t("suspended.goAdventure")}
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
              {isLowEfficiency ? t("complete.titleLowEff") : t("complete.titleNormal")}
            </h2>

            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>{t("complete.instantReward")}</span>
              <span className={styles.completeGold}>💰 {earnedGold} Gold</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>{t("complete.pendingReward")}</span>
              <span className={styles.completePending}>📋 {pendingExp} EXP</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>{t("complete.rejectedCards")}</span>
              <span className={styles.completeReject}>{t("complete.rejectedCount", { count: rejectCount })}</span>
            </div>
            <div className={styles.completeStat}>
              <span className={styles.completeLabel}>{t("complete.trust")}</span>
              <span className={styles.completeTrust} style={{ color: trustColor }}>
                🛡️ {trustScore}
              </span>
            </div>

            <p className={styles.completeMsg}>
              {isLowEfficiency
                ? t("complete.msgLowEff")
                : t("complete.msgNormal")}
            </p>

            <div className={styles.completeBtns}>
              {!isLowEfficiency && learningTickets > 0 ? (
                <button className={styles.continueBtn} onClick={handleContinue}>
                  {t("complete.continueBtn")}
                </button>
              ) : (
                <Link href="/adventure" className={styles.adventureBtn}>
                  {t("complete.exhaustedBtn")}
                </Link>
              )}
              <button className={styles.restartBtn} onClick={handleRestart}>
                {t("complete.restartBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
