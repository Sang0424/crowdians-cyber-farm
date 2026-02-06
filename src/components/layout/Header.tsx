import { Coins, Zap } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';

export function Header() {
  const { gameState } = useGame();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b-2 border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-pixel text-xs sm:text-sm text-primary neon-text">
          CROWDIANS
        </h1>
        
        <div className="flex items-center gap-3">
          <motion.div 
            className="stat-badge-gold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coins className="w-4 h-4" />
            <span className="font-bold">{gameState.gold.toLocaleString()}</span>
          </motion.div>
          
          <motion.div 
            className="stat-badge-exp"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-4 h-4" />
            <span className="font-bold">Lv.{gameState.level}</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
