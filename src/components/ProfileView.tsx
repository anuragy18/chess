import React, { useState } from 'react';
import type { UserProfile } from '../types/chess';
import { saveProfile } from '../services/storageService';
import { soundFx } from '../services/audioService';
import { Trophy, Award, Flame, CheckCircle, Edit3 } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>(profile.username);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatar);

  const avatars = ['♔', '♕', '♖', '♗', '♘', '⚡', '👑', '🔥'];

  const winRate = profile.stats.totalPlayed > 0
    ? Math.round((profile.stats.wins / profile.stats.totalPlayed) * 100)
    : 0;

  const handleSave = () => {
    soundFx.playClick();
    const updated: UserProfile = {
      ...profile,
      username: usernameInput.trim() || 'ChessMaster',
      avatar: selectedAvatar,
    };
    saveProfile(updated);
    onUpdateProfile(updated);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6 animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black text-3xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            {profile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">{profile.username}</h2>
              <button
                onClick={() => { soundFx.playClick(); setIsEditing(!isEditing); }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-amber-400 font-bold mt-0.5 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Rating: {profile.rating} (Peak: {profile.stats.highestRating})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-medium">Win Rate</div>
            <div className="text-lg font-extrabold text-emerald-400">{winRate}%</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-medium">Streak</div>
            <div className="text-lg font-extrabold text-rose-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" /> {profile.stats.streak}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-medium">Puzzles</div>
            <div className="text-lg font-extrabold text-indigo-400">{profile.stats.puzzlesSolved}</div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customize Profile</h3>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Player Handle</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Select Avatar</label>
            <div className="flex gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center border transition-all ${
                    selectedAvatar === av
                      ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl glass-button text-white text-xs font-bold shadow-lg"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Played</div>
          <div className="text-2xl font-black text-white mt-1">{profile.stats.totalPlayed}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Victories</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{profile.stats.wins}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Losses</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{profile.stats.losses}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase">Draws</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{profile.stats.draws}</div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-white font-extrabold text-lg">
          <Award className="w-5 h-5 text-indigo-400" /> Unlockable Achievements
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {profile.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                ach.unlocked
                  ? 'bg-slate-900/80 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{ach.icon}</span>
                {ach.unlocked ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Locked</span>
                )}
              </div>
              <div className="font-bold text-sm text-slate-100 mt-2">{ach.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 leading-snug">{ach.description}</div>
              {ach.unlockedAt && (
                <div className="text-[9px] text-indigo-400 font-medium mt-2">Unlocked {ach.unlockedAt}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
