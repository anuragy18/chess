import React, { useState } from 'react';
import { Chess } from 'chess.js';
import { CHESS_OPENINGS } from '../services/openingData';
import type { ChessOpening } from '../types/chess';
import { ChessBoard } from './ChessBoard';
import { soundFx } from '../services/audioService';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Lightbulb } from 'lucide-react';

export const OpeningExplorer: React.FC = () => {
  const [selectedOpening, setSelectedOpening] = useState<ChessOpening>(CHESS_OPENINGS[0]);
  const [currentStep, setCurrentStep] = useState<number>(selectedOpening.moves.length);

  const game = new Chess();
  for (let i = 0; i < currentStep; i++) {
    try {
      game.move(selectedOpening.moves[i]);
    } catch (e) {
      break;
    }
  }

  const handleSelectOpening = (opening: ChessOpening) => {
    soundFx.playClick();
    setSelectedOpening(opening);
    setCurrentStep(opening.moves.length);
  };

  const stepForward = () => {
    if (currentStep < selectedOpening.moves.length) {
      soundFx.playMove();
      setCurrentStep(currentStep + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      soundFx.playClick();
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSteps = () => {
    soundFx.playClick();
    setCurrentStep(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6 animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Beginners Opening Explorer</h2>
            <p className="text-xs text-slate-400">Master classic pawn structures and strategic principles</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CHESS_OPENINGS.map((op) => (
            <button
              key={op.id}
              onClick={() => handleSelectOpening(op)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedOpening.id === op.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {op.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ChessBoard
            game={game}
            onMakeMove={() => false}
            isFlipped={false}
            boardTheme="wood"
            showHints={false}
            isCheck={game.inCheck()}
            kingCheckSquare={null}
            disabled={true}
          />

          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={resetSteps}
                disabled={currentStep === 0}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={stepBackward}
                disabled={currentStep === 0}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={stepForward}
                disabled={currentStep >= selectedOpening.moves.length}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs font-mono font-bold text-slate-300">
              Move {currentStep} / {selectedOpening.moves.length}:{' '}
              <span className="text-amber-400">
                {currentStep > 0 ? selectedOpening.moves[currentStep - 1] : 'Start'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 border border-slate-800">
                ECO {selectedOpening.eco}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {selectedOpening.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-2">{selectedOpening.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {selectedOpening.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Strategic Objectives
            </h4>
            <ul className="space-y-2">
              {selectedOpening.keyConcepts.map((concept, idx) => (
                <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Main Sequence Notation
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {selectedOpening.moves.map((m, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-md border ${
                    idx < currentStep
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40 font-bold'
                      : 'bg-slate-900/40 text-slate-500 border-slate-800'
                  }`}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
