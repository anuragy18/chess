import { Chess } from 'chess.js';
import type { AIDifficulty } from '../types/chess';

// Piece Values
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece Square Tables (for White perspective, mirrored for Black)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 27, 27, 10,  5,  5,
   0,  0,  0, 25, 25,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-25,-25, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_MIDGAME_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

// Helper to evaluate static board score from White's perspective
export function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
    return 0;
  }

  let totalEvaluation = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const sqIndex = r * 8 + c;
        const flippedSqIndex = (7 - r) * 8 + c;
        let pValue = PIECE_VALUES[piece.type] || 0;
        let pstValue = 0;

        switch (piece.type) {
          case 'p':
            pstValue = piece.color === 'w' ? PAWN_TABLE[sqIndex] : PAWN_TABLE[flippedSqIndex];
            break;
          case 'n':
            pstValue = piece.color === 'w' ? KNIGHT_TABLE[sqIndex] : KNIGHT_TABLE[flippedSqIndex];
            break;
          case 'b':
            pstValue = piece.color === 'w' ? BISHOP_TABLE[sqIndex] : BISHOP_TABLE[flippedSqIndex];
            break;
          case 'r':
            pstValue = piece.color === 'w' ? ROOK_TABLE[sqIndex] : ROOK_TABLE[flippedSqIndex];
            break;
          case 'q':
            pstValue = piece.color === 'w' ? QUEEN_TABLE[sqIndex] : QUEEN_TABLE[flippedSqIndex];
            break;
          case 'k':
            pstValue = piece.color === 'w' ? KING_MIDGAME_TABLE[sqIndex] : KING_MIDGAME_TABLE[flippedSqIndex];
            break;
        }

        const fullVal = pValue + pstValue;
        totalEvaluation += piece.color === 'w' ? fullVal : -fullVal;
      }
    }
  }

  return totalEvaluation;
}

// Convert numeric board evaluation (centipawns) to formatted score for UI (e.g. +1.5 or -2.0)
export function getEvaluationFormatted(game: Chess): { scoreText: string; whiteAdvantagePct: number } {
  const evalCentipawns = evaluateBoard(game);
  if (evalCentipawns >= 90000) return { scoreText: 'M1', whiteAdvantagePct: 100 };
  if (evalCentipawns <= -90000) return { scoreText: '-M1', whiteAdvantagePct: 0 };

  const pawns = (evalCentipawns / 100).toFixed(1);
  const scoreText = evalCentipawns > 0 ? `+${pawns}` : `${pawns}`;
  
  // Calculate percentage fill for evaluation bar (0% to 100%, 50% is equal)
  const maxCap = 1000;
  const clamped = Math.max(-maxCap, Math.min(maxCap, evalCentipawns));
  const whiteAdvantagePct = 50 + (clamped / maxCap) * 45;

  return { scoreText, whiteAdvantagePct };
}

// Minimax with Alpha-Beta Pruning
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });
  moves.sort((a, b) => (b.captured ? 10 : 0) - (a.captured ? 10 : 0));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Get the best AI move for a given position & difficulty
export async function getAIMove(
  gameFen: string,
  difficulty: AIDifficulty
): Promise<{ from: string; to: string; promotion?: string }> {
  const tempGame = new Chess(gameFen);
  const moves = tempGame.moves({ verbose: true });

  if (moves.length === 0) {
    throw new Error('No legal moves available');
  }

  if (difficulty === 'easy' && Math.random() < 0.35) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return {
      from: randomMove.from,
      to: randomMove.to,
      promotion: randomMove.promotion,
    };
  }

  let searchDepth = 1;
  switch (difficulty) {
    case 'easy':
      searchDepth = 1;
      break;
    case 'medium':
      searchDepth = 2;
      break;
    case 'hard':
      searchDepth = 3;
      break;
    case 'expert':
      searchDepth = 4;
      break;
  }

  const isAIWhite = tempGame.turn() === 'w';
  let bestMove = moves[0];
  let bestValue = isAIWhite ? -Infinity : Infinity;

  moves.sort((a, b) => (b.captured ? 10 : 0) - (a.captured ? 10 : 0));

  for (const move of moves) {
    tempGame.move(move);
    const boardVal = minimax(
      tempGame,
      searchDepth - 1,
      -Infinity,
      Infinity,
      !isAIWhite
    );
    tempGame.undo();

    if (isAIWhite) {
      if (boardVal > bestValue) {
        bestValue = boardVal;
        bestMove = move;
      }
    } else {
      if (boardVal < bestValue) {
        bestValue = boardVal;
        bestMove = move;
      }
    }
  }

  const delay = 200 + Math.random() * 300;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return {
    from: bestMove.from,
    to: bestMove.to,
    promotion: bestMove.promotion,
  };
}
