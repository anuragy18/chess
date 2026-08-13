import React from 'react';
import type { CapturedPiecesState, PieceColor } from '../types/chess';
import { ChessPiece } from './ChessPieces';

interface CapturedPiecesProps {
  captured: CapturedPiecesState;
  forColor: PieceColor; // 'w' means white's panel (showing black pieces captured by white)
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ captured, forColor }) => {
  const isWhite = forColor === 'w';
  const pieces = isWhite ? captured.white : captured.black; // pieces captured by this color
  const capturedColor: PieceColor = isWhite ? 'b' : 'w';

  // Group pieces for clean display
  const pieceCounts: Record<string, number> = {};
  pieces.forEach((p) => {
    pieceCounts[p] = (pieceCounts[p] || 0) + 1;
  });

  const diffScore = isWhite ? captured.advantage : -captured.advantage;

  return (
    <div className="flex items-center gap-2 min-h-[32px] px-2 py-1 rounded-xl bg-slate-900/40 border border-slate-800/60">
      <div className="flex items-center gap-1 overflow-x-auto max-w-[220px] sm:max-w-[300px]">
        {Object.entries(pieceCounts).map(([type, count]) => (
          <div key={type} className="flex items-center text-xs text-slate-300 font-semibold">
            <div className="w-5 h-5 inline-block">
              <ChessPiece type={type as any} color={capturedColor} />
            </div>
            {count > 1 && <span className="text-[10px] text-slate-400 ml-0.5">×{count}</span>}
          </div>
        ))}
        {pieces.length === 0 && (
          <span className="text-[11px] text-slate-500 italic">No captures yet</span>
        )}
      </div>

      {diffScore > 0 && (
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
          +{diffScore}
        </span>
      )}
    </div>
  );
};
