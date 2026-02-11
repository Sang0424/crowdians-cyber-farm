// @crowdians/components/domain/QuestCard.tsx
import styles from "./QuestCard.module.scss";

export type QuestStatus = "open" | "selected" | "closed";

interface QuestCardProps {
  title: string;
  description: string;
  tags: string[];
  postedAgo: string;
  reward: number; // e.g. 50 => “보상 50 G”
  deadline?: string; // e.g. “D-7”
  status: QuestStatus;
  requester: string; // e.g. “의뢰인: UserName”
  bestAnswer?: {
    nickname: string;
    body: string;
    likes: number;
    rankLabel: "BEST" | "# 2" | string;
    rankColor: "best" | "normal";
    postedAgo: string;
  }[];
}

export function QuestCard({
  title,
  description,
  tags,
  postedAgo,
  reward,
  deadline = "D-7",
  status,
  requester,
  bestAnswer = [],
}: QuestCardProps) {
  return (
    <article className={styles.card + " " + styles[status]}>
      <header className={styles.header}>
        <div className={styles.avatar} aria-hidden />
        <div className={styles.headerText}>
          <p className={styles.requester}>{requester}</p>
          <p className={styles.meta}>
            {postedAgo} · {tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        </div>
        <div className={styles.reward}>
          <span>보상 {reward} G</span>
          <span className={styles.deadline}>⏳ {deadline}</span>
        </div>
        <button className={styles.moreBtn} aria-label="more" />
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
            <div className={styles.answerContent}>
              <p className={styles.nickname}>{answer.nickname}</p>
              <p className={styles.body}>{answer.body}</p>
              <div className={styles.footer}>
                <div className={styles.likes}>
                  <span className={styles.thumbIcon} />
                  <span>{answer.likes}</span>
                </div>
                <span className={styles.postedAgo}>{answer.postedAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.commentBtn}>의견 남기기</button>
        <button className={styles.bookmarkBtn} aria-label="bookmark" />
      </div>
    </article>
  );
}
