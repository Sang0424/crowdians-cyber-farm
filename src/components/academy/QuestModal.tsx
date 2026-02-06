import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { QuestItem } from '@/types/game';

interface QuestModalProps {
  quest: QuestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questId: string, answer: string) => void;
}

export function QuestModal({ quest, isOpen, onClose, onSubmit }: QuestModalProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quest && answer.trim()) {
      onSubmit(quest.id, answer.trim());
      setAnswer('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && quest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="overlay-backdrop flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-card border-2 border-border rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-pixel text-xs text-primary">TEACH AI</h3>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Question:</p>
                <p className="text-card-foreground font-medium">{quest.question}</p>
              </div>

              <div className="game-card bg-destructive/10 border-destructive/30">
                <p className="text-xs text-destructive mb-1">Wrong Answer:</p>
                <p className="text-card-foreground line-through">{quest.wrongAnswer}</p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Your Correct Answer:
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type the correct answer..."
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-xl text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
              </div>

              <motion.button
                type="submit"
                disabled={!answer.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full game-btn disabled:opacity-50"
              >
                Submit (+50 EXP)
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
