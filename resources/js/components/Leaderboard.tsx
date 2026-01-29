import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ScoreEntry {
    id: number;
    player_name: string;
    characters: string; // JSON string
    coins: number;
    time_seconds: number;
    hearts_remaining: number;
    max_hearts: number;
    completed: boolean;
    created_at: string;
}

interface LeaderboardProps {
    onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchScores();
    }, []);

    const fetchScores = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/scores');
            setScores(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load leaderboard');
            console.error('Error fetching scores:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const parseCharacters = (charactersJson: string) => {
        try {
            return JSON.parse(charactersJson);
        } catch {
            return [];
        }
    };

    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}.`;
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-purple-600 to-purple-900 rounded-2xl p-8 max-w-3xl w-full shadow-2xl border-4 border-purple-400 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-6xl font-bold text-white text-center mb-2">
                        🏆 LEADERBOARD
                    </h1>
                    <p className="text-purple-200 text-center">
                        Top 10 Golden Banana Chasers
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading && (
                        <div className="text-center text-white text-xl py-12">
                            Loading scores...
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-300 text-xl py-12">
                            {error}
                        </div>
                    )}

                    {!loading && !error && scores.length === 0 && (
                        <div className="text-center text-purple-200 text-xl py-12">
                            🎮 No scores yet! Be the first to complete the level!
                        </div>
                    )}

                    {!loading && !error && scores.length > 0 && (
                        <div className="space-y-2">
                            {scores.map((score, index) => (
                                <div
                                    key={score.id}
                                    className={`bg-purple-800/50 rounded-lg p-4 flex items-center gap-4 ${
                                        index < 3 ? 'border-2 border-yellow-400' : ''
                                    }`}
                                >
                                    {/* Rank */}
                                    <div className="text-3xl font-bold min-w-[60px] text-center">
                                        {getMedalEmoji(index + 1)}
                                    </div>

                                    {/* Player Info */}
                                    <div className="flex-1">
                                        <div className="text-white font-bold text-lg">
                                            {score.player_name}
                                        </div>
                                        <div className="text-purple-300 text-sm">
                                            {parseCharacters(score.characters).join(', ')}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-6 text-right">
                                        <div>
                                            <div className="text-yellow-400 font-bold text-xl">
                                                {score.coins} 💰
                                            </div>
                                            <div className="text-purple-300 text-xs">
                                                coins
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-xl">
                                                {formatTime(score.time_seconds)}
                                            </div>
                                            <div className="text-purple-300 text-xs">
                                                time
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-red-400 font-bold text-xl">
                                                {score.hearts_remaining}/{score.max_hearts} ❤️
                                            </div>
                                            <div className="text-purple-300 text-xs">
                                                hearts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 active:scale-95"
                >
                    ✖️ Close
                </button>
            </div>
        </div>
    );
}
