// @crowdians/src/app/[locale]/settings/privacy/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import styles from '../legal.module.scss'

export default function PrivacyPage() {
  const t = useTranslations('Legal.privacy')
  const tc = useTranslations('common')
  const router = useRouter()

  const content = t.raw('content') as { header: string; body: string }[]

  return (
    <div className={styles.legalPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ArrowLeft size={16} />
          {tc('back')}
        </button>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lastUpdated}>{t('lastUpdated')}</p>
      </header>

      <main className={styles.content}>
        {content.map((item, index) => (
          <section key={index} className={styles.section}>
            <h2 className={styles.sectionHeader}>{item.header}</h2>
            <p className={styles.sectionBody}>{item.body}</p>
          </section>
        ))}
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Crowdians. All rights reserved.</p>
      </footer>
    </div>
  )
}
