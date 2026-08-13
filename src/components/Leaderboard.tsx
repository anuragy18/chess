import React from 'react';
import type { UserProfile } from '../types/chess';
import { Trophy, Medal, Crown } from 'lucide-react';

interface LeaderboardProps {
  userProfile: UserProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userProfile }) => {
  const globalLeaderboard = [
    { rank: 1, name: 'Magnus_Carlsen_AI', rating: 2882, avatar: '♔', badge: 'World Champion' },
    { rank: 2, name: 'Hikaru_Nakamura_Bot', rating: 2875, avatar: '♕', badge: 'Blitz King' },
    { rank: 3, name: 'Stockfish_2300', rating: 2750, avatar: '🤖', badge: 'Expert Engine' },
    { rank: 4, name: userProfile.username, rating: userProfile.rating, avatar: userProfile.avatar, badge: 'You' },
    { rank: 5, name: 'Kasparov_Legacy', rating: 2450, avatar: '⚡', badge: 'Tactics Legend' },
    { rank: 6, name: 'Deep_Blue_V2', rating: 2320, avatar: '🧠', badge: 'Master AI' },
    { rank: 7, name: 'ChessMaster_99', rating: 1980, avatar: '♖', badge: 'Senior Master' },
  ];

  globalLeaderboard.sort((a, b) => b.rating - a.rating);
  globalLeaderboard.forEach((item, idx) => item.rank = idx + 1);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6 animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white">Global Chess Standings</h2>
          <p className="text-xs text-slate-400">Compete against AI engines and top online grandmasters</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="grid grid-cols-12 bg-slate-900/80 px-6 py-3 text-xs font-extrabold text-slate-400 uppercase border-b border-slate-800">
          <span className="col-span-2">Rank</span>
          <span className="col-span-6">Player</span>
          <span className="col-span-4 text-right">Rating</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {globalLeaderboard.map((player) => {
            const isUser = player.name === userProfile.username;
            return (
              <div
                key={player.name}
                className={`grid grid-cols-12 px-6 py-4 items-center text-sm transition-colors ${
                  isUser ? 'bg-indigo-900/40 border-l-4 border-indigo-500 font-bold' : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="col-span-2 flex items-center gap-2">
                  {player.rank === 1 && <Crown className="w-5 h-5 text-amber-400" />}
                  {player.rank === 2 && <Medal className="w-5 h-5 text-slate-300" />}
                  {player.rank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                  <span className="font-extrabold text-slate-300">#{player.rank}</span>
                </div>

                <div className="col-span-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold">
                    {player.avatar}
                  </span>
                  <div>
                    <div className="font-extrabold text-slate-100 flex items-center gap-2">
                      {player.name}
                      {isUser && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">{player.badge}</div>
                  </div>
                </div>

                <div className="col-span-4 text-right font-mono font-extrabold text-amber-400">
                  {player.rating} ELO
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
