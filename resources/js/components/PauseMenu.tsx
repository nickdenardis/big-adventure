import React from 'react';

interface PauseMenuProps {
    onResume: () => void;
    onRestart: () => void;
    onMainMenu: () => void;
}

export default function PauseMenu({ onResume, onRestart, onMainMenu }: PauseMenuProps) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl p-12 max-w-md w-full shadow-2xl border-4 border-blue-400">
                {/* Title */}
                <h1 className="text-6xl font-bold text-white text-center mb-8">
                    ⏸️ PAUSED
                </h1>
                
                {/* Hint */}
                <p className="text-blue-200 text-center mb-8">
                    Press <kbd className="px-2 py-1 bg-blue-900 rounded">ESC</kbd> to resume
                </p>
                
                {/* Menu Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={onResume}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                        ▶️ Resume Game
                    </button>
                    
                    <button
                        onClick={onRestart}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                        🔄 Restart Level
                    </button>
                    
                    <button
                        onClick={onMainMenu}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                        🏠 Main Menu
                    </button>
                </div>
                
                {/* Tips */}
                <div className="mt-8 p-4 bg-blue-900/50 rounded-lg">
                    <p className="text-blue-200 text-sm text-center">
                        💡 <strong>Tip:</strong> Work together to dodge obstacles and collect coins!
                    </p>
                </div>
            </div>
        </div>
    );
}
