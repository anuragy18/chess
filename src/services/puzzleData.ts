import type { ChessPuzzle } from '../types/chess';

export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    id: 'puz-1',
    title: 'Scholar\'s Smothered Mate',
    rating: 900,
    category: 'Mate in 1',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5',
    solutionMoves: ['f3f7'],
    description: 'White to move and deliver checkmate in 1 move.',
    hint: 'Target the weak f7 pawn protected only by the Black King!'
  },
  {
    id: 'puz-2',
    title: 'Royal Knight Fork',
    rating: 1100,
    category: 'Fork',
    fen: 'r1b1k2r/pppp1ppp/5n2/4q3/4N3/8/PPP2PPP/R1BQKB1R w KQkq - 0 8',
    solutionMoves: ['e4d6'],
    description: 'White to move. Discover a double attack against King and Queen.',
    hint: 'Move the knight to a square checking the King while threatening the Queen!'
  },
  {
    id: 'puz-3',
    title: 'Back Rank Blaster',
    rating: 1250,
    category: 'Mate in 1',
    fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    solutionMoves: ['d1d8'],
    description: 'White to move. Take advantage of Black\'s trapped King.',
    hint: 'Deliver a back-rank rook checkmate!'
  },
  {
    id: 'puz-4',
    title: 'Queen Skewer',
    rating: 1350,
    category: 'Skewer',
    fen: '6k1/5p2/4q1p1/8/3B4/8/1K6/7R w - - 0 1',
    solutionMoves: ['h1h8'],
    description: 'White to move and deliver a devastating checkmate or skewer.',
    hint: 'Infiltrate the h-file with your Rook!'
  },
  {
    id: 'puz-5',
    title: 'Greek Gift Sacrifice',
    rating: 1500,
    category: 'Mate in 2',
    fen: 'r1bq1rk1/ppp2ppp/2n1p3/3p4/2PPn3/2P1PN2/PB2BPPP/R2Q1RK1 w - - 0 1',
    solutionMoves: ['e2bd3', 'f7f5'],
    description: 'White to move. Prepare a classic kingside assault.',
    hint: 'Consolidate your bishop pair pointing towards the enemy king!'
  },
  {
    id: 'puz-6',
    title: 'Deadly Pin',
    rating: 1200,
    category: 'Pin',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 5',
    solutionMoves: ['c1g5'],
    description: 'White to move. Pin the enemy knight to the queen.',
    hint: 'Develop your dark-squared bishop to g5!'
  },
  {
    id: 'puz-7',
    title: 'Pawn Promotion Rush',
    rating: 1400,
    category: 'Endgame',
    fen: '8/4k3/8/3P4/8/8/4K3/8 w - - 0 1',
    solutionMoves: ['e2e3', 'e7e6', 'e3e4'],
    description: 'White to move. Advance your King to support your passed pawn.',
    hint: 'Take opposition with your king before pushing the passed pawn!'
  },
  {
    id: 'puz-8',
    title: 'Smothered Mate in 2',
    rating: 1650,
    category: 'Mate in 2',
    fen: '6rk/5Npp/8/8/8/8/8/6K1 w - - 0 1',
    solutionMoves: ['f7h6', 'g8h8'],
    description: 'White to move. Execute the famous knight smothered checkmate pattern.',
    hint: 'Deliver a double check using knight and queen!'
  }
];
