import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage, GameState, QuestItem, VoteItem } from '@/types/game';

interface GameContextType {
  gameState: GameState;
  chatHistory: ChatMessage[];
  quests: QuestItem[];
  votes: VoteItem[];
  addGold: (amount: number) => void;
  addExp: (amount: number) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  completeQuest: (questId: string) => void;
  completeVote: (voteId: string) => void;
  startExploration: () => void;
  finishExploration: () => void;
  setExplorationTime: (time: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Mock data
const initialQuests: QuestItem[] = [
  { id: '1', question: 'What is 1+1?', wrongAnswer: '11', isCompleted: false },
  { id: '2', question: 'What color is the sky?', wrongAnswer: 'Green', isCompleted: false },
  { id: '3', question: 'How many legs does a dog have?', wrongAnswer: '6', isCompleted: false },
];

const initialVotes: VoteItem[] = [
  { id: '1', question: 'What is the best programming language?', answerA: 'Python is versatile and beginner-friendly', answerB: 'JavaScript runs everywhere', isCompleted: false },
  { id: '2', question: 'How to make coffee?', answerA: 'Boil water, add coffee grounds, strain', answerB: 'Put coffee in microwave', isCompleted: false },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    gold: 1500,
    exp: 750,
    level: 3,
    isExploring: false,
    explorationTimeLeft: 0,
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [quests, setQuests] = useState<QuestItem[]>(initialQuests);
  const [votes, setVotes] = useState<VoteItem[]>(initialVotes);

  const addGold = (amount: number) => {
    setGameState(prev => ({ ...prev, gold: prev.gold + amount }));
  };

  const addExp = (amount: number) => {
    setGameState(prev => {
      const newExp = prev.exp + amount;
      const expPerLevel = 500;
      const newLevel = Math.floor(newExp / expPerLevel) + 1;
      return { ...prev, exp: newExp, level: newLevel };
    });
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, isCompleted: true } : q
    ));
    addExp(50);
  };

  const completeVote = (voteId: string) => {
    setVotes(prev => prev.map(v => 
      v.id === voteId ? { ...v, isCompleted: true } : v
    ));
    addGold(10);
  };

  const startExploration = () => {
    setGameState(prev => ({ ...prev, isExploring: true, explorationTimeLeft: 5 }));
  };

  const finishExploration = () => {
    setGameState(prev => ({ ...prev, isExploring: false, explorationTimeLeft: 0 }));
  };

  const setExplorationTime = (time: number) => {
    setGameState(prev => ({ ...prev, explorationTimeLeft: time }));
  };

  return (
    <GameContext.Provider value={{
      gameState,
      chatHistory,
      quests,
      votes,
      addGold,
      addExp,
      addChatMessage,
      completeQuest,
      completeVote,
      startExploration,
      finishExploration,
      setExplorationTime,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
