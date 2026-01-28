import React from 'react';

interface HUDProps {
    health: number;
    maxHealth: number;
    coins: number;
    air: number;
    maxAir: number;
    distance: number;
    maxDistance: number;
    characterName: string;
}

export default function HUD({
    health,
    maxHealth,
    coins,
    air,
    maxAir,
    distance,
    maxDistance,
    characterName,
}: HUDProps) {
    const healthPercentage = (health / maxHealth) * 100;
    const airPercentage = (air / maxAir) * 100;
    const distancePercentage = (distance / maxDistance) * 100;

    // Calculate full hearts and partial heart
    const fullHearts = Math.floor(health);
    const hasHalfHeart = health % 1 >= 0.5;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Top Left - Player Info */}
            <div className="absolute top-4 left-4 pointer-events-auto">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white space-y-2 min-w-[250px]">
                    {/* Character Name */}
                    <div className="text-xl font-bold text-yellow-400 mb-2">
                        {characterName}
                    </div>

                    {/* Health */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-red-300">Health</span>
                            <span className="text-red-300">
                                {Math.floor(health)}/{maxHealth}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: maxHealth }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-6 h-6 ${
                                        i < fullHearts
                                            ? 'text-red-500'
                                            : i === fullHearts && hasHalfHeart
                                              ? 'text-red-300'
                                              : 'text-gray-600'
                                    }`}
                                >
                                    {i < fullHearts ? '♥' : i === fullHearts && hasHalfHeart ? '♡' : '♡'}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coins */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🪙</span>
                            <span className="text-xl font-bold text-yellow-400">{coins}</span>
                            <span className="text-sm text-yellow-300">Coins</span>
                        </div>
                    </div>

                    {/* Air Meter */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-300">Air</span>
                            <span className="text-blue-300">{Math.floor(air)}%</span>
                        </div>
                        <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-200 ${
                                    airPercentage > 50
                                        ? 'bg-blue-400'
                                        : airPercentage > 25
                                          ? 'bg-yellow-400'
                                          : 'bg-red-500'
                                }`}
                                style={{
                                    width: `${Math.floor(airPercentage)}%`,
                                    maxWidth: '100%'
                                }}
                            />
                        </div>
                        {air < 25 && (
                            <div className="text-xs text-red-400 animate-pulse">
                                ⚠️ Low Air! Surface or find bubbles!
                            </div>
                        )}
                    </div>

                    {/* Character Ability */}
                    <div className="text-xs text-cyan-300 border-t border-gray-600 pt-2">
                        <strong>Ability:</strong> Double Coins 💰
                    </div>
                </div>
            </div>

            {/* Top Right - Level Progress */}
            <div className="absolute top-4 right-4 pointer-events-auto">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white min-w-[200px]">
                    <div className="text-sm text-gray-300 mb-2">Level Progress</div>
                    <div className="space-y-2">
                        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                                style={{ width: `${distancePercentage}%` }}
                            />
                        </div>
                        <div className="text-xs text-center text-gray-300">
                            {distance}m / {maxDistance}m
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Title */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-2">
                    <h1 className="text-2xl font-bold text-white">
                        THE BIG ADVENTURE
                    </h1>
                    <p className="text-sm text-center text-yellow-400">
                        Level 1: Ocean Chase
                    </p>
                </div>
            </div>

            {/* Controls Helper (Bottom) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                    <div className="text-xs text-gray-300 text-center">
                        <strong className="text-white">Controls:</strong> WASD to swim
                        {' • '}
                        Surface for air or collect bubbles 💭
                    </div>
                </div>
            </div>
        </div>
    );
}
