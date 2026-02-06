export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface QuestItem {
  id: string;
  question: string;
  wrongAnswer: string;
  isCompleted: boolean;
}

export interface VoteItem {
  id: string;
  question: string;
  answerA: string;
  answerB: string;
  isCompleted: boolean;
}

export interface GameState {
  gold: number;
  exp: number;
  level: number;
  isExploring: boolean;
  explorationTimeLeft: number;
}
