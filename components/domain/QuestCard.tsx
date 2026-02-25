// @crowdians/components/domain/QuestCard.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./QuestCard.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  EllipsisVertical,
  MessageCircle,
  ThumbsUp,
  Share2,
  Bookmark,
  Flag,
  User,
  Shield,
  MessageSquare,
} from "lucide-react";

export type QuestStatus = "open" | "selected" | "closed";

interface QuestCardProps {
  title: string;
  description: string;
  tags: string[];
  postedAgo: string;
  reward: number; // e.g. 50 => "보상 50 G"
  status: QuestStatus;
  requester: string; // e.g. "의뢰인: UserName"
  trustCount?: number; // 신뢰함 수
  answerCount?: number; // 답변 수
  bestAnswer?: {
    nickname: string;
    body: string;
    likes: number;
    rankLabel: "BEST" | "# 2" | string;
    rankColor: "best" | "normal";
    postedAgo: string;
  }[];
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
}

export function QuestCard({
  title,
  description,
  tags,
  postedAgo,
  reward,
  status,
  requester,
  trustCount,
  answerCount,
  bestAnswer = [],
  onShare,
  onBookmark,
  onReport,
}: QuestCardProps) {
  const t = useTranslations("QuestCard");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleMenuAction = (action: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);

    switch (action) {
      case "share":
        if (navigator.share) {
          navigator.share({ title, text: description }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert(t("alert.shared"));
        }
        break;
      case "bookmark":
        alert(t("alert.bookmarked"));
        break;
      case "report":
        onReport?.();
        break;
    }
  };

  return (
    <article className={styles.card + " " + styles[status]}>
      <header className={styles.header}>
        <Image
          src={"/Crowdy/GEOS.gif"}
          alt="avatar"
          width={64}
          height={64}
          className={styles.avatar}
          unoptimized
        />
        <div className={styles.headerText}>
          <p className={styles.requester}>{requester}</p>
          <p className={styles.meta}>{postedAgo}</p>
        </div>
        <div className={styles.reward} ref={menuRef}>
          <span>보상 {reward} G</span>
          <EllipsisVertical
            onClick={handleMenuToggle}
            className={styles.moreBtn}
          />
          {menuOpen && (
            <div className={styles.moreMenu}>
              <button
                className={styles.menuItem}
                onClick={handleMenuAction("share")}
              >
                <Share2 size={16} />
                <span>{t("menu.share")}</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={handleMenuAction("bookmark")}
              >
                <Bookmark size={16} />
                <span>{t("menu.bookmark")}</span>
              </button>
              <div className={styles.menuDivider} />
              <button
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                onClick={handleMenuAction("report")}
              >
                <Flag size={16} />
                <span>{t("menu.report")}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.questionBlock}>
        <div className={styles.questionTitle}>
          <span className={styles.qIcon}>Q.</span>
          <h3>{title}</h3>
        </div>
        <p className={styles.questionBody}>{description}</p>
      </div>

      <div className={styles.answers}>
        {bestAnswer.map((answer, idx) => (
          <div
            key={answer.nickname + idx}
            className={
              styles.answerRow + " " + (idx === 0 ? styles.best : styles.normal)
            }
          >
            <div className={styles.answerHeader}>
              <span
                className={
                  styles.rankBadge +
                  " " +
                  (answer.rankColor === "best"
                    ? styles.rankBest
                    : styles.rankNormal)
                }
              >
                {answer.rankLabel}
              </span>
              <p className={styles.nickname}>{answer.nickname}</p>
            </div>
            <div className={styles.answerContent}>
              <p className={styles.body}>{answer.body}</p>
              <div className={styles.footer}>
                <div className={styles.likes}>
                  <ThumbsUp className={styles.thumbIcon} size={18} />
                  <span className={styles.thumbCount}>{answer.likes}</span>
                </div>
                <span className={styles.postedAgo}>{answer.postedAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.commentBtn}>의견 남기기</button>
        <div className={styles.cardStats}>
          {trustCount !== undefined && (
            <span className={styles.statItem}>
              <ThumbsUp size={14} />
              {t("footer.trust")} {trustCount}
            </span>
          )}
          {answerCount !== undefined && (
            <span className={styles.statItem}>
              <MessageCircle size={14} />
              {t("footer.answers")} {answerCount}
            </span>
          )}
        </div>
        <button className={styles.bookmarkBtn} aria-label="bookmark" />
      </div>
    </article>
  );
}
