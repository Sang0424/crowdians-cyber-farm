"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { MessageInput } from "@/../components/domain/MessageInput";
import { Link } from "../../../../i18n";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageCircle,
  X,
  Siren,
  ThumbsDown,
  AlertTriangle,
  Trash2,
  Mail,
  Brain,
  Sword,
  Heart,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useUserStore } from "../../../../store/useUserStore";
import ActionModal from "@/../components/domain/ActionModal";

// ── Types ──
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Report reasons
const REPORT_REASONS = [
  "profanity",
  "sexual",
  "misinformation",
  "other",
] as const;
type ReportReason = (typeof REPORT_REASONS)[number];

// Character interaction phrases
const PET_RESPONSES = [
  "나도 좋아! 💕",
  "헤헤~ 기분 좋다!",
  "고마워! 너랑 있으면 즐거워~",
  "와! 쓰담쓰담 좋아~ 🥰",
  "더 해줘! 더!",
  "우리 사이가 더 가까워진 느낌이야!",
  "너 때문에 오늘 하루가 행복해~",
  "으음~ 좋아좋아! ✨",
];

let msgIdCounter = 0;
function newMsgId() {
  msgIdCounter += 1;
  return `msg_${Date.now()}_${msgIdCounter}`;
}

// ══════════════════════════════════════
export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // SOS Modal state
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosTargetId, setSosTargetId] = useState<string | null>(null);

  // RLHF Modal state
  const [rlhfModalOpen, setRlhfModalOpen] = useState(false);
  const [rlhfTargetId, setRlhfTargetId] = useState<string | null>(null);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<ReportReason | null>(null);
  const [reportConfirmStep, setReportConfirmStep] = useState(false);

  // Reset Modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Mailbox Modal state
  const [mailboxOpen, setMailboxOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState<string | null>(null);

  // Stamina exhausted feedback
  const [staminaWarning, setStaminaWarning] = useState(false);

  // Heart effect on character click
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const heartIdRef = useRef(0);

  // Daily pet limit
  const [dailyPetCount, setDailyPetCount] = useState(0);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  // ── Store ──
  const {
    user,
    initializeDefaultUser,
    consumeStamina,
    addChatExp,
    addIntimacy,
    addGold,
  } = useUserStore();

  // Initialize default user if not logged in
  useEffect(() => {
    initializeDefaultUser();
  }, [initializeDefaultUser]);

  const stats = user?.stats;

  // Auto-scroll chat area
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Auto-scroll log overlay
  useEffect(() => {
    if (logScrollRef.current && showLog) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [messages, showLog]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Spawn heart particles
  const spawnHearts = useCallback(() => {
    const newHearts = Array.from({ length: 3 }, () => {
      heartIdRef.current += 1;
      return {
        id: heartIdRef.current,
        x: Math.random() * 40 - 20,
        y: Math.random() * -20,
      };
    });
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)),
      );
    }, 1000);
  }, []);

  // ── Send message ──
  const handleSend = useCallback(
    (text: string) => {
      // Stamina check
      const canSend = consumeStamina(1);
      if (!canSend) {
        setStaminaWarning(true);
        setTimeout(() => setStaminaWarning(false), 3000);
        return;
      }

      // Chat EXP (daily cap 50) & Intimacy
      addChatExp(2);
      addIntimacy(1);

      const userMsg: ChatMessage = {
        id: newMsgId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Simulate AI typing
      setIsTyping(true);
      const delay = 1000 + Math.random() * 2000;

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * 10);
        const aiText = t(`Chat.aiResponses.${randomIndex}`);

        const aiMsg: ChatMessage = {
          id: newMsgId(),
          role: "assistant",
          content: aiText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, delay);
    },
    [t, consumeStamina, addChatExp, addIntimacy],
  );

  // ── Toggle log overlay ──
  const toggleLog = () => {
    setShowLog((prev) => !prev);
  };

  // ── SOS ──
  const handleSOSClick = (msgId: string) => {
    if (!stats || stats.points < 30) {
      setToast(t("Chat.sos.failMsg"));
      return;
    }
    setSosTargetId(msgId);
    setSosModalOpen(true);
  };

  const confirmSOS = () => {
    if (stats && stats.points >= 30) {
      addGold(-30);
      setSosModalOpen(false);
      setSosTargetId(null);
      setToast(t("Chat.sos.successMsg"));
    }
  };

  // ── RLHF (thumbs down) ──
  const handleRLHFClick = (msgId: string) => {
    setRlhfTargetId(msgId);
    setRlhfModalOpen(true);
  };

  const confirmRLHF = () => {
    // TODO: Send context (user question + AI answer) to Academy Teach DB
    setRlhfModalOpen(false);
    setRlhfTargetId(null);
    setToast(t("Chat.rlhf.successMsg"));
  };

  // ── Report ──
  const handleReportClick = (msgId: string) => {
    setReportTargetId(msgId);
    setReportReason(null);
    setReportConfirmStep(false);
    setReportModalOpen(true);
  };

  const handleReportReasonSelect = (reason: ReportReason) => {
    setReportReason(reason);
    setReportConfirmStep(true);
  };

  const confirmReport = () => {
    // TODO: Send to admin review queue
    setReportModalOpen(false);
    setReportTargetId(null);
    setReportReason(null);
    setReportConfirmStep(false);
    setToast(t("Chat.report.successMsg"));
  };

  // ── Reset chat ──
  const handleResetClick = () => {
    if (messages.length === 0) {
      setToast(t("Chat.reset.failMsg"));
      return;
    }
    setResetModalOpen(true);
  };

  const confirmReset = () => {
    setMessages([]);
    setResetModalOpen(false);
    setToast(t("Chat.reset.successMsg"));
  };

  // ── Computed values ──
  const level = stats?.level ?? 1;
  const exp = stats?.exp ?? 0;
  const maxExp = stats?.maxExp ?? 100;
  const stamina = stats?.stamina ?? 20;
  const maxStamina = stats?.maxStamina ?? 20;
  const intelligence = stats?.intelligence ?? 0;
  const courage = stats?.courage ?? 0;
  const intimacy = stats?.intimacy ?? 0;
  const expPercent = maxExp > 0 ? (exp / maxExp) * 100 : 0;
  const staminaPercent = maxStamina > 0 ? (stamina / maxStamina) * 100 : 0;

  // ── Character pet interaction ──
  const handleCharacterClick = useCallback(() => {
    if (dailyPetCount >= 30) {
      setToast("오늘은 더 이상 쓰다듬을 수 없어요! (30/30)");
      return;
    }
    addIntimacy(1);
    setDailyPetCount((prev) => prev + 1);
    spawnHearts();

    // Add pet response to chat log
    const phrase =
      PET_RESPONSES[Math.floor(Math.random() * PET_RESPONSES.length)];
    const petMsg: ChatMessage = {
      id: newMsgId(),
      role: "assistant",
      content: phrase,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, petMsg]);
  }, [addIntimacy, dailyPetCount, spawnHearts]);

  // ── Delete individual message ──
  const handleDeleteClick = (msgId: string) => {
    setDeleteTargetId(msgId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setMessages((prev) => prev.filter((m) => m.id !== deleteTargetId));
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setToast(t("Chat.delete.successMsg"));
    }
  };

  // ── Render chat message bubble ──
  const renderChatBubble = (msg: ChatMessage) => (
    <div
      key={msg.id}
      className={`${styles.chatMsg} ${msg.role === "user" ? styles.chatMsgUser : styles.chatMsgAi}`}
    >
      {msg.role === "assistant" && (
        <div className={styles.chatAvatar}>
          <Image
            src="/Crowdy/GEOS.gif"
            alt="Crowdy"
            width={32}
            height={32}
            unoptimized
          />
        </div>
      )}
      <div className={styles.chatBubble}>
        {msg.role === "assistant" && (
          <span className={styles.chatSender}>{t("Chat.crowdy")}</span>
        )}
        <p className={styles.chatText}>{msg.content}</p>
        <span className={styles.chatTime}>
          {msg.timestamp.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {msg.role === "assistant" && (
          <div className={styles.bubbleActions}>
            <button
              className={`${styles.actionBtn} ${styles.rlhfBtn}`}
              onClick={() => handleRLHFClick(msg.id)}
              title={t("Chat.rlhf.button")}
            >
              <ThumbsDown size={14} />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.reportBtn}`}
              onClick={() => handleReportClick(msg.id)}
              title={t("Chat.report.button")}
            >
              <AlertTriangle size={14} />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.sosBtn}`}
              onClick={() => handleSOSClick(msg.id)}
              title={t("Chat.sos.button")}
            >
              <Siren size={14} />
              <span style={{ fontSize: 10, marginLeft: 3 }}>SOS</span>
            </button>
          </div>
        )}
      </div>
      {/* Delete button */}
      <button
        className={styles.msgDeleteBtn}
        onClick={() => handleDeleteClick(msg.id)}
        title="삭제"
      >
        <XCircle size={14} />
      </button>
    </div>
  );

  // ── Typing indicator ──
  const renderTypingIndicator = () => (
    <div className={`${styles.chatMsg} ${styles.chatMsgAi}`}>
      <div className={styles.chatAvatar}>
        <Image
          src="/Crowdy/GEOS.gif"
          alt="Crowdy"
          width={32}
          height={32}
          unoptimized
        />
      </div>
      <div className={styles.chatBubble}>
        <span className={styles.chatSender}>{t("Chat.crowdy")}</span>
        <div className={styles.typingDotsSmall}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* ── 헤더 ── */}
      <div className={styles.headerGrid}>
        <h1 className={styles.title}>Crowdians</h1>
        <header className={styles.contentHeader}>
          {/* Interactive Character */}
          <div
            className={styles.characterWrapper}
            ref={characterRef}
            onClick={handleCharacterClick}
          >
            <Image
              src="/Crowdy/GEOS.gif"
              alt="GEOS"
              width={80}
              height={80}
              unoptimized={true}
              className={styles.character}
            />
            {/* Heart particles */}
            {hearts.map((h) => (
              <span
                key={h.id}
                className={styles.heartParticle}
                style={{ left: `calc(50% + ${h.x}px)`, top: `${h.y}px` }}
              >
                ❤️
              </span>
            ))}
          </div>

          <div className={styles.statusContainer}>
            <div className={styles.levelSection}>
              <div className={styles.levelInfo}>
                <div className={styles.level}>Lv.{level}</div>
                <div className={styles.expBar}>
                  <div
                    className={styles.expProgress}
                    style={{ width: `${expPercent}%` }}
                  />
                </div>
                <div className={styles.expText}>
                  {exp}/{maxExp} EXP
                </div>
              </div>
              <div className={styles.fatigueInfo}>
                <div className={styles.fatigueLabel}>{t("Chat.fatigue")}</div>
                <div className={styles.fatigueBar}>
                  <div
                    className={styles.fatigueProgress}
                    style={{ width: `${staminaPercent}%` }}
                  />
                </div>
                <div className={styles.fatigueText}>
                  {stamina}/{maxStamina}
                </div>
              </div>
            </div>
            {/* Stats badges */}
            <div className={styles.statBadges}>
              <div className={styles.statBadge}>
                <Brain size={14} />
                <span>{intelligence}</span>
                <div className={styles.statTooltip}>
                  <strong>지능</strong>
                  <p>퀴즈와 학습으로 올라요</p>
                </div>
              </div>
              <div className={styles.statBadge}>
                <Sword size={14} />
                <span>{courage}</span>
                <div className={styles.statTooltip}>
                  <strong>용기</strong>
                  <p>모험에서 도전하면 올라요</p>
                </div>
              </div>
              <div className={styles.statBadge}>
                <Heart size={14} />
                <span>{intimacy}</span>
                <div className={styles.statTooltip}>
                  <strong>친밀도</strong>
                  <p>캐릭터와 대화하면 올라요</p>
                </div>
              </div>
            </div>
          </div>

          {/* Header action buttons */}
          <div className={styles.headerActions}>
            <button
              className={styles.headerActionBtn}
              onClick={handleResetClick}
              title={t("Chat.reset.button")}
            >
              <Trash2 size={18} />
            </button>
            <button
              className={styles.headerActionBtn}
              title="우편함"
              onClick={() => setMailboxOpen(true)}
            >
              <Mail size={18} />
            </button>
            <Link href="/help" className={styles.helpButton}>
              ?
            </Link>
          </div>
        </header>
      </div>

      {/* ── Content: 100% 채팅 영역 ── */}
      <main className={styles.content}>
        <div className={styles.chatArea}>
          <div className={styles.chatLog} ref={chatScrollRef}>
            {messages.length === 0 ? (
              <div className={styles.chatEmpty}>
                <div className={styles.greeting}>
                  <h2 className={styles.greetingTitle}>
                    {t("Chat.greetingTitle")}
                  </h2>
                  <p className={styles.greetingText}>
                    {t("Chat.greetingText")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(renderChatBubble)}
                {isTyping && renderTypingIndicator()}
              </>
            )}
          </div>
        </div>

        {/* ── Full Chat Log Overlay (toggle) ── */}
        {showLog && (
          <div className={styles.logOverlay}>
            <div className={styles.logContent} ref={logScrollRef}>
              {messages.length === 0 ? (
                <div className={styles.logEmpty}>
                  <p>{t("Chat.logEmpty")}</p>
                  <p className={styles.logEmptySub}>{t("Chat.logEmptySub")}</p>
                </div>
              ) : (
                <>
                  {messages.map(renderChatBubble)}
                  {isTyping && renderTypingIndicator()}
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Chat Log Toggle Button ── */}
        <button
          className={`${styles.logToggleBtn} ${showLog ? styles.logToggleActive : ""}`}
          onClick={toggleLog}
          title={showLog ? t("Chat.logClose") : t("Chat.logOpen")}
        >
          {showLog ? <X size={20} /> : <MessageCircle size={18} />}
        </button>
      </main>

      {/* ── 메시지 입력 ── */}
      <div className={styles.messageInputContainer}>
        <MessageInput className={styles.messageInput} onSend={handleSend} />
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={styles.toast}>
          <p>{toast}</p>
        </div>
      )}

      {/* ── SOS Modal ── */}
      <ActionModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title={t("Chat.sos.modalTitle")}
        icon="🆘"
        description={t("Chat.sos.modalDesc")}
        subDescription={t("Chat.sos.cost")}
        subDescColor="#ffcc00"
        cancelText={t("Chat.sos.cancel")}
        confirmText={t("Chat.sos.confirm")}
        onConfirm={confirmSOS}
      />

      {/* ── RLHF Modal ── */}
      <ActionModal
        isOpen={rlhfModalOpen}
        onClose={() => setRlhfModalOpen(false)}
        title={t("Chat.rlhf.modalTitle")}
        icon="📚"
        description={t("Chat.rlhf.modalDesc")}
        subDescription={t("Chat.rlhf.modalSub")}
        cancelText={t("Chat.rlhf.cancel")}
        confirmText={t("Chat.rlhf.confirm")}
        onConfirm={confirmRLHF}
      />

      {/* ── Report Modal ── */}
      <ActionModal
        isOpen={reportModalOpen}
        onClose={() => {
          if (reportConfirmStep) {
            setReportConfirmStep(false);
          } else {
            setReportModalOpen(false);
          }
        }}
        title={
          !reportConfirmStep
            ? t("Chat.report.modalTitle")
            : t("Chat.report.confirmTitle")
        }
        icon={reportConfirmStep ? "🚨" : undefined}
        description={
          !reportConfirmStep
            ? t("Chat.report.selectReason")
            : t("Chat.report.confirmDesc")
        }
        cancelText={t("Chat.report.cancel")}
        confirmText={reportConfirmStep ? t("Chat.report.confirm") : undefined}
        onConfirm={reportConfirmStep ? confirmReport : undefined}
        isDanger={true}
      >
        {!reportConfirmStep && (
          <div className={styles.reportReasons}>
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                className={`${styles.reportReasonBtn} ${
                  reportReason === reason ? styles.reportReasonActive : ""
                }`}
                onClick={() => handleReportReasonSelect(reason)}
              >
                {t(`Chat.report.reasons.${reason}`)}
              </button>
            ))}
          </div>
        )}
      </ActionModal>

      {/* ── Mailbox Modal ── */}
      <ActionModal
        isOpen={mailboxOpen}
        onClose={() => setMailboxOpen(false)}
        title="📬 우편함"
        confirmText="닫기"
        onConfirm={() => setMailboxOpen(false)}
      >
        <div className={styles.mailboxEmpty}>
          <span className={styles.mailboxEmptyIcon}>📭</span>
          <p className={styles.modalSectionDesc}>새로운 우편이 없습니다</p>
          <p
            className={styles.modalSectionDesc}
            style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 4 }}
          >
            아카데미 채점 결과나 SOS 답변이 도착하면 여기서 확인할 수 있어요.
          </p>
        </div>
      </ActionModal>

      {/* ── Delete Modal ── */}
      <ActionModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        title={t("Chat.delete.modalTitle", { defaultValue: "메시지 삭제" })}
        icon="🗑️"
        description={t("Chat.delete.modalDesc", {
          defaultValue: "이 메시지를 삭제하시겠습니까?",
        })}
        cancelText={t("Chat.delete.cancel", { defaultValue: "취소" })}
        confirmText={t("Chat.delete.confirm", { defaultValue: "삭제하기" })}
        onConfirm={confirmDelete}
        isDanger={true}
      />

      {/* ── Reset Modal ── */}
      <ActionModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={t("Chat.reset.modalTitle")}
        icon="🗑️"
        description={t("Chat.reset.modalDesc")}
        cancelText={t("Chat.reset.cancel")}
        confirmText={t("Chat.reset.confirm")}
        onConfirm={confirmReset}
        isDanger={true}
      />
    </div>
  );
}
