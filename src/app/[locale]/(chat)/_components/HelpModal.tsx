"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import styles from "../page.module.scss"; 

export default function HelpModal() {
  const router = useRouter();
  const t = useTranslations("Chat.help");

  return (
    <div className={styles.modalOverlay} onClick={() => router.back()}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.modalTitle}>{t('title')}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           {/* Level Info */}
           <div className={styles.modalSection}>
             <span className={styles.modalIcon}>🧠</span>
             <div>
               <h3 className={styles.modalSectionTitle}>{t('levelTitle')}</h3>
               <p className={styles.modalSectionDesc}>{t('levelDesc')}</p>
             </div>
           </div>

           {/* Fatigue Info */}
           <div className={styles.modalSection}>
             <span className={styles.modalIcon}>⚡</span>
             <div>
               <h3 className={styles.modalSectionTitle}>{t('fatigueTitle')}</h3>
               <p className={styles.modalSectionDesc}>{t('fatigueDesc')}</p>
             </div>
           </div>
        </div>

        <button 
          className={styles.modalCloseBtn}
          onClick={() => router.back()}
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
}
