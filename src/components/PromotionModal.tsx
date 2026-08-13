import React from 'react';
import type { PieceType, PieceColor } from '../types/chess';
import { ChessPiece } from './ChessPieces';
import { soundFx } from '../services/audioService';

interface PromotionModalProps {
  color: PieceColor;
  onSelect: (piece: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  const pieces: { type: PieceType; name: string }[] = [
    { type: 'q', name: 'Queen' },
    { type: 'r', name: 'Rook' },
    { type: 'b', name: 'Bishop' },
    { type: 'n', name: 'Knight' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-indigo-500/40 text-center shadow-2xl space-y-4">
        <h3 className="text-xl font-bold text-white tracking-tight">Pawn Promotion</h3>
        <p className="text-xs text-slate-400">Choose a piece to replace your promoted pawn</p>
        
        <div className="grid grid-cols-4 gap-3 pt-2">
          {pieces.map((p) => (
            <button
              key={p.type}
              onClick={() => {
                soundFx.playClick();
                onSelect(p.type);
              }}
              className="group p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 hover:border-indigo-500 hover:bg-indigo-900/30 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 shadow-md"
            >
              <div className="w-12 h-12">
                <ChessPiece type={p.type} color={color} />
              </div>
              <span className="text-[10px] font-semibold text-slate-300 group-hover:text-indigo-300">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
