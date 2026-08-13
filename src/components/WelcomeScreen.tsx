import React, { useState } from 'react';
import type { AIDifficulty } from '../types/chess';
import { Users, Bot, Sparkles, Clock, Play } from 'lucide-react';
import { soundFx } from '../services/audioService';

interface WelcomeScreenProps {
  onStartFriendGame: (timerMinutes: number) => void;
  onStartAIGame: (difficulty: AIDifficulty, timerMinutes: number) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartFriendGame,
  onStartAIGame,
}) => {
  const [selectedTab, setSelectedTab] = useState<'friend' | 'ai'>('ai');
  const [aiDiff, setAiDiff] = useState<AIDifficulty>('medium');
  const [timerMinutes, setTimerMinutes] = useState<number>(5);

  const timers = [
    { label: '1 Min', value: 1, tag: 'Bullet' },
    { label: '3 Min', value: 3, tag: 'Blitz' },
    { label: '5 Min', value: 5, tag: 'Blitz' },
    { label: '10 Min', value: 10, tag: 'Rapid' },
    { label: '30 Min', value: 30, tag: 'Classical' },
    { label: 'Unlimited', value: 0, tag: 'Casual' },
  ];

  const aiDifficulties: { id: AIDifficulty; name: string; elo: string; desc: string; color: string; icon: string }[] = [
    { id: 'easy', name: 'Easy Bot', elo: '~800 ELO', desc: 'Ideal for beginners. Makes occasional mistakes.', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400', icon: '🟢' },
    { id: 'medium', name: 'Medium Bot', elo: '~1300 ELO', desc: 'Balanced positional play & tactical awareness.', color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400', icon: '🔷' },
    { id: 'hard', name: 'Hard Bot', elo: '~1800 ELO', desc: 'Sharp tactical calculation and solid defense.', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400', icon: '⚡' },
    { id: 'expert', name: 'Expert AI', elo: '~2300+ ELO', desc: 'Deep Minimax evaluation. Ruthless grandmaster strategy.', color: 'from-rose-500/20 to-purple-500/20 border-rose-500/30 text-rose-400', icon: '👑' },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 lg:p-8 animate-fadeIn">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />

      <div className="max-w-4xl w-full glass-panel rounded-3xl p-6 lg:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Grandmaster Studio 2.0
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Match Mode
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Challenge Stockfish AI with adaptive difficulty or play face-to-face with a friend in real-time pass & play.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            onClick={() => { soundFx.playClick(); setSelectedTab('ai'); }}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border ${
              selectedTab === 'ai'
                ? 'bg-indigo-900/40 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/50'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Bot className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                4 Difficulties
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Play with AI (Bot)</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Test your tactical skills against an intelligent chess engine evaluating positions in real-time.
            </p>
          </div>

          <div
            onClick={() => { soundFx.playClick(); setSelectedTab('friend'); }}
            className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative border ${
              selectedTab === 'friend'
                ? 'bg-indigo-900/40 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/50'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <Users className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2 Players
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Play with a Friend</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Pass & play on a shared screen with live clocks, board flipping, undo moves, and FIDE rules.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 lg:p-6 border border-slate-800 space-y-6">
          {selectedTab === 'ai' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Select AI Bot Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {aiDifficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => { soundFx.playClick(); setAiDiff(diff.id); }}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-200 relative ${
                      aiDiff === diff.id
                        ? `bg-slate-800/90 ${diff.color} ring-1 ring-current shadow-lg`
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{diff.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                        {diff.elo}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-100 mt-2">{diff.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{diff.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-400" />
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Match Clock Timer
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {timers.map((t) => (
                <button
                  key={t.value}
                  onClick={() => { soundFx.playClick(); setTimerMinutes(t.value); }}
                  className={`py-2.5 px-3 rounded-xl text-center border transition-all duration-200 ${
                    timerMinutes === t.value
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/40 font-bold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold">{t.label}</div>
                  <div className="text-[9px] opacity-75">{t.tag}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                if (selectedTab === 'ai') {
                  onStartAIGame(aiDiff, timerMinutes);
                } else {
                  onStartFriendGame(timerMinutes);
                }
              }}
              className="w-full py-4 rounded-2xl glass-button text-white font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-transform duration-200"
            >
              <Play className="w-6 h-6 fill-current" />
              Start Match Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
