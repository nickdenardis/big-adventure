import Phaser from 'phaser';
import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Collectible from '../entities/Collectible';

export default class OceanScene extends Phaser.Scene {
    private player!: Player;
    private wasdKeys!: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
        SPACE: Phaser.Input.Keyboard.Key;
    };
    private enemyBoat!: Phaser.GameObjects.Sprite;
    private levelWidth: number = 5000;
    private oceanSurface: number = 100;
    private oceanFloor: number = 700;
    
    // Game objects
    private obstacles: Obstacle[] = [];
    private collectibles: Collectible[] = [];
    private obstacleGroup!: Phaser.Physics.Arcade.Group;
    private collectibleGroup!: Phaser.Physics.Arcade.Group;
    
    // Spawn timers
    private lastObstacleSpawn: number = 0;
    private lastCollectibleSpawn: number = 0;
    private spawnPatternIndex: number = 0;

    constructor() {
        super({ key: 'OceanScene' });
    }

    create() {
        // Get selected character from global
        const selectedCharacter = (window as any).selectedCharacter || 'SmileyFaceBob';
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

        // Add some visual depth markers
        this.addOceanDetails();

        // Create physics groups
        this.obstacleGroup = this.physics.add.group();
        this.collectibleGroup = this.physics.add.group();

        // Create player with selected character
        this.player = new Player(this, 200, 360, selectedCharacter);

        // Create enemy boat
        this.createEnemyBoat();

        // Set up keyboard controls
        this.wasdKeys = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        }) as any;

        // Set up collisions
        this.physics.add.overlap(
            this.player.sprite,
            this.obstacleGroup,
            this.handleObstacleHit.bind(this),
            undefined,
            this
        );

        this.physics.add.overlap(
            this.player.sprite,
            this.collectibleGroup,
            this.handleCollectiblePickup.bind(this),
            undefined,
            this
        );

        // Set camera to follow player
        this.cameras.main.setBounds(0, 0, this.levelWidth, 720);
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(200, 200);
    }

    private createHUD() {
        // HUD is now handled by React - no longer needed in Phaser
    }

    private addOceanDetails() {
        const detailGraphics = this.add.graphics();
        
        for (let x = 0; x < this.levelWidth; x += 300) {
            if (Math.random() > 0.5) {
                detailGraphics.fillStyle(0x006400, 0.3);
                detailGraphics.fillRect(x + Math.random() * 200, 680, 10, 20);
            } else {
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
        const boatGraphics = this.add.graphics();
        boatGraphics.fillStyle(0x8b4513, 1);
        boatGraphics.fillTriangle(10, 40, 50, 40, 30, 10);
        boatGraphics.fillStyle(0xffffff, 1);
        boatGraphics.fillTriangle(25, 40, 25, 5, 45, 22);
        boatGraphics.fillStyle(0xff0000, 1);
        boatGraphics.fillRect(45, 5, 10, 8);
        boatGraphics.generateTexture('enemyboat', 60, 50);
        boatGraphics.destroy();

        this.enemyBoat = this.add.sprite(1100, this.oceanSurface - 25, 'enemyboat');
        this.enemyBoat.setDepth(10);
    }

    private spawnObstacles() {
        const camera = this.cameras.main;
        const spawnX = camera.scrollX + 1280 + 100;
        
        // Random spawn
        if (Math.random() > 0.7) {
            const type = Math.random() > 0.6 ? 'bomb' : 'spike';
            const obstacle = new Obstacle(this, spawnX, 0, type);
            this.obstacles.push(obstacle);
            this.obstacleGroup.add(obstacle.sprite);
        }
        
        // Pattern spawn every 1000px
        if (Math.floor(this.player.sprite.x / 1000) > this.spawnPatternIndex) {
            this.spawnPatternIndex = Math.floor(this.player.sprite.x / 1000);
            this.spawnObstaclePattern(spawnX);
        }
    }

    private spawnObstaclePattern(startX: number) {
        // Create a pattern of obstacles
        for (let i = 0; i < 3; i++) {
            const obstacle = new Obstacle(this, startX + i * 100, 0, 'spike');
            this.obstacles.push(obstacle);
            this.obstacleGroup.add(obstacle.sprite);
        }
    }

    private spawnCollectibles() {
        const camera = this.cameras.main;
        const spawnX = camera.scrollX + 1280 + 100;
        
        if (Math.random() > 0.6) {
            const randomY = 150 + Math.random() * 500;
            const type = Math.random() > 0.9 ? 'multicoin' : 'coin';
            const collectible = new Collectible(this, spawnX, randomY, type);
            this.collectibles.push(collectible);
            this.collectibleGroup.add(collectible.sprite);
        }
        
        // Spawn bubbles
        if (Math.random() > 0.8) {
            const randomY = 200 + Math.random() * 400;
            const bubble = new Collectible(this, spawnX, randomY, 'bubble');
            this.collectibles.push(bubble);
            this.collectibleGroup.add(bubble.sprite);
        }
    }

    private handleObstacleHit(playerSprite: any, obstacleSprite: any) {
        const damage = obstacleSprite.getData('damage');
        this.player.takeDamage(damage);
        
        // Destroy obstacle
        const obstacle = this.obstacles.find(o => o.sprite === obstacleSprite);
        if (obstacle) {
            obstacle.destroy();
            this.obstacles = this.obstacles.filter(o => o !== obstacle);
        }
    }

    private handleCollectiblePickup(playerSprite: any, collectibleSprite: any) {
        const type = collectibleSprite.getData('type');
        const value = collectibleSprite.getData('value');
        
        if (type === 'bubble') {
            this.player.collectBubble();
        } else {
            this.player.collectCoin(value);
        }
        
        // Destroy collectible
        const collectible = this.collectibles.find(c => c.sprite === collectibleSprite);
        if (collectible) {
            collectible.destroy();
            this.collectibles = this.collectibles.filter(c => c !== collectible);
        }
    }

    update(time: number, delta: number) {
        // Update player
        this.player.update(this.wasdKeys);

        // Update obstacles
        this.obstacles.forEach(obstacle => obstacle.update());

        // Spawn obstacles and collectibles
        if (time > this.lastObstacleSpawn + 800) {
            this.spawnObstacles();
            this.lastObstacleSpawn = time;
        }

        if (time > this.lastCollectibleSpawn + 600) {
            this.spawnCollectibles();
            this.lastCollectibleSpawn = time;
        }

        // Update enemy boat position
        const camera = this.cameras.main;
        this.enemyBoat.x = camera.scrollX + 1100;

        // Update HUD
        this.updateHUD();

        // Clean up off-screen objects
        this.cleanupObjects();

        // Check for level completion
        if (this.player.sprite.x >= this.levelWidth - 500) {
            this.onLevelComplete();
        }

        // Check for game over
        if (this.player.health <= 0) {
            this.onGameOver();
        }
    }

    private updateHUD() {
        // Update React HUD using global callback
        if ((window as any).updateGameState) {
            (window as any).updateGameState({
                health: this.player.health,
                maxHealth: this.player.maxHealth,
                coins: this.player.coins,
                air: this.player.air,
                maxAir: this.player.maxAir,
                distance: Math.floor(this.player.sprite.x / 10),
                maxDistance: this.levelWidth / 10,
                characterName: this.player.characterName,
                speedMode: this.player.characterName === 'CrazyDuck' ? this.player.getSpeedModeName() : undefined,
            });
        }
    }

    private cleanupObjects() {
        const camera = this.cameras.main;
        
        // Remove obstacles behind camera
        this.obstacles = this.obstacles.filter(obstacle => {
            if (obstacle.sprite.x < camera.scrollX - 200) {
                obstacle.destroy();
                return false;
            }
            return true;
        });

        // Remove collectibles behind camera
        this.collectibles = this.collectibles.filter(collectible => {
            if (collectible.sprite.x < camera.scrollX - 200) {
                collectible.destroy();
                return false;
            }
            return true;
        });
    }

    private onLevelComplete() {
        const victoryText = this.add.text(640, 360, 'LEVEL COMPLETE!\n\nYou reached the grassland!\n\nCoins: ' + this.player.coins, {
            fontSize: '48px',
            color: '#ffff00',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 },
        }).setOrigin(0.5);
        victoryText.setScrollFactor(0);

        this.player.sprite.setVelocity(0, 0);
        this.enemyBoat.setTint(0xff8800);
        
        // Stop spawning
        this.physics.pause();
    }

    private onGameOver() {
        const gameOverText = this.add.text(640, 360, 'GAME OVER!\n\nYou ran out of health!', {
            fontSize: '48px',
            color: '#ff0000',
            fontStyle: 'bold',
            align: 'center',
            backgroundColor: '#000000',
            padding: { x: 20, y: 20 },
        }).setOrigin(0.5);
        gameOverText.setScrollFactor(0);

        this.physics.pause();
    }
}
