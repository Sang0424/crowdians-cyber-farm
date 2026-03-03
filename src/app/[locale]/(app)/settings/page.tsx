// @crowdians/src/app/[locale]/settings/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./page.module.scss";
import {
  User,
  KeyRound,
  LogOut,
  Trash2,
  FileText,
  Shield,
  Headphones,
  ChevronRight,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useUserStore } from "@/../store/useUserStore";
import ActionModal from "@/../components/domain/ActionModal";
import { sendGAEvent } from "@next/third-parties/google";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const router = useRouter();
  const { user, logout, setUser } = useUserStore();

  // ── Nickname editing ──
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname ?? "");

  // ── Modals ──
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleNicknameSave = () => {
    if (!user || nicknameInput.trim().length < 2) return;
    setUser({ ...user, nickname: nicknameInput.trim() });
    setIsEditingNickname(false);
    sendGAEvent({ event: "settings_update_nickname" });
  };

  const handleNicknameCancel = () => {
    setNicknameInput(user?.nickname ?? "");
    setIsEditingNickname(false);
  };

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
    sendGAEvent({ event: "settings_logout" });
    router.push("/");
  };

  const handleDeleteAccount = () => {
    logout();
    setDeleteModalOpen(false);
    sendGAEvent({ event: "settings_delete_account" });
    router.push("/");
  };

  return (
    <div className={styles.settingsPage}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      {/* ── 계정 관리 ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("account.title")}</h2>

        {/* 닉네임 변경 */}
        <div className={styles.settingItem}>
          <div className={styles.settingLeft}>
            <User size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>
                {t("account.nicknameLabel")}
              </p>
              {isEditingNickname ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.editInput}
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    maxLength={12}
                    autoFocus
                  />
                  <button
                    className={styles.editConfirm}
                    onClick={handleNicknameSave}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    className={styles.editCancel}
                    onClick={handleNicknameCancel}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <p className={styles.settingValue}>
                  {user?.nickname ?? "Crowdian"}
                </p>
              )}
            </div>
          </div>
          {!isEditingNickname && (
            <button
              className={styles.settingAction}
              onClick={() => setIsEditingNickname(true)}
            >
              <Pencil size={16} />
            </button>
          )}
        </div>

        {/* 비밀번호 변경 */}
        <div
          className={styles.settingItem}
          onClick={() => setPasswordModalOpen(true)}
        >
          <div className={styles.settingLeft}>
            <KeyRound size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>
                {t("account.passwordLabel")}
              </p>
              <p className={styles.settingDesc}>{t("account.passwordDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>

        {/* 로그아웃 */}
        <div
          className={styles.settingItem}
          onClick={() => setLogoutModalOpen(true)}
        >
          <div className={styles.settingLeft}>
            <LogOut size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>{t("account.logoutLabel")}</p>
              <p className={styles.settingDesc}>{t("account.logoutDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>

        {/* 회원탈퇴 */}
        <div
          className={`${styles.settingItem} ${styles.dangerItem}`}
          onClick={() => setDeleteModalOpen(true)}
        >
          <div className={styles.settingLeft}>
            <Trash2 size={20} className={styles.settingIconDanger} />
            <div>
              <p className={styles.settingLabelDanger}>
                {t("account.deleteLabel")}
              </p>
              <p className={styles.settingDesc}>{t("account.deleteDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>
      </section>

      {/* ── 정책 및 정보 ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("policy.title")}</h2>

        <div
          className={styles.settingItem}
          onClick={() => router.push("/terms")}
        >
          <div className={styles.settingLeft}>
            <FileText size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>{t("policy.termsLabel")}</p>
              <p className={styles.settingDesc}>{t("policy.termsDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>

        <div
          className={styles.settingItem}
          onClick={() => router.push("/privacy")}
        >
          <div className={styles.settingLeft}>
            <Shield size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>{t("policy.privacyLabel")}</p>
              <p className={styles.settingDesc}>{t("policy.privacyDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>

        <div
          className={styles.settingItem}
          onClick={() => window.open("mailto:support@crowdians.com")}
        >
          <div className={styles.settingLeft}>
            <Headphones size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>{t("policy.supportLabel")}</p>
              <p className={styles.settingDesc}>{t("policy.supportDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Crowdians v0.1.0</p>
        <p>© 2026 Crowdians. All rights reserved.</p>
      </footer>

      {/* ── Modals ── */}
      <ActionModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title={t("modal.logoutTitle")}
        icon="🚪"
        description={t("modal.logoutDesc")}
        cancelText={t("modal.cancel")}
        confirmText={t("modal.logoutConfirm")}
        onConfirm={handleLogout}
      />

      <ActionModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("modal.deleteTitle")}
        icon="⚠️"
        description={t("modal.deleteDesc")}
        subDescription={t("modal.deleteSubDesc")}
        subDescColor="#ff2a6d"
        cancelText={t("modal.cancel")}
        confirmText={t("modal.deleteConfirm")}
        onConfirm={handleDeleteAccount}
        isDanger
      />

      <ActionModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title={t("modal.passwordTitle")}
        icon="🔑"
        description={t("modal.passwordDesc")}
        subDescription={t("modal.passwordSubDesc")}
        cancelText={t("modal.confirm")}
      />
    </div>
  );
}
