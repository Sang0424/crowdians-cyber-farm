import { useState, useEffect } from 'react';
import { ScrollText } from 'lucide-react';
import { motion } from 'framer-motion';
import { PixelCharacter } from '@/components/home/PixelCharacter';
import { SpeechBubble } from '@/components/home/SpeechBubble';
import { ChatInput } from '@/components/home/ChatInput';
import { ChatLogOverlay } from '@/components/home/ChatLogOverlay';
import { useGame } from '@/contexts/GameContext';

// Mock AI responses
const aiResponses = [
  "Beep boop! I'm learning new things every day thanks to you!",
  "Did you know? I processed 1,000 training samples today!",
  "Error 404: Joke not found. Just kidding! How can I help?",
  "My neural pathways are tingling... That was a good question!",
  "Processing... Processing... Ah yes, I understand now!",
  "I'm getting smarter by the minute. Thank you, trainer!",
];

export default function Home() {
  const { chatHistory, addChatMessage } = useGame();
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const handleSendMessage = (message: string) => {
    // Add user message
    addChatMessage({ role: 'user', content: message });
    
    // Generate AI response
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    // Show AI response after a brief delay
    setTimeout(() => {
      addChatMessage({ role: 'ai', content: randomResponse });
      setCurrentMessage(randomResponse);
      setShowBubble(true);
    }, 500);
  };

  // Auto-hide speech bubble after 3 seconds
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => {
        setShowBubble(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showBubble, currentMessage]);

  return (
    <div className="relative h-[calc(100vh-8rem)] flex flex-col">
      {/* Log button */}
      <motion.button
        onClick={() => setShowLog(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-0 right-0 z-20 w-10 h-10 flex items-center justify-center bg-card border-2 border-border rounded-xl hover:border-primary transition-colors"
      >
        <ScrollText className="w-5 h-5 text-muted-foreground" />
      </motion.button>

      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="font-pixel text-xs sm:text-sm text-primary neon-text mb-1">
          SERVER ROOM
        </h2>
        <p className="text-muted-foreground text-xs">
          Chat with your AI companion
        </p>
      </div>

      {/* Character and Speech Bubble Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 pb-20">
        <SpeechBubble message={currentMessage} isVisible={showBubble} />
        <PixelCharacter />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleSendMessage} />

      {/* Chat Log Overlay */}
      <ChatLogOverlay
        isOpen={showLog}
        onClose={() => setShowLog(false)}
        messages={chatHistory}
      />
    </div>
  );
}
