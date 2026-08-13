import React from 'react';
import type { GameMode, UserProfile } from '../types/chess';
import { Crown, Puzzle, BookOpen, Trophy, Volume2, VolumeX, Moon, Sun } from 'lucide-react';
import { soundFx } from '../services/audioService';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  profile: UserProfile;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  profile,
  onToggleSound,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="w-full glass-panel sticky top-0 z-40 border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => { soundFx.playClick(); onSelectMode('friend'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              GRANDMASTER <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Premium Chess Experience</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
          <button
            onClick={() => { soundFx.playClick(); onSelectMode('friend'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentMode === 'friend' || currentMode === 'ai'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Crown className="w-4 h-4" />
            Play Game
          </button>

          <button
            onClick={() => { soundFx.playClick(); onSelectMode('puzzle'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentMode === 'puzzle'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            Puzzles
          </button>

          <button
            onClick={() => { soundFx.playClick(); onSelectMode('opening'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentMode === 'opening'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Openings
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => { soundFx.playClick(); onToggleSound(); }}
            title={profile.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all duration-200"
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => { soundFx.playClick(); onToggleDarkMode(); }}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all duration-200"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <div 
            onClick={() => { soundFx.playClick(); onSelectMode('profile'); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-sm">
              {profile.avatar}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight truncate max-w-[90px] sm:max-w-[120px]">
                {profile.username}
              </div>
              <div className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Trophy className="w-3 h-3 inline" /> {profile.rating}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
