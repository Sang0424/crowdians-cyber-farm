import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bot } from 'lucide-react';
import { ChatMessage } from '@/types/game';

interface ChatLogOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export function ChatLogOverlay({ isOpen, onClose, messages }: ChatLogOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="overlay-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-4 top-20 bottom-24 bg-card/95 rounded-2xl border-2 border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-pixel text-xs text-primary neon-text">CHAT LOG</h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100%-60px)]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Bot className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Start chatting with your AI!</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-4 py-2 rounded-xl text-sm ${
                        message.role === 'user'
                          ? 'bg-accent/20 text-card-foreground'
                          : 'bg-muted text-card-foreground'
                      }`}>
                        {message.content}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
