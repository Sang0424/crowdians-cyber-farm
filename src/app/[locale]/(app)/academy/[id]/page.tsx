// @crowdians/src/app/[locale]/academy/[id]/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  MessageCircle,
  SendHorizontal,
  Share2,
  ThumbsUp,
  AlertTriangle,
  Shield,
  Trophy,
  Zap,
  Star,
} from "lucide-react";
import {
  MOCK_ARCHIVE_ITEMS,
  MOCK_QUESTS,
  ArchiveAnswer,
} from "@/data/mockData";
import { useUserStore } from "@/../store/useUserStore";
import ActionModal from "@/../components/domain/ActionModal";
import { useTranslations } from "next-intl";

// ── Mock Trust Tiers ──
const TRUST_TIERS = [
  { min: 0, label: "뉴비", color: "#979797", icon: "🌱" },
  { min: 100, label: "견습생", color: "#4ade80", icon: "🔰" },
  { min: 500, label: "전문가", color: "#3b82f6", icon: "🎯" },
  { min: 1000, label: "마스터", color: "#a855f7", icon: "👑" },
  { min: 5000, label: "레전드", color: "#ffd700", icon: "⚡" },
];

function getTrustTier(totalVotes: number) {
  for (let i = TRUST_TIERS.length - 1; i >= 0; i--) {
    if (totalVotes >= TRUST_TIERS[i].min) return TRUST_TIERS[i];
  }
  return TRUST_TIERS[0];
}

