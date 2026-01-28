import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import OceanScene from '../game/scenes/OceanScene';

export default function Game() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 1280,
            height: 720,
            parent: containerRef.current,
            backgroundColor: '#1e90ff',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 }, // No gravity for swimming
                    debug: false,
                },
            },
            scene: [OceanScene],
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);

    return <div ref={containerRef} className="game-container" />;
}
