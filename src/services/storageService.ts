import type { UserProfile, Achievement, AIDifficulty } from '../types/chess';
import confetti from 'canvas-confetti';

const STORAGE_KEY_PROFILE = 'chess_master_profile_v1';
const STORAGE_KEY_SAVED_GAME = 'chess_master_saved_game_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'First Victory', description: 'Win your first chess game.', icon: '🏆', unlocked: false },
  { id: 'ai_slayer_easy', title: 'Novice Defeater', description: 'Defeat the Easy AI bot.', icon: '🤖', unlocked: false },
  { id: 'ai_slayer_medium', title: 'Tactician', description: 'Defeat the Medium AI bot.', icon: '🧠', unlocked: false },
  { id: 'ai_slayer_hard', title: 'Master Mind', description: 'Defeat the Hard AI bot.', icon: '⚡', unlocked: false },
  { id: 'ai_slayer_expert', title: 'Grandmaster Slayer', description: 'Defeat the Expert AI bot.', icon: '👑', unlocked: false },
  { id: 'puzzle_5', title: 'Puzzle Apprentice', description: 'Solve 5 tactical puzzles.', icon: '🧩', unlocked: false },
  { id: 'puzzle_10', title: 'Tactics Guru', description: 'Solve 10 tactical puzzles.', icon: '🔥', unlocked: false },
  { id: 'checkmate_hero', title: 'Checkmate Artist', description: 'Deliver checkmate with a Queen or Rook.', icon: '⚔️', unlocked: false },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Play a game with a 1-minute timer.', icon: '⏱️', unlocked: false },
  { id: 'undo_master', title: 'Second Chance', description: 'Use the Undo feature in a match.', icon: '↩️', unlocked: false },
  { id: 'opening_explorer', title: 'Scholar of Openings', description: 'Explore a chess opening study.', icon: '📚', unlocked: false },
  { id: 'streak_3', title: 'On a Roll', description: 'Achieve a 3-game win streak.', icon: '🚀', unlocked: false },
];

export const INITIAL_PROFILE: UserProfile = {
  username: 'ChessMaster',
  avatar: '♔',
  rating: 1200,
  stats: {
    totalPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    puzzlesSolved: 0,
    highestRating: 1200,
    currentRating: 1200,
    streak: 0,
    aiWins: {
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0,
    },
  },
  achievements: INITIAL_ACHIEVEMENTS,
  boardTheme: 'wood',
  soundEnabled: true,
  autoFlip: false,
  showMoveHints: true,
};

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return INITIAL_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROFILE, ...parsed };
  } catch (err) {
    console.error('Failed to parse user profile', err);
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile', err);
  }
}

export function unlockAchievement(achievementId: string, onUnlockNotification?: (title: string) => void): UserProfile {
  const profile = getStoredProfile();
  let newlyUnlocked = false;

  const updatedAchievements = profile.achievements.map((ach) => {
    if (ach.id === achievementId && !ach.unlocked) {
      newlyUnlocked = true;
      if (onUnlockNotification) onUnlockNotification(ach.title);
      return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleDateString() };
    }
    return ach;
  });

  if (newlyUnlocked) {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    const updated = { ...profile, achievements: updatedAchievements };
    saveProfile(updated);
    return updated;
  }

  return profile;
}

export function recordGameResult(
  result: 'win' | 'loss' | 'draw',
  _mode: 'friend' | 'ai',
  aiDifficulty?: AIDifficulty
): UserProfile {
  const profile = getStoredProfile();
  const stats = { ...profile.stats };

  stats.totalPlayed += 1;
  if (result === 'win') {
    stats.wins += 1;
    stats.streak += 1;
    stats.currentRating += 15 + (aiDifficulty ? getDifficultyBonus(aiDifficulty) : 0);
    if (stats.currentRating > stats.highestRating) {
      stats.highestRating = stats.currentRating;
    }
    if (aiDifficulty) {
      stats.aiWins[aiDifficulty] = (stats.aiWins[aiDifficulty] || 0) + 1;
      unlockAchievement(`ai_slayer_${aiDifficulty}`);
    }
    unlockAchievement('first_win');
    if (stats.streak >= 3) {
      unlockAchievement('streak_3');
    }
  } else if (result === 'loss') {
    stats.losses += 1;
    stats.streak = 0;
    stats.currentRating = Math.max(400, stats.currentRating - 10);
  } else {
    stats.draws += 1;
  }

  const updated: UserProfile = {
    ...profile,
    rating: stats.currentRating,
    stats,
  };

  saveProfile(updated);
  return updated;
}

function getDifficultyBonus(diff: AIDifficulty): number {
  switch (diff) {
    case 'easy': return 5;
    case 'medium': return 10;
    case 'hard': return 20;
    case 'expert': return 35;
  }
}

export function recordPuzzleSolved(): UserProfile {
  const profile = getStoredProfile();
  const stats = { ...profile.stats, puzzlesSolved: profile.stats.puzzlesSolved + 1 };
  stats.currentRating += 12;
  if (stats.currentRating > stats.highestRating) stats.highestRating = stats.currentRating;

  let updated = { ...profile, rating: stats.currentRating, stats };
  saveProfile(updated);

  if (stats.puzzlesSolved >= 5) unlockAchievement('puzzle_5');
  if (stats.puzzlesSolved >= 10) unlockAchievement('puzzle_10');

  return getStoredProfile();
}

export function saveActiveGame(fen: string, pgn: string, mode: string, aiDiff?: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify({ fen, pgn, mode, aiDiff, timestamp: Date.now() }));
  } catch (err) {
    console.error('Failed to save active game', err);
  }
}

export function getSavedGame(): { fen: string; pgn: string; mode: string; aiDiff?: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_GAME);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY_SAVED_GAME);
}
