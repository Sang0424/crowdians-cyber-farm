import styles from './ActionModal.module.scss'

// ── ActionModal ──
interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: React.ReactNode
  description?: React.ReactNode
  subDescription?: React.ReactNode
  subDescColor?: string
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  isDanger?: boolean
  children?: React.ReactNode
}

export default function ActionModal({
  isOpen,
  onClose,
  title,
  icon,
  description,
  subDescription,
  subDescColor = 'var(--text-sub)',
  cancelText,
  confirmText,
  onConfirm,
  isDanger = false,
  children,
}: ActionModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{title}</h2>

        {(icon || description) && (
          <div className={styles.modalSection}>
            {icon && <span className={styles.modalIcon}>{icon}</span>}
            <div>
              {description && <p className={styles.modalSectionDesc}>{description}</p>}
              {subDescription && (
                <p
                  className={styles.modalSectionDesc}
                  style={{ color: subDescColor, marginTop: 4, fontSize: 12 }}
                >
                  {subDescription}
                </p>
              )}
            </div>
          </div>
        )}

        {children}

        {(cancelText || confirmText) && (
          <div className={styles.modalButtons}>
            {cancelText && (
              <button className={styles.cancelBtn} onClick={onClose}>
                {cancelText}
              </button>
            )}
            {confirmText && onConfirm && (
              <button
                className={isDanger ? styles.confirmBtnDanger : styles.confirmBtn}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
