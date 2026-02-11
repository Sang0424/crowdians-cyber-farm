"use client";

import styles from "./page.module.scss";
import Image from "next/image";
import { MessageInput } from "@/../components/domain/MessageInput";
import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";

// ── Types ──
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}



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

  // Speech bubble (shown when log overlay is OFF)
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);
  const speechTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current && showLog) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showLog]);

  // Speech bubble auto-fade after 5s
  const showSpeechBubble = useCallback((text: string) => {
    if (speechTimeout.current) clearTimeout(speechTimeout.current);
    setSpeechBubbleText(text);
    speechTimeout.current = setTimeout(() => {
      setSpeechBubbleText(null);
    }, 5000);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      // Add user message
      const userMsg: ChatMessage = {
        id: newMsgId(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Simulate AI typing
      setIsTyping(true);
      const delay = 1000 + Math.random() * 2000; // 1–3s delay

      setTimeout(() => {
        // Randomly pick 0-9
        const randomIndex = Math.floor(Math.random() * 10);
        const aiText = t(`chat.aiResponses.${randomIndex}`);

        const aiMsg: ChatMessage = {
          id: newMsgId(),
          role: "assistant",
          content: aiText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);

        // Show speech bubble if log overlay is OFF
        if (!showLog) {
          showSpeechBubble(aiText);
        }
      }, delay);
    },
    [showLog, showSpeechBubble, t]
  );

  const toggleLog = () => {
    setShowLog((prev) => !prev);
    if (speechBubbleText) setSpeechBubbleText(null);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.headerGrid}>
        <h1 className={styles.title}>Crowdians</h1>
        <header className={styles.contentHeader}>
          <div className={styles.statusContainer}>
            <Image
              src="/Crowdy/GEOS.gif"
              alt="GEOS"
              width={120}
              height={120}
              unoptimized={true}
              className={styles.character}
            />
            <div className={styles.levelSection}>
              <div className={styles.levelInfo}>
                <div className={styles.level}>Lv.1</div>
                <div className={styles.expBar}>
                  <div className={styles.expProgress} />
                </div>
                <div className={styles.expText}>0/100 EXP</div>
              </div>
              <div className={styles.fatigueInfo}>
                <div className={styles.fatigueLabel}>{t("Chat.fatigue")}</div>
                <div className={styles.fatigueBar}>
                  <div className={styles.fatigueProgress} />
                </div>
                <div className={styles.fatigueText}>0/20</div>
              </div>
            </div>
          </div>

          <div className={styles.helpButton}>?</div>
        </header>
      </div>

      {/* 콘텐츠 영역 */}
      <main className={styles.content}>
        {/* 캐릭터 + 말풍선 영역 */}
        <div className={styles.characterArea}>
          <div className={styles.characterSection}>
            {/* Speech bubble (visible when log OFF and AI responds) */}
            {!showLog && speechBubbleText && (
              <div className={styles.speechBubble}>
                <span className={styles.speechName}>{t("Chat.crowdy")}</span>
                <p className={styles.speechText}>{speechBubbleText}</p>
              </div>
            )}

            {/* Speech bubble — typing indicator */}
            {!showLog && isTyping && !speechBubbleText && (
              <div className={styles.speechBubble}>
                <span className={styles.speechName}>{t("Chat.crowdy")}</span>
                <div className={styles.typingDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div className={styles.characterImage}>
              <Image
                src="/Crowdy/GEOS.gif"
                alt="Crowdy Character"
                width={180}
                height={180}
                unoptimized={true}
              />
            </div>

            {/* Greeting (no messages yet) */}
            {messages.length === 0 && !showLog && (
              <div className={styles.greeting}>
                <h2 className={styles.greetingTitle}>{t("Chat.greetingTitle")}</h2>
                <p className={styles.greetingText}>
                  {t("Chat.greetingText")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Chat Log Overlay ── */}
        {showLog && (
          <div className={styles.logOverlay}>
            <div className={styles.logContent} ref={scrollRef}>
              {messages.length === 0 ? (
                <div className={styles.logEmpty}>
                  <p>{t("Chat.logEmpty")}</p>
                  <p className={styles.logEmptySub}>
                    {t("Chat.logEmptySub")}
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.chatMsg} ${
                      msg.role === "user" ? styles.chatMsgUser : styles.chatMsgAi
                    }`}
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
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
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
          {showLog ? (
            <X size={20} />
          ) : (
            <>
              <MessageCircle size={18} />
              {messages.length > 0 && (
                <span className={styles.msgBadge}>{messages.length}</span>
              )}
            </>
          )}
        </button>


      </main>
              {/* 메시지 입력 */}
        <div className={styles.messageInputContainer}>
          <MessageInput
            className={styles.messageInput}
            onSend={handleSend}
          />
        </div>
    </div>
  );
}
