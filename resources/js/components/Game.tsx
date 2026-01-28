import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import OceanScene from '../game/scenes/OceanScene';
import HUD from './HUD';
import CharacterSelect from './CharacterSelect';

interface GameState {
    health: number;
    maxHealth: number;
    coins: number;
    air: number;
    maxAir: number;
    distance: number;
    maxDistance: number;
    characterName: string;
    speedMode?: string;
}

// Global reference for updating React state from Phaser
(window as any).updateGameState = null;

export default function Game() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCharacterSelect, setShowCharacterSelect] = useState(true);
    const [selectedCharacter, setSelectedCharacter] = useState<string>('SmileyFaceBob');
    const [gameState, setGameState] = useState<GameState>({
        health: 5,
        maxHealth: 5,
        coins: 0,
        air: 100,
        maxAir: 100,
        distance: 0,
        maxDistance: 500,
        characterName: 'SmileyFaceBob',
    });

    const handleStartGame = (character: string) => {
        setSelectedCharacter(character);
        setShowCharacterSelect(false);
    };

    useEffect(() => {
        if (showCharacterSelect || !containerRef.current || gameRef.current) return;

        // Set up global callback for Phaser to update React
        (window as any).updateGameState = (newState: GameState) => {
            setGameState(newState);
        };

        // Store selected character in global so scene can access it
        (window as any).selectedCharacter = selectedCharacter;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1280,
            height: 720,
            parent: containerRef.current,
            backgroundColor: '#1e90ff',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false,
                },
            },
            scene: [OceanScene],
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            (window as any).updateGameState = null;
            (window as any).selectedCharacter = null;
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, [showCharacterSelect, selectedCharacter]);

    if (showCharacterSelect) {
        return <CharacterSelect onStart={handleStartGame} />;
    }

    return (
        <div className="relative">
            <div ref={containerRef} className="game-container" />
            <HUD
                health={gameState.health}
                maxHealth={gameState.maxHealth}
                coins={gameState.coins}
                air={gameState.air}
                maxAir={gameState.maxAir}
                distance={gameState.distance}
                maxDistance={gameState.maxDistance}
                characterName={gameState.characterName}
                speedMode={gameState.speedMode}
            />
        </div>
    );
}
