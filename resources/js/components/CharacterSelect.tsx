import React, { useState } from 'react';

interface CharacterOption {
    name: string;
    ability: string;
    description: string;
    color: string;
}

const characters: CharacterOption[] = [
    {
        name: 'SmileyFaceBob',
        ability: 'Double Coins',
        description: 'Collect 2x coins! 💰',
        color: 'bg-yellow-500',
    },
    {
        name: 'Cutie',
        ability: 'Share Health',
        description: 'Give hearts to friends! ❤️',
        color: 'bg-amber-700',
    },
    {
        name: 'ChillDuck',
        ability: 'Double Health',
        description: 'Start with 10 hearts! 💪',
        color: 'bg-blue-500',
    },
    {
        name: 'CrazyDuck',
        ability: 'Control Speed',
        description: 'Toggle speed modes! ⚡',
        color: 'bg-purple-500',
    },
];

interface CharacterSelectProps {
    onStart: (selectedCharacter: string) => void;
}

export default function CharacterSelect({ onStart }: CharacterSelectProps) {
    const [selected, setSelected] = useState<string>('SmileyFaceBob');

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600">
            <div className="max-w-4xl mx-auto p-8">
                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-white mb-4">
                        THE BIG ADVENTURE
                    </h1>
                    <p className="text-2xl text-yellow-400">Choose Your Character</p>
                </div>

                {/* Character Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {characters.map((char) => (
                        <button
                            key={char.name}
                            onClick={() => setSelected(char.name)}
                            className={`
                                p-6 rounded-lg border-4 transition-all transform hover:scale-105
                                ${
                                    selected === char.name
                                        ? 'border-yellow-400 bg-white/20 scale-105'
                                        : 'border-white/30 bg-white/10 hover:border-white/50'
                                }
                            `}
                        >
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
                                <p className="text-white/80 text-sm">{char.description}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Start Button */}
                <div className="text-center">
                    <button
                        onClick={() => onStart(selected)}
                        className="px-12 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
                    >
                        START GAME →
                    </button>
                </div>

                {/* Controls Info */}
                <div className="mt-8 text-center text-white/70 text-sm">
                    <p>Use WASD to swim • Space for special ability</p>
                </div>
            </div>
        </div>
    );
}
