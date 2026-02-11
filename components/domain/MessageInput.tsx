"use client"; // 클라이언트 컴포넌트 필수

import { useState, useRef } from "react";
import styles from "./MessageInput.module.scss";
import { SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface MessageInputProps {
  className?: string;
  onModeChange?: (mode: "chat" | "teaching") => void;
  onSend?: (text: string) => void;
}

export function MessageInput({ className, onModeChange, onSend }: MessageInputProps) {
  // const [isTeaching, setIsTeaching] = useState(false);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations();

  // 텍스트가 변경될 때마다 높이 조절
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 높이 초기화
      textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞춰 높이 설정
    }
  };

  // const toggleMode = () => {
  //   const newMode = !isTeaching;
  //   setIsTeaching(newMode);
  //   if (onModeChange) {
  //     onModeChange(newMode ? "teaching" : "chat");
  //   }
  // };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setText("");
   // 전송 후 높이 초기화
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter는 전송, Shift + Enter는 줄바꿈
    if (e.key === "Enter" && !e.shiftKey) {
      if (window.innerWidth > 768) { // 모바일이 아닐 때만 엔터로 전송
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className={`${styles.messageInput} ${className || ""}`}>
      {/* 입력창 */}
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={t("Chat.placeholder")}
          className={styles.textarea}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          name="chat"
        />
      </div>

      {/* 모드 토글 스위치 */}
      <div className={styles.bottomRow}>
        {/* <div
          className={`${styles.modeToggle} ${isTeaching ? styles.teaching : ""}`}
          onClick={toggleMode}
        >
          <div className={styles.slider} />
          <div className={styles.labels}>
            <span className={!isTeaching ? styles.active : ""}>대화</span>
            <span className={isTeaching ? styles.active : ""}>티칭</span>
          </div>
        </div> */}

        {/* 전송 버튼 */}
        <button className={styles.sendButton} onClick={handleSend}>
          <SendHorizontal color="white" size={20} />
        </button>
      </div>
    </div>
  );
}
