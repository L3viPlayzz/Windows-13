import { Gamepad2 } from 'lucide-react';
import { useState } from 'react';

export function GamesApp() {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const games = [
    { title: 'Pixel Runner', desc: 'Endless runner game', icon: '🏃' },
    { title: '2048', desc: 'Number puzzle game', icon: '🔢' },
    { title: 'Tetris', desc: 'Classic block stacker', icon: '🧱' },
    { title: 'Snake', desc: 'Classic snake game', icon: '🐍' },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white overflow-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Games</h1>
        </div>

        {gameActive && (
          <div className="mb-8 bg-black/40 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Quick Game</h2>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 min-h-48 flex flex-col items-center justify-center mb-4">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-lg font-semibold mb-2">Score: {score}</p>
              <button onClick={() => setScore(score + 10)} className="px-6 py-2 bg-white text-purple-900 font-bold rounded-lg hover:bg-opacity-90 mb-2">+10 Points</button>
              <button onClick={() => setScore(0)} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm">Reset</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {games.map((game, i) => (
            <button key={i} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 text-left transition-all group border border-white/20 hover:border-white/40">
              <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{game.icon}</div>
              <h3 className="font-bold text-lg mb-1">{game.title}</h3>
              <p className="text-sm text-purple-300">{game.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
