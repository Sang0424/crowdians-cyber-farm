import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-20 left-0 right-0 z-30 px-4 pb-2">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 bg-card border-2 border-border rounded-xl p-2 neon-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message to your AI..."
            disabled={disabled}
            className="flex-1 bg-transparent text-card-foreground placeholder:text-muted-foreground px-3 py-2 text-sm focus:outline-none"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </form>
  );
}
