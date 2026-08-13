import React from 'react';
import type { PieceType, PieceColor } from '../types/chess';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

export const ChessPiece: React.FC<PieceProps> = ({ type, color, className = "w-full h-full" }) => {
  const isWhite = color === 'w';
  
  const renderPiece = () => {
    switch (type) {
      case 'p':
        return (
          <svg viewBox="0 0 45 45" className={className}>
            <defs>
              <linearGradient id={`pawn-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
                <stop offset="100%" stopColor={isWhite ? '#cbd5e1' : '#0f172a'} />
              </linearGradient>
            </defs>
            <path
              d="M 22.5 9 a 4.5 4.5 0 1 1 -0.001 0.001 M 22.5 13.5 a 4.5 4.5 0 1 0 0.001 0 m 0 2 c -3.5 0 -5.5 2 -5.5 3 a 5 5 0 0 0 1 2.5 c -2 2 -3.5 5.5 -3.5 10 h 16 c 0 -4.5 -1.5 -8 -3.5 -10 a 5 5 0 0 0 1 -2.5 c 0 -1 -2 -3 -5.5 -3 z M 12 36 c 0 -2 2 -3.5 10.5 -3.5 s 10.5 1.5 10.5 3.5 Z"
              fill={`url(#pawn-grad-${color})`}
              stroke={isWhite ? '#334155' : '#000000'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'n':
        return (
          <svg viewBox="0 0 45 45" className={className}>
            <defs>
              <linearGradient id={`knight-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
                <stop offset="100%" stopColor={isWhite ? '#cbd5e1' : '#0f172a'} />
              </linearGradient>
            </defs>
            <path
              d="M 22 10 C 32.5 11 38.5 18 38 27 C 37.5 30 35 34.5 35 34.5 H 10 C 10 34.5 10.5 26.5 14 20 C 12 21 8.5 22.5 8 18 C 7.5 13 13 10.5 13 10.5 C 13 10.5 16 7 22 10 Z M 16 14 A 1.5 1.5 0 1 0 16 17 A 1.5 1.5 0 1 0 16 14 Z M 12 36 L 33 36"
              fill={`url(#knight-grad-${color})`}
              stroke={isWhite ? '#334155' : '#000000'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'b':
        return (
          <svg viewBox="0 0 45 45" className={className}>
            <defs>
              <linearGradient id={`bishop-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
                <stop offset="100%" stopColor={isWhite ? '#cbd5e1' : '#0f172a'} />
              </linearGradient>
            </defs>
            <g fill={`url(#bishop-grad-${color})`} stroke={isWhite ? '#334155' : '#000000'} strokeWidth="1.5" strokeLinejoin="round">
              <circle cx="22.5" cy="8" r="2.5" />
              <path d="M 22.5 10.5 C 16 15 14 21 14 28 C 14 31 16 33.5 22.5 33.5 C 29 33.5 31 31 31 28 C 31 21 29 15 22.5 10.5 Z" />
              <path d="M 17.5 22.5 H 27.5 M 22.5 17.5 V 27.5" strokeWidth="1" />
              <path d="M 11.5 36.5 L 33.5 36.5" />
            </g>
          </svg>
        );

      case 'r':
        return (
          <svg viewBox="0 0 45 45" className={className}>
            <defs>
              <linearGradient id={`rook-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
                <stop offset="100%" stopColor={isWhite ? '#cbd5e1' : '#0f172a'} />
              </linearGradient>
            </defs>
            <g fill={`url(#rook-grad-${color})`} stroke={isWhite ? '#334155' : '#000000'} strokeWidth="1.5" strokeLinejoin="round">
              <path d="M 12 36 L 12 32 L 14 30 L 14 17 L 11 14 L 11 9 L 16 9 L 16 12 L 20 12 L 20 9 L 25 9 L 25 12 L 29 12 L 29 9 L 34 9 L 34 14 L 31 17 L 31 30 L 33 32 L 33 36 Z" />
              <path d="M 14 30 H 31" />
            </g>
          </svg>
        );

      case 'q':
        return (
          <svg viewBox="0 0 45 45" className={className}>
            <defs>
              <linearGradient id={`queen-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
                <stop offset="100%" stopColor={isWhite ? '#cbd5e1' : '#0f172a'} />
              </linearGradient>
            </defs>
            <g fill={`url(#queen-grad-${color})`} stroke={isWhite ? '#334155' : '#000000'} strokeWidth="1.5" strokeLinejoin="round">
              <circle cx="6" cy="12" r="2" />
              <circle cx="14" cy="9" r="2" />
              <circle cx="22.5" cy="7" r="2" />
              <circle cx="31" cy="9" r="2" />
              <circle cx="39" cy="12" r="2" />
              <path d="M 6 14 L 12 28 L 22.5 15 L 33 28 L 39 14 C 39 14 35 32 35 34 H 10 C 10 34 6 14 6 14 Z" />
              <path d="M 10 36.5 L 35 36.5" />
            </g>
          </svg>
        );

      case 'k':
        return (
          <svg viewBox="0 0 45 45" className={className}>
            <defs>
              <linearGradient id={`king-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isWhite ? '#ffffff' : '#475569'} />
                <stop offset="100%" stopColor={isWhite ? '#cbd5e1' : '#0f172a'} />
              </linearGradient>
            </defs>
            <g fill={`url(#king-grad-${color})`} stroke={isWhite ? '#334155' : '#000000'} strokeWidth="1.5" strokeLinejoin="round">
              <path d="M 22.5 6 V 12 M 19.5 9 H 25.5" strokeWidth="2" strokeLinecap="round" />
              <path d="M 22.5 12 C 16 15 14 20 14 28 C 14 32 16 34 22.5 34 C 29 34 31 32 31 28 C 31 20 29 15 22.5 12 Z" />
              <path d="M 11.5 37 L 33.5 37" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center filter drop-shadow-md select-none pointer-events-none transition-transform duration-150 hover:scale-105">
      {renderPiece()}
    </div>
  );
};
