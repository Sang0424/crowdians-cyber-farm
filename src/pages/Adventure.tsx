import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Clock, Zap, MapPin, Timer } from 'lucide-react';
import { ResultPopup } from '@/components/adventure/ResultPopup';
import { useGame } from '@/contexts/GameContext';

export default function Adventure() {
  const { 
    gameState, 
    startExploration, 
    finishExploration, 
    setExplorationTime,
    addGold 
  } = useGame();
  
  const [showResult, setShowResult] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isExploring && gameState.explorationTimeLeft > 0) {
      interval = setInterval(() => {
        setExplorationTime(gameState.explorationTimeLeft - 1);
      }, 1000);
    } else if (gameState.isExploring && gameState.explorationTimeLeft === 0) {
      finishExploration();
      addGold(100);
      setShowResult(true);
    }

    return () => clearInterval(interval);
  }, [gameState.isExploring, gameState.explorationTimeLeft, finishExploration, setExplorationTime, addGold]);

  const handleStartExploration = () => {
    startExploration();
  };

  const progress = gameState.isExploring 
    ? ((5 - gameState.explorationTimeLeft) / 5) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="font-pixel text-xs sm:text-sm text-primary neon-text mb-1">
          ADVENTURE ZONE
        </h2>
        <p className="text-muted-foreground text-xs">
          Send your AI to explore and gather resources
        </p>
      </div>

      {/* Character Status Card */}
      <motion.div 
        className="game-card space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center text-4xl animate-float">
              👾
            </div>
            <div>
              <p className="font-pixel text-xs text-primary">AI BUDDY</p>
              <p className="text-xs text-muted-foreground">Level {gameState.level} Explorer</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-pixel ${
            gameState.isExploring 
              ? 'bg-accent/20 text-accent animate-pulse' 
              : 'bg-primary/20 text-primary'
          }`}>
            {gameState.isExploring ? 'EXPLORING' : 'READY'}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-xl p-3 text-center">
            <Zap className="w-5 h-5 text-exp mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Energy</p>
            <p className="text-sm font-bold text-card-foreground">100%</p>
          </div>
          <div className="bg-muted rounded-xl p-3 text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-bold text-card-foreground">Grid-7</p>
          </div>
          <div className="bg-muted rounded-xl p-3 text-center">
            <Timer className="w-5 h-5 text-gold mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Missions</p>
            <p className="text-sm font-bold text-card-foreground">5</p>
          </div>
        </div>
      </motion.div>

      {/* Exploration Status */}
      {gameState.isExploring && (
        <motion.div 
          className="game-card neon-border space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm text-card-foreground">Exploring...</span>
            </div>
            <span className="font-pixel text-sm text-accent">
              {gameState.explorationTimeLeft}s
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Your AI is searching for treasures in the cyber realm...
          </p>
        </motion.div>
      )}

      {/* Start Exploration Button */}
      <motion.button
        onClick={handleStartExploration}
        disabled={gameState.isExploring}
        whileHover={{ scale: gameState.isExploring ? 1 : 1.02 }}
        whileTap={{ scale: gameState.isExploring ? 1 : 0.98 }}
        className="w-full game-btn py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Compass className={`w-6 h-6 ${gameState.isExploring ? '' : 'animate-pulse'}`} />
        <span className="text-sm">
          {gameState.isExploring ? 'EXPLORING...' : 'START EXPLORATION'}
        </span>
      </motion.button>

      {/* Info Card */}
      <motion.div 
        className="game-card bg-muted/50 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-pixel text-muted-foreground">HOW IT WORKS</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Send your AI on expeditions (5 seconds demo)</li>
          <li>• Discover Gold and rare encounters</li>
          <li>• Level up to unlock new areas</li>
        </ul>
      </motion.div>

      {/* Result Popup */}
      <ResultPopup
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        goldEarned={100}
      />
    </div>
  );
}
