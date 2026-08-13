import { useState, useEffect, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';
import type {
  GameMode,
  AIDifficulty,
  MoveRecord,
  PlayerTimer,
  CapturedPiecesState,
  UserProfile,
  PieceType,
  BoardTheme,
} from './types/chess';
import { soundFx } from './services/audioService';
import { getAIMove, getEvaluationFormatted } from './services/chessEngine';
import {
  getStoredProfile,
  saveProfile,
  recordGameResult,
  unlockAchievement,
  saveActiveGame,
  clearSavedGame,
} from './services/storageService';

import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChessBoard } from './components/ChessBoard';
import { PromotionModal } from './components/PromotionModal';
import { CapturedPieces } from './components/CapturedPieces';
import { EvalBar } from './components/EvalBar';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { PuzzleTrainer } from './components/PuzzleTrainer';
import { OpeningExplorer } from './components/OpeningExplorer';
import { ProfileView } from './components/ProfileView';
import { Leaderboard } from './components/Leaderboard';

import confetti from 'canvas-confetti';
import { AlertCircle, Bot } from 'lucide-react';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [mode, setMode] = useState<GameMode | 'welcome'>('welcome');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Active Game State
  const [game, setGame] = useState<Chess>(new Chess());
  const [aiDiff, setAiDiff] = useState<AIDifficulty>('medium');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  // Timers
  const [timer, setTimer] = useState<PlayerTimer>({
    white: 300,
    black: 300,
    initial: 5,
    increment: 0,
    activeColor: 'w',
    isRunning: false,
  });

  // Captured pieces & material calculation
  const [captured, setCaptured] = useState<CapturedPiecesState>({
    white: [],
    black: [],
    advantage: 0,
  });

  // Promotion modal state
  const [promotionPending, setPromotionPending] = useState<{ from: Square; to: Square } | null>(null);

  // Match status
  const [gameStatus, setGameStatus] = useState<'active' | 'checkmate' | 'stalemate' | 'draw' | 'resigned'>('active');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Notification Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Dark / Light Theme
  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Toggle Sound FX
  const handleToggleSound = () => {
    const updated = !profile.soundEnabled;
    soundFx.setEnabled(updated);
    const newProf = { ...profile, soundEnabled: updated };
    saveProfile(newProf);
    setProfile(newProf);
  };

  // Board Theme Selector
  const handleChangeBoardTheme = (theme: BoardTheme) => {
    const newProf = { ...profile, boardTheme: theme };
    saveProfile(newProf);
    setProfile(newProf);
  };

  // Initialize Clocks when starting a game
  const initTimer = (minutes: number) => {
    if (minutes === 0) {
      setTimer({ white: 0, black: 0, initial: 0, increment: 0, activeColor: 'w', isRunning: false });
    } else {
      const secs = minutes * 60;
      setTimer({ white: secs, black: secs, initial: minutes, increment: 0, activeColor: 'w', isRunning: true });
    }
  };

  // Start "Play with a Friend" Match
  const handleStartFriendGame = (minutes: number) => {
    const newGame = new Chess();
    setGame(newGame);
    setMode('friend');
    setMoveHistory([]);
    setCaptured({ white: [], black: [], advantage: 0 });
    setGameStatus('active');
    setStatusMessage('');
    setIsFlipped(false);
    initTimer(minutes);
    clearSavedGame();
  };

  // Start "Play with AI" Match
  const handleStartAIGame = (difficulty: AIDifficulty, minutes: number) => {
    const newGame = new Chess();
    setGame(newGame);
    setAiDiff(difficulty);
    setMode('ai');
    setMoveHistory([]);
    setCaptured({ white: [], black: [], advantage: 0 });
    setGameStatus('active');
    setStatusMessage('');
    setIsFlipped(false);
    initTimer(minutes);
    clearSavedGame();
  };

  // Update captured pieces tally
  const updateCapturedPieces = useCallback((currentFen: string) => {
    const g = new Chess(currentFen);
    const initialCounts: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
    const wCounts: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    const bCounts: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };

    g.board().forEach((row) => {
      row.forEach((piece) => {
        if (piece) {
          if (piece.color === 'w') wCounts[piece.type]++;
          else bCounts[piece.type]++;
        }
      });
    });

    const whiteCaptured: PieceType[] = [];
    const blackCaptured: PieceType[] = [];

    (['p', 'n', 'b', 'r', 'q'] as PieceType[]).forEach((type) => {
      const bLost = initialCounts[type] - bCounts[type];
      for (let i = 0; i < bLost; i++) whiteCaptured.push(type);

      const wLost = initialCounts[type] - wCounts[type];
      for (let i = 0; i < wLost; i++) blackCaptured.push(type);
    });

    const vals: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
    let wScore = whiteCaptured.reduce((sum, p) => sum + vals[p], 0);
    let bScore = blackCaptured.reduce((sum, p) => sum + vals[p], 0);

    setCaptured({
      white: whiteCaptured,
      black: blackCaptured,
      advantage: wScore - bScore,
    });
  }, []);

  // Check game state & FIDE rules
  const checkGameState = useCallback((g: Chess) => {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'Black' : 'White';
      setGameStatus('checkmate');
      setStatusMessage(`Checkmate! ${winner} Wins!`);
      soundFx.playCheckmate();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

      if (mode === 'ai' || mode === 'friend') {
        const isUserWinner = (g.turn() === 'b');
        const result = isUserWinner ? 'win' : 'loss';
        const updated = recordGameResult(result, mode === 'ai' ? 'ai' : 'friend', aiDiff);
        setProfile(updated);
      }
      return;
    }

    if (g.isDraw()) {
      setGameStatus('draw');
      if (g.isStalemate()) setStatusMessage('Stalemate! Game drawn.');
      else if (g.isThreefoldRepetition()) setStatusMessage('Draw by Threefold Repetition.');
      else setStatusMessage('Draw agreed / Insufficient material.');
      soundFx.playCheck();
      if (mode === 'ai' || mode === 'friend') {
        const updated = recordGameResult('draw', mode === 'ai' ? 'ai' : 'friend', aiDiff);
        setProfile(updated);
      }
      return;
    }

    if (g.inCheck()) {
      soundFx.playCheck();
      showToast('CHECK!');
    }
  }, [mode, aiDiff]);

  // Execute move on the engine & update history
  const executeMove = useCallback((from: Square, to: Square, promotion?: PieceType): boolean => {
    try {
      const copy = new Chess(game.fen());
      const move = copy.move({ from, to, promotion: promotion || 'q' });

      if (!move) {
        soundFx.playIllegal();
        return false;
      }

      if (move.captured) {
        soundFx.playCapture();
      } else if (move.flags.includes('k') || move.flags.includes('q')) {
        soundFx.playCastle();
      } else {
        soundFx.playMove();
      }

      setGame(copy);

      const newRecord: MoveRecord = {
        from: move.from,
        to: move.to,
        piece: move.piece,
        color: move.color,
        captured: move.captured,
        promotion: move.promotion,
        san: move.san,
        fen: copy.fen(),
      };
      setMoveHistory((prev) => [...prev, newRecord]);

      updateCapturedPieces(copy.fen());

      setTimer((prev) => ({
        ...prev,
        activeColor: copy.turn(),
      }));

      checkGameState(copy);

      saveActiveGame(copy.fen(), copy.pgn(), mode, aiDiff);

      return true;
    } catch (err) {
      soundFx.playIllegal();
      return false;
    }
  }, [game, updateCapturedPieces, checkGameState, mode, aiDiff]);

  // Handle player board move attempt
  const handleMakeMove = (from: Square, to: Square): boolean => {
    if (gameStatus !== 'active' || isAiThinking) return false;

    const piece = game.get(from);
    if (piece && piece.type === 'p') {
      const isWhitePromotion = piece.color === 'w' && to.endsWith('8');
      const isBlackPromotion = piece.color === 'b' && to.endsWith('1');

      if (isWhitePromotion || isBlackPromotion) {
        setPromotionPending({ from, to });
        return true;
      }
    }

    return executeMove(from, to);
  };

  const handleSelectPromotion = (piece: PieceType) => {
    if (promotionPending) {
      executeMove(promotionPending.from, promotionPending.to, piece);
      setPromotionPending(null);
    }
  };

  // AI Move Loop Trigger
  useEffect(() => {
    if (mode === 'ai' && gameStatus === 'active' && game.turn() === 'b' && !isAiThinking) {
      setIsAiThinking(true);
      getAIMove(game.fen(), aiDiff)
        .then(({ from, to, promotion }) => {
          executeMove(from as Square, to as Square, promotion as PieceType);
        })
        .catch((err) => console.error('AI Move calculation error', err))
        .finally(() => setIsAiThinking(false));
    }
  }, [mode, gameStatus, game, aiDiff, isAiThinking, executeMove]);

  // Clock Countdown Timer Interval
  useEffect(() => {
    if (timer.initial === 0 || !timer.isRunning || gameStatus !== 'active') return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const isWhiteTurn = prev.activeColor === 'w';
        const nextWhite = isWhiteTurn ? Math.max(0, prev.white - 1) : prev.white;
        const nextBlack = !isWhiteTurn ? Math.max(0, prev.black - 1) : prev.black;

        if (nextWhite === 0 || nextBlack === 0) {
          const winner = nextWhite === 0 ? 'Black' : 'White';
          setGameStatus('checkmate');
          setStatusMessage(`Time Out! ${winner} Wins on Time!`);
          soundFx.playCheckmate();
        }

        return {
          ...prev,
          white: nextWhite,
          black: nextBlack,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.initial, timer.isRunning, gameStatus]);

  // Undo Move Action
  const handleUndo = () => {
    if (moveHistory.length === 0 || gameStatus !== 'active') return;

    const undoCount = mode === 'ai' ? 2 : 1;
    const copy = new Chess(game.fen());
    for (let i = 0; i < undoCount; i++) {
      copy.undo();
    }

    setGame(copy);
    setMoveHistory((prev) => prev.slice(0, prev.length - undoCount));
    updateCapturedPieces(copy.fen());
    unlockAchievement('undo_master');
    showToast('Move Undone');
  };

  // Resign Action
  const handleResign = () => {
    setGameStatus('resigned');
    setStatusMessage('Match Resigned.');
    soundFx.playCheck();
    recordGameResult('loss', mode === 'ai' ? 'ai' : 'friend', aiDiff);
  };

  // Export PGN File
  const handleExportPGN = () => {
    const element = document.createElement('a');
    const file = new Blob([game.pgn()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `chess_game_${Date.now()}.pgn`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('PGN Downloaded!');
  };

  const { scoreText, whiteAdvantagePct } = getEvaluationFormatted(game);

  let kingCheckSquare: Square | null = null;
  if (game.inCheck()) {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === game.turn()) {
          const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
          kingCheckSquare = `${files[c]}${8 - r}` as Square;
        }
      }
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} flex flex-col font-sans transition-colors duration-300`}>
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 glass-panel px-4 py-2.5 rounded-2xl border border-indigo-500/50 text-indigo-300 text-xs font-bold flex items-center gap-2 shadow-2xl animate-bounce">
          <AlertCircle className="w-4 h-4 text-indigo-400" />
          {toastMessage}
        </div>
      )}

      {promotionPending && (
        <PromotionModal
          color={game.turn()}
          onSelect={handleSelectPromotion}
        />
      )}

      <Header
        currentMode={mode === 'welcome' ? 'friend' : mode}
        onSelectMode={(selected) => setMode(selected)}
        profile={profile}
        onToggleSound={handleToggleSound}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <main className="flex-1">
        {mode === 'welcome' && (
          <WelcomeScreen
            onStartFriendGame={handleStartFriendGame}
            onStartAIGame={handleStartAIGame}
          />
        )}

        {(mode === 'friend' || mode === 'ai') && (
          <div className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <EvalBar
                scoreText={scoreText}
                whiteAdvantagePct={whiteAdvantagePct}
                isFlipped={isFlipped}
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm">
                    {mode === 'ai' ? '🤖' : '👤'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      {mode === 'ai' ? `Bot (${aiDiff.toUpperCase()})` : 'Player 2'}
                      {isAiThinking && (
                        <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1 animate-pulse">
                          <Bot className="w-3 h-3" /> Thinking...
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">Black Pieces</div>
                  </div>
                </div>

                <CapturedPieces captured={captured} forColor="b" />
              </div>

              <ChessBoard
                game={game}
                onMakeMove={handleMakeMove}
                isFlipped={isFlipped}
                boardTheme={profile.boardTheme}
                showHints={profile.showMoveHints}
                isCheck={game.inCheck()}
                kingCheckSquare={kingCheckSquare}
                disabled={gameStatus !== 'active' || isAiThinking}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center">
                    {profile.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{profile.username}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">{profile.rating} ELO</div>
                  </div>
                </div>

                <CapturedPieces captured={captured} forColor="w" />
              </div>

              {gameStatus !== 'active' && (
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 text-center space-y-3 animate-fadeIn">
                  <h3 className="text-2xl font-extrabold text-white">{statusMessage}</h3>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => handleStartFriendGame(timer.initial)}
                      className="px-6 py-2.5 rounded-xl glass-button text-white font-bold text-xs"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setMode('welcome')}
                      className="px-6 py-2.5 rounded-xl glass-button-secondary text-slate-300 font-bold text-xs"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <GameControls
                timer={timer}
                activeColor={game.turn()}
                onUndo={handleUndo}
                onFlipBoard={() => setIsFlipped(!isFlipped)}
                onResign={handleResign}
                onDrawOffer={() => showToast('Draw offer sent')}
                onRestart={() => handleStartFriendGame(timer.initial)}
                currentTheme={profile.boardTheme}
                onChangeTheme={handleChangeBoardTheme}
                isAiMode={mode === 'ai'}
              />

              <MoveHistory
                history={moveHistory}
                onExportPGN={handleExportPGN}
              />
            </div>
          </div>
        )}

        {mode === 'puzzle' && <PuzzleTrainer />}

        {mode === 'opening' && <OpeningExplorer />}

        {mode === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
          />
        )}

        {mode === 'leaderboard' && <Leaderboard userProfile={profile} />}
      </main>
    </div>
  );
}

export default App;
