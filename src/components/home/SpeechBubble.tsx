import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  message: string | null;
  isVisible: boolean;
}

export function SpeechBubble({ message, isVisible }: SpeechBubbleProps) {
  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="speech-bubble max-w-xs sm:max-w-sm mx-auto"
        >
          <p className="text-card-foreground text-sm leading-relaxed">
            {message}
          </p>
          
          {/* Typing cursor effect on new messages */}
          <motion.span
            className="inline-block w-2 h-4 bg-primary ml-1 animate-blink"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