export default function BoardDetailPage() {
  const t = useTranslations("Academy");
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const { user } = useUserStore();

  // Find the archive item
  const archiveItem = useMemo(
    () => MOCK_ARCHIVE_ITEMS.find((item) => item.id === itemId),
    [itemId],
  );

  // ── State ──
  const [sortMode, setSortMode] = useState<"trust" | "latest">("trust");
  const [trustedAnswers, setTrustedAnswers] = useState<Set<string>>(new Set());
  const [userAnswers, setUserAnswers] = useState<ArchiveAnswer[]>([]);
  const [composerText, setComposerText] = useState("");
  const [reportTarget, setReportTarget] = useState<string | null>(null); // answerId for report modal

  // All answers (base + user-submitted), sorted
  const allAnswers = useMemo(() => {
    if (!archiveItem) return [];
    const all = [...archiveItem.answers, ...userAnswers];
    if (sortMode === "trust") {
      return [...all].sort((a, b) => b.votes - a.votes);
    }
    return [...all].reverse();
  }, [archiveItem, userAnswers, sortMode]);

  // Best contributor (highest votes)
  const bestContributor = useMemo(() => {
    if (!archiveItem || archiveItem.answers.length === 0) return null;
    const sorted = [...archiveItem.answers].sort((a, b) => b.votes - a.votes);
    return sorted[0];
  }, [archiveItem]);

  // Bounty quests (open ones)
  const bountyQuests = useMemo(() => {
    return MOCK_QUESTS.filter((q) => q.status === "open").slice(0, 4);
  }, []);

  // Trust vote handler — toggle on/off
  const handleTrustVote = useCallback((answerId: string) => {
    setTrustedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(answerId)) {
        next.delete(answerId);
      } else {
        next.add(answerId);
      }
      return next;
    });
  }, []);

  // Get vote count
  const getVoteCount = (answer: ArchiveAnswer) => {
    return answer.votes + (trustedAnswers.has(answer.id) ? 1 : 0);
  };

  // Submit answer
  const handleSubmitAnswer = useCallback(() => {
    if (composerText.trim().length < 3) return;
    const newAnswer: ArchiveAnswer = {
      id: `user_${Date.now()}`,
      content: composerText.trim(),
      authorName: user?.nickname ?? "크라우디언",
      votes: 0,
    };
    setUserAnswers((prev) => [...prev, newAnswer]);
    setComposerText("");
  }, [composerText, user?.nickname]);

  // Back to archive tab
  const handleBack = useCallback(() => {
    router.push("/academy?tab=archive");
  }, [router]);

  // Report confirm handler
  const handleReportConfirm = useCallback(() => {
    setReportTarget(null);
    alert("신고가 접수되었습니다. 검토 후 조치하겠습니다.");
  }, []);

  // 404
  if (!archiveItem) {
    return (
      <main className={styles.page}>
        <section className={styles.mainColumn}>
          <div style={{ textAlign: "center", padding: 60 }}>
            <p style={{ fontFamily: "DungGeunMo", fontSize: 20 }}>
              📚 {t("archive.noResults")}
            </p>
            <button
              onClick={handleBack}
              style={{
                marginTop: 20,
                background: "var(--text-blue)",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: 999,
                fontFamily: "DungGeunMo",
                cursor: "pointer",
              }}
            >
              ← {t("hud.home")}
            </button>
          </div>
        </section>
      </main>
    );
  }

  const bestTier = bestContributor ? getTrustTier(bestContributor.votes) : null;

  return (
    <main className={styles.page}>
      <section className={styles.mainColumn}>
        <button className={styles.backBtn} onClick={handleBack}>
          <ArrowLeft size={18} /> {t("hud.home")}
        </button>

        {/* ── Question Card ── */}
        <article className={styles.questionCard}>
          <header className={styles.questionHeader}>
            <div className={styles.requesterBlock}>
              <Image
                src={"/Crowdy/GEOS.gif"}
                alt="avatar"
                width={64}
                height={64}
                className={styles.avatar}
                unoptimized
              />
              <div>
                <p className={styles.requester}>{archiveItem.authorName}</p>
                <p className={styles.meta}>{archiveItem.createdAt}</p>
              </div>
            </div>
            <div className={styles.actions}>
              <button aria-label="share">
                <Share2 size={18} />
              </button>
              <button aria-label="bookmark">
                <Bookmark size={18} />
              </button>
            </div>
          </header>

          <div className={styles.questionBody}>
            <h1>{archiveItem.question}</h1>
          </div>

          <div className={styles.reactions}>
            <div>
              <ThumbsUp size={18} />
              <span>{archiveItem.likes}</span>
            </div>
            <div>
              <MessageCircle size={18} />
              <span>{allAnswers.length}</span>
            </div>
          </div>
        </article>

        {/* ── Answers Header ── */}
        <div className={styles.answerHeader}>
          <div>
            <span>{t("archive.otherAnswers")}</span>
            <strong> {allAnswers.length}</strong>
          </div>
          <div className={styles.sortTabs}>
            <button
              className={sortMode === "trust" ? styles.activeSort : ""}
              onClick={() => setSortMode("trust")}
            >
              {t("archive.filterPopular")}
            </button>
            <button
              className={sortMode === "latest" ? styles.activeSort : ""}
              onClick={() => setSortMode("latest")}
            >
              {t("archive.filterLatest")}
            </button>
          </div>
        </div>

        {/* ── Answers ── */}
        <div className={styles.answers}>
          {allAnswers.map((answer, idx) => {
            const voteCount = getVoteCount(answer);
            const isTrusted = trustedAnswers.has(answer.id);
            const isTop = idx === 0 && sortMode === "trust";

            return (
              <article
                key={answer.id}
                className={`${styles.answerCard} ${isTop ? styles.bestAnswer : styles.normalAnswer}`}
              >
                <div className={styles.answerBadgeRow}>
                  <span
                    className={`${styles.answerBadge} ${isTop ? styles.badgeBest : styles.badgeOther}`}
                  >
                    {isTop ? "👑 BEST" : `#${idx + 1}`}
                  </span>
                  {voteCount >= 50 && (
                    <span className={styles.goldenBadge}>✨ 골든 데이터</span>
                  )}
                </div>
                <header className={styles.answerHeaderRow}>
                  <div>
                    <p className={styles.answerNickname}>{answer.authorName}</p>
                  </div>
                </header>
                <p className={styles.answerBody}>{answer.content}</p>
                <div className={styles.answerReactions}>
                  <button
                    className={`${styles.trustBtn} ${isTrusted ? styles.trustBtnActive : ""}`}
                    onClick={() => handleTrustVote(answer.id)}
                  >
                    <ThumbsUp size={16} />
                    <span>
                      {t("footer.trust", { ns: "QuestCard" })} {voteCount}
                    </span>
                  </button>
                  <button
                    className={styles.reportBtn}
                    title={t("chat.report.button")}
                    onClick={() => setReportTarget(answer.id)}
                  >
                    <AlertTriangle size={14} />
                    <span>{t("chat.report.button")}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Composer ── */}
        <div className={styles.composer}>
          <textarea
            placeholder="답을 알려주세요 (최소 3자)"
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
          />
          <button
            type="button"
            aria-label="send"
            onClick={handleSubmitAnswer}
            disabled={composerText.trim().length < 3}
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </section>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        {/* ── 👑 Top Contributor ── */}
        {bestContributor && bestTier && (
          <section
            className={`${styles.contributorCard} ${styles.contributorClickable}`}
            onClick={() => router.push(`/user/${bestContributor.authorName}`)}
          >
            <header className={styles.contributorHeader}>
              <Trophy size={18} className={styles.trophyIcon} />
              <h2>{t("archive.sidebar.contributor")}</h2>
            </header>
            <div className={styles.contributorBody}>
              <div className={styles.contributorAvatar}>
                <Image
                  src={"/Crowdy/GEOS.gif"}
                  alt="contributor"
                  width={56}
                  height={56}
                  unoptimized
                  className={styles.contributorImg}
                />
                <span
                  className={styles.tierBadge}
                  style={{ background: bestTier.color }}
                >
                  {bestTier.icon} {bestTier.label}
                </span>
              </div>
              <div className={styles.contributorInfo}>
                <p className={styles.contributorName}>
                  {bestContributor.authorName}
                </p>
                <div className={styles.contributorStats}>
                  <div className={styles.contributorStat}>
                    <Shield size={14} />
                    <span>
                      {t("hud.trust")} {bestContributor.votes}
                    </span>
                  </div>
                  <div className={styles.contributorStat}>
                    <Star size={14} />
                    <span>골든 {bestContributor.votes >= 50 ? "✓" : "-"}</span>
                  </div>
                </div>
              </div>
              {/* Mini Radar Chart (simplified bar chart) */}
              <div className={styles.miniRadar}>
                <div className={styles.radarBar}>
                  <span>정확도</span>
                  <div className={styles.radarTrack}>
                    <div
                      className={styles.radarFill}
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <div className={styles.radarBar}>
                  <span>명료함</span>
                  <div className={styles.radarTrack}>
                    <div
                      className={styles.radarFill}
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
                <div className={styles.radarBar}>
                  <span>전문성</span>
                  <div className={styles.radarTrack}>
                    <div
                      className={styles.radarFill}
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── 🔥 Bounty Board ── */}
        <section className={styles.bountyCard}>
          <header className={styles.bountyHeader}>
            <Zap size={18} className={styles.bountyIcon} />
            <h2>{t("archive.sidebar.bountyBoard")}</h2>
          </header>
          <p className={styles.bountyDesc}>{t("archive.sidebar.bountyDesc")}</p>
          <ul className={styles.bountyList}>
            {bountyQuests.map((quest) => (
              <li key={quest.id} className={styles.bountyItem}>
                <Link
                  href={`/academy/${quest.id}`}
                  className={styles.bountyLink}
                >
                  <p className={styles.bountyTitle}>{quest.title}</p>
                  <div className={styles.bountyMeta}>
                    <span className={styles.bountyReward}>
                      💰 {quest.reward} G
                    </span>
                    <span className={styles.bountyDate}>{quest.date}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      {/* ── Report ActionModal ── */}
      <ActionModal
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        title={t("archive.reportModal.title")}
        icon="🚨"
        description={t("chat.report.confirmTitle")}
        subDescription={t("chat.report.confirmDesc")}
        subDescColor="#ff2a6d"
        cancelText={t("chat.report.cancel")}
        confirmText={t("chat.report.confirm")}
        onConfirm={handleReportConfirm}
        isDanger
      />
    </main>
  );
}
