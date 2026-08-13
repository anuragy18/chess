import React from 'react';

interface EvalBarProps {
  scoreText: string;
  whiteAdvantagePct: number; // 0 to 100
  isFlipped: boolean;
}

export const EvalBar: React.FC<EvalBarProps> = ({ scoreText, whiteAdvantagePct, isFlipped }) => {
  // Clamped percentage
  const pct = Math.max(5, Math.min(95, whiteAdvantagePct));

  return (
    <div className="w-4 h-full min-h-[300px] lg:min-h-[480px] bg-slate-900 rounded-full border border-slate-800 flex flex-col justify-end overflow-hidden relative shadow-lg">
      {/* White Advantage Bar */}
      <div
        className="w-full bg-slate-100 transition-all duration-500 ease-out rounded-b-full"
        style={{
          height: isFlipped ? `${100 - pct}%` : `${pct}%`,
        }}
      />

      {/* Numerical Advantage Badge */}
      <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
        <span className="text-[10px] font-extrabold px-1 py-0.5 rounded bg-slate-950/80 text-amber-400 border border-slate-700 shadow-sm">
          {scoreText}
        </span>
      </div>
    </div>
  );
};
