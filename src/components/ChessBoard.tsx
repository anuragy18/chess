import React, { useState } from 'react';
import { Chess, type Square } from 'chess.js';
import type { BoardTheme } from '../types/chess';
import { ChessPiece } from './ChessPieces';

interface ChessBoardProps {
  game: Chess;
  onMakeMove: (from: Square, to: Square) => boolean;
  isFlipped: boolean;
  boardTheme: BoardTheme;
  showHints: boolean;
  isCheck: boolean;
  kingCheckSquare: Square | null;
  disabled?: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  onMakeMove,
  isFlipped,
  boardTheme,
  showHints,
  isCheck,
  kingCheckSquare,
  disabled = false,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  // Last move highlights
  const history = game.history({ verbose: true });
  const lastMove = history.length > 0 ? history[history.length - 1] : null;

  // Board square theme color classes
  const getSquareColorClass = (isLight: boolean): string => {
    switch (boardTheme) {
      case 'wood':
        return isLight ? 'bg-[#f0d9b5] text-[#b58863]' : 'bg-[#b58863] text-[#f0d9b5]';
      case 'onyx':
        return isLight ? 'bg-[#384454] text-[#1e293b]' : 'bg-[#1e293b] text-[#384454]';
      case 'cyber':
        return isLight ? 'bg-[#3730a3] text-[#1e1b4b]' : 'bg-[#1e1b4b] text-[#3730a3]';
      case 'classic':
      default:
        return isLight ? 'bg-[#eeeed2] text-[#769656]' : 'bg-[#769656] text-[#eeeed2]';
    }
  };

  // Ranks (1-8) and Files (a-h)
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  const handleSquareClick = (sq: Square) => {
    if (disabled) return;

    if (selectedSquare === sq) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (selectedSquare && legalMoves.includes(sq)) {
      onMakeMove(selectedSquare, sq);
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const piece = game.get(sq);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(sq);
      const moves = game.moves({ square: sq, verbose: true });
      setLegalMoves(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleDragStart = (e: React.DragEvent, sq: Square) => {
    if (disabled) return;
    const piece = game.get(sq);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }

    setDraggedSquare(sq);
    setSelectedSquare(sq);
    const moves = game.moves({ square: sq, verbose: true });
    setLegalMoves(moves.map((m) => m.to));

    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSq: Square) => {
    e.preventDefault();
    if (disabled || !draggedSquare) return;

    if (legalMoves.includes(targetSq)) {
      onMakeMove(draggedSquare, targetSq);
    }
    setDraggedSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  return (
    <div className="w-full aspect-square max-w-[560px] mx-auto rounded-3xl overflow-hidden shadow-2xl chess-board-wrapper border border-slate-700/60 p-2 sm:p-3 glass-panel">
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-2xl overflow-hidden relative chess-board-inner border border-slate-900/80">
        
        {displayRanks.map((rank, rIdx) =>
          displayFiles.map((file, fIdx) => {
            const square = `${file}${rank}` as Square;
            const isLight = (rIdx + fIdx) % 2 === 0;
            const piece = game.get(square);
            
            const isSelected = selectedSquare === square;
            const isLegalTarget = showHints && legalMoves.includes(square);
            const isLastMoveOrigin = lastMove?.from === square;
            const isLastMoveTarget = lastMove?.to === square;
            const isKingInCheck = isCheck && kingCheckSquare === square;

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                className={`relative w-full h-full flex items-center justify-center cursor-pointer select-none transition-colors duration-150 ${getSquareColorClass(
                  isLight
                )} ${isSelected ? 'ring-4 ring-amber-400 inset-0 z-10' : ''} ${
                  isLastMoveOrigin || isLastMoveTarget ? 'bg-indigo-500/40' : ''
                } ${isKingInCheck ? 'check-square' : ''}`}
              >
                {fIdx === 0 && (
                  <span className="absolute top-1 left-1.5 text-[9px] font-extrabold opacity-60">
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span className="absolute bottom-1 right-1.5 text-[9px] font-extrabold opacity-60">
                    {file}
                  </span>
                )}

                {isLegalTarget && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    {piece ? (
                      <div className="w-full h-full rounded-full border-4 border-amber-400/80 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-amber-400/80 shadow-md shadow-amber-400/50" />
                    )}
                  </div>
                )}

                {piece && (
                  <div
                    draggable={!disabled && piece.color === game.turn()}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className="w-[85%] h-[85%] z-10 active:scale-110 active:cursor-grabbing transition-transform duration-100"
                  >
                    <ChessPiece type={piece.type} color={piece.color} />
                  </div>
                )}

              </div>
            );
          })
        )}

      </div>
    </div>
  );
};
