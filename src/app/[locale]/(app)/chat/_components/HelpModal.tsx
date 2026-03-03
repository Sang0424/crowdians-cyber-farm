"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ActionModal from "@/../components/domain/ActionModal";
import styles from "@/../components/domain/ActionModal.module.scss";

export default function HelpModal() {
  const router = useRouter();
  const t = useTranslations("Chat.help");

  return (
    <ActionModal
      isOpen={true}
      onClose={() => router.back()}
      title={t("title")}
      confirmText={t("close")}
      onConfirm={() => router.back()}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Level Info */}
        <div className={styles.modalSection}>
          <span className={styles.modalIcon}>🧠</span>
          <div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 16,
                fontFamily: "DungGeunMo, sans-serif",
              }}
            >
              {t("levelTitle")}
            </h3>
            <p className={styles.modalSectionDesc}>{t("levelDesc")}</p>
          </div>
        </div>

        {/* Fatigue Info */}
        <div className={styles.modalSection}>
          <span className={styles.modalIcon}>⚡</span>
          <div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 16,
                fontFamily: "DungGeunMo, sans-serif",
              }}
            >
              {t("fatigueTitle")}
            </h3>
            <p className={styles.modalSectionDesc}>{t("fatigueDesc")}</p>
          </div>
        </div>
      </div>
    </ActionModal>
  );
}
