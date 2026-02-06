import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Coins } from 'lucide-react';
import { VoteItem } from '@/types/game';

interface VoteCardProps {
  vote: VoteItem;
  onVote: (voteId: string, choice: 'A' | 'B') => void;
}

export function VoteCard({ vote, onVote }: VoteCardProps) {
  const [selected, setSelected] = useState<'A' | 'B' | null>(null);

  const handleVote = () => {
    if (selected && !vote.isCompleted) {
      onVote(vote.id, selected);
    }
  };

  if (vote.isCompleted) {
    return (
      <div className="game-card opacity-60">
        <div className="flex items-center gap-2 mb-4">
          <Check className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <p className="text-sm text-card-foreground">{vote.question}</p>
      </div>
    );
  }

  return (
    <div className="game-card space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-card-foreground font-medium flex-1">{vote.question}</p>
        <span className="text-[10px] font-pixel text-gold shrink-0 ml-2">+10 GOLD</span>
      </div>

      <div className="space-y-3">
        {/* Option A */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setSelected('A')}
          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
            selected === 'A'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              selected === 'A' ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {selected === 'A' && <Circle className="w-2 h-2 fill-primary-foreground text-primary-foreground" />}
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Answer A:</span>
              <p className="text-sm text-card-foreground">{vote.answerA}</p>
            </div>
          </div>
        </motion.div>

        {/* Option B */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setSelected('B')}
          className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
            selected === 'B'
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
              selected === 'B' ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {selected === 'B' && <Circle className="w-2 h-2 fill-primary-foreground text-primary-foreground" />}
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Answer B:</span>
              <p className="text-sm text-card-foreground">{vote.answerB}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={handleVote}
        disabled={!selected}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full game-btn-secondary disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Coins className="w-4 h-4" />
        <span>Submit Vote</span>
      </motion.button>
    </div>
  );
}
