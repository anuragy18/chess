import React, { useState, useEffect } from 'react';
import { Chess, type Square } from 'chess.js';
import { CHESS_PUZZLES } from '../services/puzzleData';
import type { ChessPuzzle } from '../types/chess';
import { ChessBoard } from './ChessBoard';
import { soundFx } from '../services/audioService';
import { recordPuzzleSolved } from '../services/storageService';
import { Puzzle, HelpCircle, CheckCircle2, XCircle, ArrowRight, Trophy, Flame } from 'lucide-react';

export const PuzzleTrainer: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const puzzle: ChessPuzzle = CHESS_PUZZLES[currentIdx];

  const [game, setGame] = useState<Chess>(new Chess(puzzle.fen));
  const [solutionStep, setSolutionStep] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    setGame(new Chess(puzzle.fen));
    setSolutionStep(0);
    setStatus('idle');
    setShowHint(false);
  }, [currentIdx]);

  const handleMakeMove = (from: Square, to: Square): boolean => {
    if (status !== 'idle') return false;

    const moveSan = `${from}${to}`;
    const targetMove = puzzle.solutionMoves[solutionStep];

    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) {
        soundFx.playIllegal();
        return false;
      }

      if (moveSan === targetMove || move.san === targetMove || puzzle.solutionMoves.includes(moveSan)) {
        soundFx.playMove();
        const nextStep = solutionStep + 1;
        setSolutionStep(nextStep);

        if (nextStep >= puzzle.solutionMoves.length || game.isCheckmate()) {
          soundFx.playCheckmate();
          setStatus('success');
          setStreak((s) => s + 1);
          recordPuzzleSolved();
        }
        setGame(new Chess(game.fen()));
        return true;
      } else {
        soundFx.playIllegal();
        setStatus('failed');
        setStreak(0);
        return false;
      }
    } catch (err) {
      soundFx.playIllegal();
      return false;
    }
  };

  const nextPuzzle = () => {
    soundFx.playClick();
    setCurrentIdx((prev) => (prev + 1) % CHESS_PUZZLES.length);
  };

  const retryPuzzle = () => {
    soundFx.playClick();
    setGame(new Chess(puzzle.fen));
    setSolutionStep(0);
    setStatus('idle');
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6 animate-fadeIn">
      <div className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              {puzzle.title}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {puzzle.category}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{puzzle.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs">
            <Trophy className="w-4 h-4" /> Rating: {puzzle.rating}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 font-bold text-xs">
            <Flame className="w-4 h-4" /> Streak: {streak}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChessBoard
            game={game}
            onMakeMove={handleMakeMove}
            isFlipped={game.turn() === 'b'}
            boardTheme="wood"
            showHints={true}
            isCheck={game.inCheck()}
            kingCheckSquare={null}
            disabled={status !== 'idle'}
          />
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Puzzle Objective
            </h3>
            
            <p className="text-slate-200 text-sm leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              {game.turn() === 'w' ? 'White to move.' : 'Black to move.'} Find the best combination to gain a tactical victory!
            </p>

            {status === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-sm">Puzzle Solved!</div>
                  <div className="text-xs mt-0.5 text-emerald-200/80">+12 ELO gained. Excellent tactical awareness!</div>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-start gap-3 animate-fadeIn">
                <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-sm">Incorrect Move</div>
                  <div className="text-xs mt-0.5 text-rose-200/80">That wasn't the optimal line. Try again!</div>
                </div>
              </div>
            )}

            {showHint && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed animate-fadeIn">
                💡 <span className="font-bold">Hint:</span> {puzzle.hint}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => { soundFx.playClick(); setShowHint(!showHint); }}
              className="w-full py-3 rounded-xl glass-button-secondary text-slate-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            {status === 'failed' && (
              <button
                onClick={retryPuzzle}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                Retry Puzzle
              </button>
            )}

            <button
              onClick={nextPuzzle}
              className="w-full py-3.5 rounded-xl glass-button text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              Next Puzzle <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
