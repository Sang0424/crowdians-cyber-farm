import { motion } from 'framer-motion';

export function PixelCharacter() {
  return (
    <motion.div
      className="character-stage"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative">
        {/* Glow effect behind character */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
        
        {/* Character container */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
          {/* Character body - pixel art style */}
          <div className="relative text-7xl sm:text-8xl select-none rounded-2xl p-4">
            <img src="/black-red-egg.gif" alt="Character" />
          </div>
        </div>
        
        {/* Status indicator */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="font-pixel text-[8px] text-primary">ONLINE</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
