// @crowdians/src/app/[locale]/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
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
  Zap,
  CheckCircle2,
  Star,
  CreditCard,
  Code2,
} from "lucide-react";
import ActionModal from "@/../components/domain/ActionModal";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const tTitles = useTranslations("titles");
  const router = useRouter();

  // ── Nickname editing ──
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nicknameError, setNicknameError] = useState("");

  // ── Modals ──
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  const handleNicknameSave = async () => {
    setNicknameError("");
    if (nicknameInput.trim().length < 2) return;
    if (nicknameInput.trim() === "크라우디언") {
      setNicknameError("'크라우디언'은 설정할 수 없는 닉네임입니다.");
      return;
    }

    try {
      setIsEditingNickname(false);
    } catch (error) {
      console.error("Failed to update nickname", error);
      setNicknameError(
        "저장에 실패했습니다. 이미 사용 중인 닉네임일 수 있습니다.",
      );
    }
  };

  const handleNicknameCancel = () => {
    setNicknameError("");
    setIsEditingNickname(false);
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    router.push("/");
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    router.push("/");
  };

  // const handleTitleChange = async (titleKey: string) => {
  //   try {
  //     await userApi.updateTitle(titleKey);
  //     // Update local state by re-fetching user
  //     if (user) await useAuthStore.getState().fetchUser(user.uid);
  //     success(t("myTitle.success"));
  //   } catch (err) {
  //     console.error("Failed to update title", err);
  //     toastError("Failed to update title");
  //   }
  // };

  // const handleUpgrade = async () => {
  //   if (isUpgrading) return;
  //   setIsUpgrading(true);
  //   try {
  //     const { checkoutUrl } = await subscriptionApi.getCheckoutUrl();
  //     window.location.href = checkoutUrl;
  //   } catch (err) {
  //     console.error("Failed to get checkout URL", err);
  //     toastError(t("subscription.checkoutError"));
  //     setIsUpgrading(false);
  //   }
  // };

  // const handleManageSubscription = async () => {
  //   if (isManaging) return;
  //   setIsManaging(true);
  //   try {
  //     const { portalUrl } = await subscriptionApi.getPortalUrl();
  //     window.open(portalUrl, "_blank");
  //   } catch (err) {
  //     console.error("Failed to get portal URL", err);
  //     toastError(t("subscription.portalError"));
  //   } finally {
  //     setIsManaging(false);
  //   }
  // };

  return (
    <div className={styles.settingsPage}>
      <header className={styles.hero}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </header>

      {/* ── 계정 관리 ── */}
      {true && (
        <>
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
                        onChange={(e) =>
                          setNicknameInput(e.target.value.slice(0, 12))
                        }
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
                    <p className={styles.settingValue}>{"Crowdian"}</p>
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
          </section>

          {/* ── 프리미엄 구독 ── */}
          {/* <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("subscription.title")}</h2>
            <p className={styles.sectionSubtitle}>
              {t("subscription.subtitle")}
            </p> */}

          {/* <div className={styles.subscriptionCard}>
              <div className={styles.subscriptionHeader}>
                <div className={styles.planInfo}>
                  <p className={styles.settingLabel}>
                    {t("subscription.statusLabel")}
                  </p>
                  <div
                    className={`${styles.planBadge} ${isPremium ? styles.premiumBadge : ""}`}
                  >
                    {isPremium ? (
                      <>
                        <Star size={12} style={{ marginRight: 4 }} />
                        {t("subscription.planPremium")}
                      </>
                    ) : (
                      t("subscription.planFree")
                    )}
                  </div>
                  {isPremium && user?.subscriptionExpiresAt && (
                    <p className={styles.settingDesc}>
                      {t("subscription.expiresAt", {
                        date: new Date(
                          user.subscriptionExpiresAt,
                        ).toLocaleDateString(),
                      })}
                    </p>
                  )}
                </div>
                {isPremium ? (
                  <Zap size={24} color="#8f00ff" />
                ) : (
                  <Zap size={24} color="var(--text-sub)" />
                )}
              </div>

              <ul className={styles.benefitList}>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} />
                  <span>{t("subscription.benefits.stamina")}</span>
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} />
                  <span>{t("subscription.benefits.priority")}</span>
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} />
                  <span>{t("subscription.benefits.sos")}</span>
                </li>
                <li className={styles.benefitItem}>
                  <CheckCircle2 size={16} />
                  <span>{t("subscription.benefits.commission")}</span>
                </li>
              </ul>

              {isPremium ? (
                <button
                  className={styles.manageButton}
                  onClick={handleManageSubscription}
                  disabled={isManaging}
                >
                  {isManaging ? "..." : t("subscription.manageButton")}
                </button>
              ) : (
                <button
                  className={styles.upgradeButton}
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  {isUpgrading ? "..." : t("subscription.upgradeButton")}
                </button>
              )}
            </div> */}
          {/* </section> */}
        </>
      )}

      {/* ── 정책 및 정보 ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("policy.title")}</h2>

        <div
          className={styles.settingItem}
          onClick={() => router.push("/settings/terms")}
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
          onClick={() => router.push("/settings/privacy")}
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
          onClick={() => router.push("/settings/refund")}
        >
          <div className={styles.settingLeft}>
            <CreditCard size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>{t("policy.refundLabel")}</p>
              <p className={styles.settingDesc}>{t("policy.refundDesc")}</p>
            </div>
          </div>
          <ChevronRight size={18} className={styles.chevron} />
        </div>

        <div
          className={styles.settingItem}
          onClick={() => router.push("/settings/opensource")}
        >
          <div className={styles.settingLeft}>
            <Code2 size={20} className={styles.settingIcon} />
            <div>
              <p className={styles.settingLabel}>
                {t("policy.opensourceLabel")}
              </p>
              <p className={styles.settingDesc}>{t("policy.opensourceDesc")}</p>
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

        {true && (
          <>
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
                  <p className={styles.settingDesc}>
                    {t("account.passwordDesc")}
                  </p>
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
                  <p className={styles.settingLabel}>
                    {t("account.logoutLabel")}
                  </p>
                  <p className={styles.settingDesc}>
                    {t("account.logoutDesc")}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </div>
          </>
        )}

        {true && (
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
        )}
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
