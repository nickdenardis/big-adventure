import React from 'react';

interface VictoryScreenProps {
    coins: number;
    timeElapsed: number;
    heartsRemaining: number;
    maxHearts: number;
    characterName: string;
    onPlayAgain: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({
    coins,
    timeElapsed,
    heartsRemaining,
    maxHearts,
    characterName,
    onPlayAgain,
}) => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = Math.floor(timeElapsed % 60);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
            <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-lg p-8 max-w-md w-full text-center shadow-2xl border-4 border-yellow-600">
                <h1 className="text-5xl font-bold text-green-800 mb-6 drop-shadow-lg">
                    🎉 VICTORY! 🎉
                </h1>

                <div className="bg-white bg-opacity-90 rounded-lg p-6 mb-6">
                    <p className="text-2xl font-semibold text-gray-800 mb-4">
                        {characterName} reached the grassland!
                    </p>

                    <div className="space-y-3 text-left">
                        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
                            <span className="text-lg font-medium text-gray-700">🪙 Coins Collected:</span>
                            <span className="text-2xl font-bold text-yellow-600">{coins}</span>
                        </div>

                        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
                            <span className="text-lg font-medium text-gray-700">⏱️ Time:</span>
                            <span className="text-2xl font-bold text-blue-600">{timeString}</span>
                        </div>

                        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
                            <span className="text-lg font-medium text-gray-700">❤️ Hearts Left:</span>
                            <span className="text-2xl font-bold text-red-600">
                                {Math.floor(heartsRemaining)} / {maxHearts}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onPlayAgain}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-4 px-8 rounded-lg transition-colors shadow-lg"
                    >
                        🔄 Play Again
                    </button>

                    <p className="text-sm text-green-900 italic">
                        The enemy escaped with the golden banana... for now! 🍌
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VictoryScreen;
