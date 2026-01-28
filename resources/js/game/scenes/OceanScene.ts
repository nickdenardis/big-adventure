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
    private enemyBoat!: Phaser.GameObjects.Sprite;
    private levelWidth: number = 5000; // Level is 5000px wide (about 1-2 min to complete)
    private oceanSurface: number = 100;
    private oceanFloor: number = 700;

    constructor() {
        super({ key: 'OceanScene' });
    }

    create() {
        // Set world bounds (scrolling level)
        this.physics.world.setBounds(0, 0, this.levelWidth, 720);

        // Create ocean gradient background (tiled for scrolling)
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x1e90ff, 0x1e90ff, 0x0066cc, 0x0066cc, 1);
        graphics.fillRect(0, 0, this.levelWidth, 720);

        // Add ocean surface line
        const surfaceLine = this.add.graphics();
        surfaceLine.lineStyle(3, 0x87ceeb, 1);
        surfaceLine.lineBetween(0, this.oceanSurface, this.levelWidth, this.oceanSurface);

        // Add ocean floor line
        const floorLine = this.add.graphics();
        floorLine.lineStyle(2, 0x004080, 0.5);
        floorLine.lineBetween(0, this.oceanFloor, this.levelWidth, this.oceanFloor);

        // Add some visual depth markers (seaweed, rocks)
        this.addOceanDetails();

        // Add title
        const title = this.add.text(20, 20, 'THE BIG ADVENTURE - Level 1: Ocean Chase', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
        });
        title.setScrollFactor(0); // UI stays fixed

        // Add distance marker
        const distanceText = this.add.text(20, 50, 'Distance: 0m', {
            fontSize: '18px',
            color: '#ffffff',
        });
        distanceText.setScrollFactor(0);
        distanceText.setName('distanceText');

        // Create player (SmileyFaceBob)
        this.player = new Player(this, 200, 360, 'SmileyFaceBob');

        // Create enemy boat
        this.createEnemyBoat();

        // Set up keyboard controls (WASD for Player 1)
        this.wasdKeys = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
        }) as any;

        // Set camera to follow player (horizontal scrolling)
        this.cameras.main.setBounds(0, 0, this.levelWidth, 720);
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        
        // Keep camera vertically centered
        this.cameras.main.setDeadzone(200, 200);
    }

    private addOceanDetails() {
        // Add some simple ocean floor details
        const detailGraphics = this.add.graphics();
        
        for (let x = 0; x < this.levelWidth; x += 300) {
            // Random seaweed/rocks
            if (Math.random() > 0.5) {
                // Seaweed
                detailGraphics.fillStyle(0x006400, 0.3);
                detailGraphics.fillRect(x + Math.random() * 200, 680, 10, 20);
            } else {
                // Rocks
                detailGraphics.fillStyle(0x404040, 0.4);
                detailGraphics.fillCircle(x + Math.random() * 200, 695, 15);
            }
        }

        // Add grassland at the end
        const grassland = this.add.graphics();
        grassland.fillStyle(0x228b22, 1);
        grassland.fillRect(this.levelWidth - 500, 0, 500, 720);
        
        const grassText = this.add.text(this.levelWidth - 250, 360, 'GRASSLAND\nFINISH!', {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
        }).setOrigin(0.5);
    }

    private createEnemyBoat() {
        // Create simple enemy boat sprite
        const boatGraphics = this.add.graphics();
        
        // Boat hull
        boatGraphics.fillStyle(0x8b4513, 1);
        boatGraphics.fillTriangle(10, 40, 50, 40, 30, 10);
        
        // Sail
        boatGraphics.fillStyle(0xffffff, 1);
        boatGraphics.fillTriangle(25, 40, 25, 5, 45, 22);
        
        // Add flag
        boatGraphics.fillStyle(0xff0000, 1);
        boatGraphics.fillRect(45, 5, 10, 8);

        boatGraphics.generateTexture('enemyboat', 60, 50);
        boatGraphics.destroy();

        // Place boat at right edge of screen (stays in view)
        this.enemyBoat = this.add.sprite(1100, this.oceanSurface - 25, 'enemyboat');
        this.enemyBoat.setDepth(10);
    }

    update() {
        // Update player movement
        this.player.update(this.wasdKeys);

        // Update enemy boat position (stays at right edge of screen)
        const camera = this.cameras.main;
        this.enemyBoat.x = camera.scrollX + 1100;

        // Update distance display
        const distanceText = this.children.getByName('distanceText') as Phaser.GameObjects.Text;
        if (distanceText) {
            const distanceMeters = Math.floor(this.player.sprite.x / 10);
            distanceText.setText(`Distance: ${distanceMeters}m / ${this.levelWidth / 10}m`);
        }

        // Check for level completion
        if (this.player.sprite.x >= this.levelWidth - 500) {
            this.onLevelComplete();
        }
    }

    private onLevelComplete() {
        // Show victory message (we'll make this better later)
        const victoryText = this.add.text(640, 360, 'LEVEL COMPLETE!\n\nYou reached the grassland!', {
            fontSize: '48px',
            color: '#ffff00',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 },
        }).setOrigin(0.5);
        victoryText.setScrollFactor(0);

        // Stop player movement
        this.player.sprite.setVelocity(0, 0);
        
        // Transform boat to truck (just change color for now)
        this.enemyBoat.setTint(0xff8800);
    }
}
