"use client";

import Link from "next/link";
import styles from "./page.module.scss";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("LandingPage");

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>{t("heroBadge")}</div>
          <h1
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: t("heroTitle") }}
          />
          <p className={styles.subtitle}>{t("heroSubtitle")}</p>
          <div className={styles.heroButtons}>
            <Link href="/chat" className={styles.primaryBtn}>
              {t("btnPlay")}
            </Link>
            <Link href="/b2b" className={styles.ghostBtn}>
              {t("btnB2B")}
            </Link>
          </div>
        </div>

        {/* Dynamic Background Elements */}
        <div className={styles.heroBgShape1} />
        <div className={styles.heroBgShape2} />
      </section>

      {/* B2C Section */}
      <section className={styles.b2cSection}>
        <div className={styles.b2cContent}>
          <div className={styles.b2cHeader}>
            <h2 className={styles.b2cTitle}>
              <span className={styles.glitch} data-text={t("b2cGlitch")}>
                {t("b2cGlitch")}
              </span>
              <br />
              {t("b2cTitle")}
            </h2>
            <p className={styles.b2cSubtitle}>{t("b2cSubtitle")}</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚖️</div>
              <h3>{t("feat1Title")}</h3>
              <p>{t("feat1Desc")}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚔️</div>
              <h3>{t("feat2Title")}</h3>
              <p>{t("feat2Desc")}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🪪</div>
              <h3>{t("feat3Title")}</h3>
              <p>{t("feat3Desc")}</p>
            </div>
          </div>
          <div className={styles.ctaWrapper}>
            <Link href="/chat" className={styles.pixelActionBtn}>
              {t("btnStartGame")}
            </Link>
          </div>
        </div>
      </section>

      {/* B2B Section */}
      <section id="b2b-section" className={styles.b2bSection}>
        <div className={styles.b2bContent}>
          <div className={styles.b2bHeader}>
            <h2
              className={styles.b2bTitle}
              dangerouslySetInnerHTML={{ __html: t("b2bTitle") }}
            />
            <p className={styles.b2bSubtitle}>{t("b2bSubtitle")}</p>
          </div>
          <div className={styles.b2bCards}>
            <div className={styles.b2bCard}>
              <div className={styles.b2bCardHeader}>
                <div className={styles.b2bCardIcon}>📈</div>
                <h4>{t("b2bCard1Title")}</h4>
              </div>
              <p>{t("b2bCard1Desc")}</p>
            </div>
            <div className={styles.b2bCard}>
              <div className={styles.b2bCardHeader}>
                <div className={styles.b2bCardIcon}>🗣️</div>
                <h4>{t("b2bCard2Title")}</h4>
              </div>
              <p>{t("b2bCard2Desc")}</p>
            </div>
            <div className={styles.b2bCard}>
              <div className={styles.b2bCardHeader}>
                <div className={styles.b2bCardIcon}>🛡️</div>
                <h4>{t("b2bCard3Title")}</h4>
              </div>
              <p>{t("b2bCard3Desc")}</p>
            </div>
          </div>
          <div className={styles.b2bFooter}>
            <div className={styles.useCases}>
              <strong>{t("useCasesLabel")}</strong> {t("useCasesValue")}
            </div>
            {/* <div className={styles.b2bActions}>
              <a
                href="mailto:contact@crowdians.com"
                className={styles.corporateBtn}
              >
                {t("btnContact")}
              </a>
            </div> */}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>{t("footerText")}</p>
      </footer>
    </div>
  );
}
