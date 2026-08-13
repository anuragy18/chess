import type { ChessOpening } from '../types/chess';

export const CHESS_OPENINGS: ChessOpening[] = [
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (Spanish Opening)',
    eco: 'C60',
    fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: 'One of the oldest and most respected chess openings. White puts immediate pressure on Black\'s c6 knight defending the central e5 pawn.',
    keyConcepts: [
      'Controls central e4 & d4 squares',
      'Pins the Nc6 defender',
      'Prepares rapid kingside castling'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    eco: 'B20',
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
    moves: ['e4', 'c5'],
    description: 'The most popular counter-attacking response against 1.e4. Black fights for the center from the c-file, leading to dynamic, asymmetrical battles.',
    keyConcepts: [
      'Asymmetrical pawn structure',
      'Fights for central control using c5',
      'High winning chances for Black'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'queens-gambit',
    name: 'Queen\'s Gambit',
    eco: 'D06',
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    moves: ['d4', 'd5', 'c4'],
    description: 'A classical initiative where White offers the c4 pawn to gain complete dominance over the center with d4 and e4.',
    keyConcepts: [
      'Temporary pawn sacrifice for central dominance',
      'Develops queen-side knights and bishops effortlessly',
      'Solid position for White'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 'italian-game',
    name: 'Italian Game (Giuoco Piano)',
    eco: 'C50',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    description: 'A classic opening aiming directly at Black\'s f7 square. Ideal for beginners learning rapid piece development and king safety.',
    keyConcepts: [
      'Targets the weak f7 pawn',
      'Rapid piece development',
      'Clear, intuitive tactical play'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 'french-defense',
    name: 'French Defense',
    eco: 'C00',
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    moves: ['e4', 'e6', 'd4', 'd5'],
    description: 'A resilient defense where Black builds a solid pawn wall on e6 and d5, counter-attacking White\'s center with c5 later.',
    keyConcepts: [
      'Solid pawn structure',
      'Counter-attack against d4 with c5',
      'Closed positions requiring patient maneuver'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'caro-kann',
    name: 'Caro-Kann Defense',
    eco: 'B10',
    fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    moves: ['e4', 'c6', 'd4', 'd5'],
    description: 'Extremely solid defense. Black prepares d5 with c6, avoiding closing in the light-squared bishop unlike the French Defense.',
    keyConcepts: [
      'Light-squared bishop remains active',
      'Extremely solid and hard to breach',
      'Strong pawn chain'
    ],
    difficulty: 'Beginner'
  }
];
