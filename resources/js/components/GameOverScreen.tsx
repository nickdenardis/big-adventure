import React from 'react';

interface GameOverData {
    coins: number;
    timeElapsed: number;
    distanceReached: number;
}

interface GameOverScreenProps {
    data: GameOverData;
    onRestart: () => void;
    onMainMenu: () => void;
}

export default function GameOverScreen({ data, onRestart, onMainMenu }: GameOverScreenProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const distancePercent = Math.round((data.distanceReached / 5000) * 100);
    
    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-red-600 to-red-900 rounded-2xl p-12 max-w-lg w-full shadow-2xl border-4 border-red-400">
                {/* Title */}
                <h1 className="text-7xl font-bold text-white text-center mb-4">
                    💀 GAME OVER
                </h1>
                
                <p className="text-red-200 text-center text-xl mb-8">
                    All players have perished...
                </p>
                
                {/* Stats */}
                <div className="bg-red-950/50 rounded-lg p-6 mb-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-red-200 text-lg">💰 Coins Collected:</span>
                        <span className="text-yellow-400 font-bold text-2xl">{data.coins}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-red-200 text-lg">⏱️ Time Survived:</span>
                        <span className="text-white font-bold text-2xl">{formatTime(data.timeElapsed)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-red-200 text-lg">📏 Distance:</span>
                        <span className="text-white font-bold text-2xl">{distancePercent}%</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="bg-red-950 rounded-full h-4 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-1000"
                                style={{ width: `${distancePercent}%` }}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={onRestart}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                        🔄 Try Again
                    </button>
                    
                    <button
                        onClick={onMainMenu}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
                    >
                        🏠 Main Menu
                    </button>
                </div>
                
                {/* Encouragement */}
                <p className="text-red-300 text-center mt-6 text-sm italic">
                    "Don't give up! Every great adventurer falls before they succeed!" 💪
                </p>
            </div>
        </div>
    );
}
