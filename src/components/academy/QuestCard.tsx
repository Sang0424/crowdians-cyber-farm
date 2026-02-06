import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { QuestItem } from '@/types/game';

interface QuestCardProps {
  quest: QuestItem;
  onClick: () => void;
}

export function QuestCard({ quest, onClick }: QuestCardProps) {
  return (
    <motion.div
      whileHover={{ scale: quest.isCompleted ? 1 : 1.02 }}
      whileTap={{ scale: quest.isCompleted ? 1 : 0.98 }}
      onClick={quest.isCompleted ? undefined : onClick}
      className={`game-card-hover cursor-pointer ${quest.isCompleted ? 'opacity-60 cursor-default' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          quest.isCompleted 
            ? 'bg-primary/20 text-primary' 
            : 'bg-destructive/20 text-destructive'
        }`}>
          {quest.isCompleted ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Question:</p>
          <p className="text-sm text-card-foreground font-medium mb-2 truncate">
            {quest.question}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">AI said:</span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              quest.isCompleted 
                ? 'bg-muted text-muted-foreground line-through' 
                : 'bg-destructive/20 text-destructive'
            }`}>
              {quest.wrongAnswer}
            </span>
          </div>
        </div>

        {!quest.isCompleted && (
          <div className="shrink-0">
            <span className="text-[10px] font-pixel text-primary">+50 EXP</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
