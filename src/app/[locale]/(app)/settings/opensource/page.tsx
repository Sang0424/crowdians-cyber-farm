// @crowdians/src/app/[locale]/settings/opensource/page.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import styles from '../legal.module.scss'

export default function OpenSourcePage() {
  const t = useTranslations('Legal.opensource')
  const tc = useTranslations('common')
  const router = useRouter()

  const list = t.raw('list') as { name: string; license: string; url: string }[]

  return (
    <div className={styles.legalPage}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <ArrowLeft size={16} />
          {tc('back')}
        </button>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.lastUpdated}>{t('desc')}</p>
      </header>

      <main className={styles.content}>
        <div className={styles.licenseList}>
          {list.map((item, index) => (
            <div key={index} className={styles.licenseCard}>
              <div className={styles.libName}>{item.name}</div>
              <div className={styles.libLicense}>{item.license}</div>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.libUrl}
              >
                {item.url} <ExternalLink size={10} style={{ display: 'inline', marginLeft: 2 }} />
              </a>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 Crowdians. All rights reserved.</p>
      </footer>
    </div>
  )
}
