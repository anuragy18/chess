export type GameMode = 'friend' | 'ai' | 'puzzle' | 'opening' | 'profile' | 'leaderboard';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type BoardTheme = 'classic' | 'wood' | 'onyx' | 'cyber';

export type PieceColor = 'w' | 'b';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface MoveRecord {
  from: string;
  to: string;
  piece: PieceType;
  color: PieceColor;
  captured?: PieceType;
  promotion?: PieceType;
  san: string;
  fen: string;
  timeTaken?: number;
}

export interface PlayerTimer {
  white: number; // in seconds
  black: number; // in seconds
  initial: number; // initial time in minutes
  increment: number; // bonus per move in seconds
  activeColor: PieceColor;
  isRunning: boolean;
}

export interface CapturedPiecesState {
  white: PieceType[]; // pieces captured by white (black's lost pieces)
  black: PieceType[]; // pieces captured by black (white's lost pieces)
  advantage: number; // material score differential (+ score means white advantage)
}

export interface GameStats {
  totalPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  puzzlesSolved: number;
  highestRating: number;
  currentRating: number;
  streak: number;
  aiWins: Record<AIDifficulty, number>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ChessPuzzle {
  id: string;
  title: string;
  rating: number;
  fen: string;
  solutionMoves: string[]; // e.g. ["e2e4", "e7e5"] or SAN ["Qxf7#"]
  description: string;
  category: 'Mate in 1' | 'Mate in 2' | 'Fork' | 'Pin' | 'Skewer' | 'Endgame';
  hint: string;
}

export interface ChessOpening {
  id: string;
  name: string;
  eco: string;
  fen: string;
  moves: string[];
  description: string;
  keyConcepts: string[];
  difficulty: 'Beginner' | 'Intermediate';
}

export interface UserProfile {
  username: string;
  avatar: string;
  rating: number;
  stats: GameStats;
  achievements: Achievement[];
  boardTheme: BoardTheme;
  soundEnabled: boolean;
  autoFlip: boolean;
  showMoveHints: boolean;
}
