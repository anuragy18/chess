import React, { useRef, useEffect } from 'react';
import type { MoveRecord } from '../types/chess';
import { Download, ScrollText } from 'lucide-react';
import { soundFx } from '../services/audioService';

interface MoveHistoryProps {
  history: MoveRecord[];
  onExportPGN: () => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ history, onExportPGN }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const pairedMoves: { moveNumber: number; white?: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    pairedMoves.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col h-full min-h-[220px]">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <ScrollText className="w-4 h-4 text-indigo-400" />
          Move Notation Log
        </div>
        <button
          onClick={() => { soundFx.playClick(); onExportPGN(); }}
          title="Export PGN File"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all text-xs flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          PGN
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
        {pairedMoves.length === 0 ? (
          <div className="text-slate-500 text-center py-6 italic">No moves played yet</div>
        ) : (
          pairedMoves.map((pair) => (
            <div key={pair.moveNumber} className="grid grid-cols-7 py-1 px-2 rounded hover:bg-slate-800/40 text-slate-300">
              <span className="col-span-1 text-slate-500 font-semibold">{pair.moveNumber}.</span>
              <span className="col-span-3 text-slate-100 font-medium">{pair.white?.san || ''}</span>
              <span className="col-span-3 text-slate-400">{pair.black?.san || ''}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
