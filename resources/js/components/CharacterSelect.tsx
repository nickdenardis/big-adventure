import React, { useState } from 'react';
import Leaderboard from './Leaderboard';

interface CharacterOption {
    name: string;
    ability: string;
    description: string;
    color: string;
    controls: string;
}

const characters: CharacterOption[] = [
    {
        name: 'SmileyFaceBob',
        ability: 'Double Coins',
        description: 'Collect 2x coins! 💰',
        color: 'bg-yellow-500',
        controls: 'WASD + Space',
    },
    {
        name: 'Cutie',
        ability: 'Share Health',
        description: 'Give hearts to friends! ❤️',
        color: 'bg-amber-700',
        controls: 'Arrow Keys + Enter',
    },
    {
        name: 'ChillDuck',
        ability: 'Double Health',
        description: 'Start with 10 hearts! 💪',
        color: 'bg-blue-500',
        controls: 'TFGH + Y',
    },
    {
        name: 'CrazyDuck',
        ability: 'Control Speed',
        description: 'Toggle speed modes! ⚡',
        color: 'bg-purple-500',
        controls: 'IJKL + U',
    },
];

interface CharacterSelectProps {
    onStart: (selectedCharacters: string[], playerName: string) => void;
}

export default function CharacterSelect({ onStart }: CharacterSelectProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>(['SmileyFaceBob']);
    const [playerName, setPlayerName] = useState<string>('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const toggleCharacter = (characterName: string) => {
        if (selectedPlayers.includes(characterName)) {
            // Deselect - but keep at least 1 player
            if (selectedPlayers.length > 1) {
                setSelectedPlayers(selectedPlayers.filter(name => name !== characterName));
            }
        } else {
            // Select - but max 4 players
            if (selectedPlayers.length < 4) {
                setSelectedPlayers([...selectedPlayers, characterName]);
            }
        }
    };

    const getPlayerNumber = (characterName: string) => {
        const index = selectedPlayers.indexOf(characterName);
        return index !== -1 ? index + 1 : null;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600">
            <div className="max-w-5xl mx-auto p-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-white mb-4">
                        THE BIG ADVENTURE
                    </h1>
                    <p className="text-2xl text-yellow-400 mb-2">Choose Your Characters</p>
                    <p className="text-lg text-white/80">
                        {selectedPlayers.length} Player{selectedPlayers.length > 1 ? 's' : ''} Selected
                        {selectedPlayers.length < 4 && ' (Click to add more)'}
                    </p>
                </div>

                {/* Character Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {characters.map((char) => {
                        const playerNum = getPlayerNumber(char.name);
                        const isSelected = playerNum !== null;
                        
                        return (
                            <button
                                key={char.name}
                                onClick={() => toggleCharacter(char.name)}
                                className={`
                                    p-6 rounded-lg border-4 transition-all transform hover:scale-105 relative
                                    ${
                                        isSelected
                                            ? 'border-yellow-400 bg-white/20 scale-105'
                                            : 'border-white/30 bg-white/10 hover:border-white/50'
                                    }
                                `}
                            >
                                {/* Player Number Badge */}
                                {isSelected && (
                                    <div className="absolute top-2 left-2 bg-yellow-400 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                                        P{playerNum}
                                    </div>
                                )}
                                
                                <div className="text-center">
                                    {/* Character Preview */}
                                    <div
                                        className={`w-24 h-24 mx-auto mb-4 rounded-full ${char.color} flex items-center justify-center text-4xl`}
                                    >
                                        {char.name === 'SmileyFaceBob' && '😊'}
                                        {char.name === 'Cutie' && '🍪'}
                                        {char.name === 'ChillDuck' && '🦆'}
                                        {char.name === 'CrazyDuck' && '👑🦆'}
                                    </div>

                                    {/* Character Info */}
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {char.name}
                                    </h3>
                                    <div className="text-yellow-300 font-semibold mb-1">
                                        {char.ability}
                                    </div>
                                    <p className="text-white/80 text-sm mb-2">{char.description}</p>
                                    <p className="text-white/60 text-xs">{char.controls}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Player Name Input & Buttons */}
                <div className="space-y-4 mb-8">
                    <div>
                        <label className="block text-white text-lg font-semibold mb-2 text-center">
                            {selectedPlayers.length > 1 ? 'Team Name (Optional)' : 'Your Name (Optional)'}
                        </label>
                        <input
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            placeholder={selectedPlayers.length > 1 ? "Team Anonymous" : "Anonymous Player"}
                            maxLength={50}
                            className="w-full max-w-md mx-auto block px-4 py-3 bg-white/20 border-2 border-white/30 rounded-lg text-white text-center text-xl placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
                        />
                        {selectedPlayers.length > 1 && (
                            <p className="text-white/60 text-sm text-center mt-2">
                                This name represents all {selectedPlayers.length} players on your team
                            </p>
                        )}
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        {/* Start Button */}
                        <button
                            onClick={() => onStart(selectedPlayers, playerName || (selectedPlayers.length > 1 ? 'Team Anonymous' : 'Anonymous Player'))}
                            className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            START GAME ({selectedPlayers.length} Player{selectedPlayers.length > 1 ? 's' : ''}) →
                        </button>
                        
                        {/* Leaderboard Button */}
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
                        >
                            🏆 Leaderboard
                        </button>
                    </div>
                </div>

                {/* Controls Info */}
                <div className="text-center text-white/70 text-sm">
                    <p>💡 Click characters to add/remove • Max 4 players on one keyboard!</p>
                </div>
            </div>
            
            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <Leaderboard onClose={() => setShowLeaderboard(false)} />
            )}
        </div>
    );
}
