import React from 'react';
import type { PlayerTimer, PieceColor, BoardTheme } from '../types/chess';
import { RotateCcw, FlipHorizontal, Flag, RefreshCw, Handshake, Palette } from 'lucide-react';
import { soundFx } from '../services/audioService';

interface GameControlsProps {
  timer: PlayerTimer;
  activeColor: PieceColor;
  onUndo: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
  onDrawOffer: () => void;
  onRestart: () => void;
  currentTheme: BoardTheme;
  onChangeTheme: (theme: BoardTheme) => void;
  isAiMode: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  timer,
  activeColor,
  onUndo,
  onFlipBoard,
  onResign,
  onDrawOffer,
  onRestart,
  currentTheme,
  onChangeTheme,
  isAiMode,
}) => {
  const formatTime = (seconds: number): string => {
    if (seconds <= 0 && timer.initial === 0) return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const themes: { id: BoardTheme; name: string }[] = [
    { id: 'wood', name: 'Royal Wood' },
    { id: 'onyx', name: 'Onyx Glass' },
    { id: 'cyber', name: 'Neon Cyber' },
    { id: 'classic', name: 'Classic' },
  ];

  return (
    <div className="space-y-4">
      {timer.initial > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              activeColor === 'b' && timer.isRunning
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700" />
              <span className="text-xs font-bold text-slate-300">Black</span>
            </div>
            <span
              className={`font-mono font-extrabold text-lg sm:text-xl ${
                timer.black < 30 ? 'text-rose-400 animate-pulse' : 'text-slate-100'
              }`}
            >
              {formatTime(timer.black)}
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
              activeColor === 'w' && timer.isRunning
                ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border border-slate-300" />
              <span className="text-xs font-bold text-slate-300">White</span>
            </div>
            <span
              className={`font-mono font-extrabold text-lg sm:text-xl ${
                timer.white < 30 ? 'text-rose-400 animate-pulse' : 'text-slate-100'
              }`}
            >
              {formatTime(timer.white)}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => { soundFx.playClick(); onUndo(); }}
          title="Undo Move"
          className="p-3 rounded-xl glass-button-secondary text-slate-200 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold"
        >
          <RotateCcw className="w-4 h-4 text-indigo-400" />
          Undo
        </button>

        <button
          onClick={() => { soundFx.playClick(); onFlipBoard(); }}
          title="Flip Perspective"
          className="p-3 rounded-xl glass-button-secondary text-slate-200 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold"
        >
          <FlipHorizontal className="w-4 h-4 text-emerald-400" />
          Flip
        </button>

        {!isAiMode && (
          <button
            onClick={() => { soundFx.playClick(); onDrawOffer(); }}
            title="Offer Draw"
            className="p-3 rounded-xl glass-button-secondary text-slate-200 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold"
          >
            <Handshake className="w-4 h-4 text-amber-400" />
            Draw
          </button>
        )}

        <button
          onClick={() => { soundFx.playClick(); onResign(); }}
          title="Resign Match"
          className="p-3 rounded-xl glass-button-secondary text-slate-200 hover:text-rose-400 flex flex-col items-center gap-1 text-[10px] font-semibold"
        >
          <Flag className="w-4 h-4 text-rose-400" />
          Resign
        </button>

        <button
          onClick={() => { soundFx.playClick(); onRestart(); }}
          title="Restart Game"
          className="p-3 rounded-xl glass-button-secondary text-slate-200 hover:text-white flex flex-col items-center gap-1 text-[10px] font-semibold col-span-1"
        >
          <RefreshCw className="w-4 h-4 text-sky-400" />
          New
        </button>
      </div>

      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
          <Palette className="w-3.5 h-3.5 text-indigo-400" /> Board Theme
        </div>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => { soundFx.playClick(); onChangeTheme(t.id); }}
              className={`py-1.5 px-2 rounded-lg text-center text-xs font-medium transition-all ${
                currentTheme === t.id
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
