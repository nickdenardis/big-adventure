import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import OceanScene from '../game/scenes/OceanScene';
import HUD from './HUD';
import CharacterSelect from './CharacterSelect';
import VictoryScreen from './VictoryScreen';
import PauseMenu from './PauseMenu';
import GameOverScreen from './GameOverScreen';

interface PlayerState {
    health: number;
    maxHealth: number;
    coins: number;
    air: number;
    maxAir: number;
    characterName: string;
    speedMode?: string;
}

interface GameState {
    players: PlayerState[];
    distance: number;
    maxDistance: number;
}

interface VictoryData {
    coins: number;
    timeElapsed: number;
    heartsRemaining: number;
    maxHearts: number;
    characterName: string;
}

interface GameOverData {
    coins: number;
    timeElapsed: number;
    distanceReached: number;
}

// Global reference for updating React state from Phaser
(window as any).updateGameState = null;
(window as any).onVictory = null;
(window as any).onGameOver = null;
(window as any).togglePause = null;

export default function Game() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showCharacterSelect, setShowCharacterSelect] = useState(true);
    const [selectedCharacters, setSelectedCharacters] = useState<string[]>(['SmileyFaceBob']);
    const [showVictory, setShowVictory] = useState(false);
    const [victoryData, setVictoryData] = useState<VictoryData | null>(null);
    const [showPause, setShowPause] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [gameOverData, setGameOverData] = useState<GameOverData | null>(null);
    const [gameState, setGameState] = useState<GameState>({
        players: [],
        distance: 0,
        maxDistance: 500,
    });

    const handleStartGame = (characters: string[]) => {
        setSelectedCharacters(characters);
        setShowCharacterSelect(false);
        setShowVictory(false);
        setVictoryData(null);
        setShowPause(false);
        setShowGameOver(false);
        setGameOverData(null);
    };

    const handlePlayAgain = () => {
        // Reset game
        setShowVictory(false);
        setVictoryData(null);
        setShowGameOver(false);
        setGameOverData(null);
        
        // Destroy current game
        if (gameRef.current) {
            gameRef.current.destroy(true);
            gameRef.current = null;
        }
        
        // Show character select again
        setShowCharacterSelect(true);
    };
    
    const handlePauseResume = () => {
        setShowPause(false);
        if (gameRef.current) {
            const scene = gameRef.current.scene.getScene('OceanScene') as OceanScene;
            if (scene) {
                scene.resumeGame();
            }
        }
    };
    
    const handlePauseRestart = () => {
        handlePlayAgain();
    };
    
    const handlePauseMainMenu = () => {
        // Destroy current game
        if (gameRef.current) {
            gameRef.current.destroy(true);
            gameRef.current = null;
        }
        setShowPause(false);
        setShowCharacterSelect(true);
    };

    useEffect(() => {
        if (showCharacterSelect || !containerRef.current || gameRef.current) return;

        // Set up global callback for Phaser to update React
        (window as any).updateGameState = (newState: GameState) => {
            setGameState(newState);
        };
        
        // Set up victory callback
        (window as any).onVictory = (data: VictoryData) => {
            setVictoryData(data);
            setShowVictory(true);
        };
        
        // Set up game over callback
        (window as any).onGameOver = (data: GameOverData) => {
            setGameOverData(data);
            setShowGameOver(true);
        };
        
        // Set up pause toggle callback
        (window as any).togglePause = (paused: boolean) => {
            setShowPause(paused);
        };

        // Store selected character in global so scene can access it
        (window as any).selectedCharacters = selectedCharacters;

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
            (window as any).onVictory = null;
            (window as any).onGameOver = null;
            (window as any).togglePause = null;
            (window as any).selectedCharacters = null;
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, [showCharacterSelect, selectedCharacters]);

    if (showCharacterSelect) {
        return <CharacterSelect onStart={handleStartGame} />;
    }

    return (
        <div className="relative">
            <div ref={containerRef} className="game-container" />
            <HUD
                players={gameState.players}
                distance={gameState.distance}
                maxDistance={gameState.maxDistance}
            />
            {showVictory && victoryData && (
                <VictoryScreen
                    coins={victoryData.coins}
                    timeElapsed={victoryData.timeElapsed}
                    heartsRemaining={victoryData.heartsRemaining}
                    maxHearts={victoryData.maxHearts}
                    characterName={victoryData.characterName}
                    onPlayAgain={handlePlayAgain}
                />
            )}
            {showPause && (
                <PauseMenu
                    onResume={handlePauseResume}
                    onRestart={handlePauseRestart}
                    onMainMenu={handlePauseMainMenu}
                />
            )}
            {showGameOver && gameOverData && (
                <GameOverScreen
                    data={gameOverData}
                    onRestart={handlePlayAgain}
                    onMainMenu={handlePauseMainMenu}
                />
            )}
        </div>
    );
}
