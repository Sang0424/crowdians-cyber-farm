import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Sparkles, Bug, X } from 'lucide-react';

interface ResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  goldEarned: number;
}

export function ResultPopup({ isOpen, onClose, goldEarned }: ResultPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="overlay-backdrop flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm bg-card border-2 border-primary rounded-2xl overflow-hidden neon-border-strong"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 p-6 text-center">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
              
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-3" />
              </motion.div>
              
              <h3 className="font-pixel text-sm text-primary neon-text-strong">
                EXPLORATION COMPLETE!
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Gold Reward */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 p-4 bg-gold/10 border border-gold/30 rounded-xl"
              >
                <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center">
                  <Coins className="w-6 h-6 text-gold-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Found</p>
                  <p className="text-xl font-bold text-gold gold-glow">
                    +{goldEarned} Gold
                  </p>
                </div>
              </motion.div>

              {/* Monster Encounter */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 bg-destructive/10 border border-destructive/30 rounded-xl"
              >
                <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <Bug className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Encountered</p>
                  <p className="text-sm font-bold text-card-foreground">
                    Glitch Monster!
                  </p>
                </div>
              </motion.div>

              <motion.button
                onClick={onClose}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full game-btn"
              >
                COLLECT REWARDS
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
