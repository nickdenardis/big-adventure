import React from 'react';

interface PlayerState {
    health: number;
    maxHealth: number;
    coins: number;
    air: number;
    maxAir: number;
    characterName: string;
    speedMode?: string;
}

interface HUDProps {
    players: PlayerState[];
    distance: number;
    maxDistance: number;
}

function PlayerCard({ player, playerNumber }: { player: PlayerState; playerNumber: number }) {
    const fullHearts = Math.floor(player.health);
    const hasHalfHeart = player.health % 1 >= 0.5;
    const airPercentage = (player.air / player.maxAir) * 100;
    const isDead = player.health <= 0;

    return (
        <div className={`bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white space-y-2 min-w-[200px] relative ${isDead ? 'opacity-50' : ''}`}>
            {/* Dead Overlay */}
            {isDead && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-6xl text-red-500 font-bold">✗</div>
                </div>
            )}
            
            <div className="flex items-center gap-2">
                <div className={`font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm ${isDead ? 'bg-gray-500 text-gray-300' : 'bg-yellow-400 text-black'}`}>
                    P{playerNumber}
                </div>
                <div className={`text-lg font-bold ${isDead ? 'text-gray-500 line-through' : 'text-yellow-400'}`}>
                    {player.characterName}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-red-300">HP:</span>
                <div className="flex gap-0.5">
                    {isDead ? (
                        <span className="text-gray-600">💀 DEAD</span>
                    ) : (
                        <>
                            {Array.from({ length: fullHearts }).map((_, i) => (
                                <span key={i} className="text-red-500">❤️</span>
                            ))}
                            {hasHalfHeart && <span className="text-red-500">💔</span>}
                            {Array.from({ length: player.maxHealth - fullHearts - (hasHalfHeart ? 1 : 0) }).map((_, i) => (
                                <span key={`empty-${i}`} className="text-gray-600">🖤</span>
                            ))}
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-300">🪙 Coins:</span>
                <span className={`font-bold ${isDead ? 'text-gray-500' : 'text-yellow-400'}`}>{player.coins}</span>
            </div>

            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-300">💨 Air:</span>
                    <span className={isDead ? 'text-gray-500' : 'text-cyan-300'}>{isDead ? '0%' : `${Math.floor(airPercentage)}%`}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${
                            isDead ? 'bg-gray-600' :
                            airPercentage > 50
                                ? 'bg-cyan-400'
                                : airPercentage > 20
                                ? 'bg-yellow-400'
                                : 'bg-red-500'
                        }`}
                        style={{ width: isDead ? '0%' : `${Math.floor(airPercentage)}%` }}
                    />
                </div>
            </div>

            {player.speedMode && !isDead && (
                <div className="text-xs text-purple-300 font-semibold text-center">
                    ⚡ {player.speedMode}
                </div>
            )}
        </div>
    );
}

export default function HUD({ players, distance, maxDistance }: HUDProps) {
    const distancePercentage = (distance / maxDistance) * 100;

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Top Center - Game Title */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-2">
                    <h1 className="text-2xl font-bold text-white text-center">
                        THE BIG ADVENTURE
                    </h1>
                    <p className="text-sm text-center text-yellow-400">
                        Level 1: Ocean Chase
                    </p>
                </div>
            </div>

            {/* Top Left - Players 1 & 2 */}
            <div className="absolute top-4 left-4 space-y-3 pointer-events-auto">
                {players[0] && <PlayerCard player={players[0]} playerNumber={1} />}
                {players[1] && <PlayerCard player={players[1]} playerNumber={2} />}
            </div>

            {/* Top Right - Players 3 & 4 */}
            <div className="absolute top-4 right-4 space-y-3 pointer-events-auto">
                {players[2] && <PlayerCard player={players[2]} playerNumber={3} />}
                {players[3] && <PlayerCard player={players[3]} playerNumber={4} />}
            </div>

            {/* Bottom Center - Progress Meter */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-white min-w-[400px]">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-green-300 font-semibold">Level Progress</span>
                            <span className="text-green-300 font-bold">
                                {Math.floor(distancePercentage)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-yellow-400 rounded-full transition-all"
                                style={{ width: `${Math.floor(distancePercentage)}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                            Chase the golden banana! 🍌
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
