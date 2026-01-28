import Phaser from 'phaser';
import Player from '../entities/Player';

export default class OceanScene extends Phaser.Scene {
    private player!: Player;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeys!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    };

    constructor() {
        super({ key: 'OceanScene' });
    }

    create() {
        // Create ocean gradient background
        const graphics = this.add.graphics();
        
        // Top (surface) - lighter blue
        graphics.fillGradientStyle(0x1e90ff, 0x1e90ff, 0x0066cc, 0x0066cc, 1);
        graphics.fillRect(0, 0, 1280, 720);

        // Add ocean surface line
        graphics.lineStyle(3, 0x87ceeb, 1);
        graphics.lineBetween(0, 100, 1280, 100);

        // Add some simple water effects
        this.add.text(20, 20, 'THE BIG ADVENTURE - Level 1: Ocean Chase', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
        });

        // Create player (SmileyFaceBob)
        this.player = new Player(this, 200, 360);

        // Set up keyboard controls (WASD for Player 1)
        this.wasdKeys = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }) as any;

        // Set camera bounds
        this.cameras.main.setBounds(0, 0, 1280, 720);
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    }

    update() {
        // Update player movement
        this.player.update(this.wasdKeys);
    }
}
