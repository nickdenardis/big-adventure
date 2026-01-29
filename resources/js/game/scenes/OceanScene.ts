import Phaser from 'phaser';
import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Collectible from '../entities/Collectible';
import SoundManager from '../utils/SoundManager';

export default class OceanScene extends Phaser.Scene {
    private players: Player[] = [];
    private controlSets: any[] = [];
    private enemyBoat!: Phaser.GameObjects.Sprite;
    private enemyTruck!: Phaser.GameObjects.Sprite;
    private levelWidth: number = 5000;
    private oceanSurface: number = 100;
    private oceanFloor: number = 700;
    private soundManager!: SoundManager;
    
    // Game objects
    private obstacles: Obstacle[] = [];
    private collectibles: Collectible[] = [];
    private obstacleGroup!: Phaser.Physics.Arcade.Group;
    private collectibleGroup!: Phaser.Physics.Arcade.Group;
    
    // Spawn timers
    private lastObstacleSpawn: number = 0;
    private lastCollectibleSpawn: number = 0;
    private spawnPatternIndex: number = 0;
    
    // Game state
    private gameStartTime: number = 0;
    private levelComplete: boolean = false;
    private gameOver: boolean = false;

    constructor() {
        super({ key: 'OceanScene' });
    }

    create() {
        // Get selected characters from global
        const selectedCharacters = (window as any).selectedCharacters || ['SmileyFaceBob'];
        
        // Record game start time
        this.gameStartTime = Date.now() / 1000;
        
        // Initialize sound manager
        this.soundManager = new SoundManager();
        this.soundManager.startBackgroundMusic();
        
        // Create particle texture for effects
        this.createParticleTexture();
        
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

        // Create players with selected characters
        const startX = 200;
        const startY = 360;
        selectedCharacters.forEach((characterName: string, index: number) => {
            const player = new Player(
                this, 
                startX, 
                startY + (index * 50), // Offset each player vertically
                characterName,
                this.soundManager
            );
            this.players.push(player);
            
            // Set up collisions for this player
            this.physics.add.overlap(
                player.sprite,
                this.obstacleGroup,
                (playerSprite: any, obstacleSprite: any) => this.handleObstacleHit(player, obstacleSprite),
                undefined,
                this
            );

            this.physics.add.overlap(
                player.sprite,
                this.collectibleGroup,
                (playerSprite: any, collectibleSprite: any) => this.handleCollectiblePickup(player, collectibleSprite),
                undefined,
                this
            );
        });

        // Create enemy boat
        this.createEnemyBoat();

        // Set up keyboard controls for each player
        this.setupControls();

        // Set camera to follow players
        this.setupCamera();
    }

    private createHUD() {
        // HUD is now handled by React - no longer needed in Phaser
    }
    
    private setupControls() {
        // Player 1: WASD + Space
        if (this.players[0]) {
            this.controlSets[0] = this.input.keyboard!.addKeys({
                UP: Phaser.Input.Keyboard.KeyCodes.W,
                LEFT: Phaser.Input.Keyboard.KeyCodes.A,
                DOWN: Phaser.Input.Keyboard.KeyCodes.S,
                RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
                ABILITY: Phaser.Input.Keyboard.KeyCodes.SPACE,
            });
        }
        
        // Player 2: Arrow Keys + Enter
        if (this.players[1]) {
            this.controlSets[1] = this.input.keyboard!.addKeys({
                UP: Phaser.Input.Keyboard.KeyCodes.UP,
                LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
                DOWN: Phaser.Input.Keyboard.KeyCodes.DOWN,
                RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
                ABILITY: Phaser.Input.Keyboard.KeyCodes.ENTER,
            });
        }
        
        // Player 3: TFGH + Y
        if (this.players[2]) {
            this.controlSets[2] = this.input.keyboard!.addKeys({
                UP: Phaser.Input.Keyboard.KeyCodes.T,
                LEFT: Phaser.Input.Keyboard.KeyCodes.F,
                DOWN: Phaser.Input.Keyboard.KeyCodes.G,
                RIGHT: Phaser.Input.Keyboard.KeyCodes.H,
                ABILITY: Phaser.Input.Keyboard.KeyCodes.Y,
            });
        }
        
        // Player 4: IJKL + U
        if (this.players[3]) {
            this.controlSets[3] = this.input.keyboard!.addKeys({
                UP: Phaser.Input.Keyboard.KeyCodes.I,
                LEFT: Phaser.Input.Keyboard.KeyCodes.J,
                DOWN: Phaser.Input.Keyboard.KeyCodes.K,
                RIGHT: Phaser.Input.Keyboard.KeyCodes.L,
                ABILITY: Phaser.Input.Keyboard.KeyCodes.U,
            });
        }
    }
    
    private setupCamera() {
        this.cameras.main.setBounds(0, 0, this.levelWidth, 720);
        // Don't use startFollow - we'll manually control camera in update for all modes
    }
    
    private createParticleTexture() {
        // Create a simple circular particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
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
        // Create boat texture
        const boatGraphics = this.add.graphics();
        boatGraphics.fillStyle(0x8b4513, 1);
        boatGraphics.fillTriangle(10, 40, 50, 40, 30, 10);
        boatGraphics.fillStyle(0xffffff, 1);
        boatGraphics.fillTriangle(25, 40, 25, 5, 45, 22);
        boatGraphics.fillStyle(0xff0000, 1);
        boatGraphics.fillRect(45, 5, 10, 8);
        boatGraphics.generateTexture('enemyboat', 60, 50);
        boatGraphics.destroy();

        // Create truck texture
        const truckGraphics = this.add.graphics();
        truckGraphics.fillStyle(0x8b4513, 1);
        truckGraphics.fillRect(10, 15, 40, 25);
        truckGraphics.fillStyle(0xff0000, 1);
        truckGraphics.fillRect(15, 10, 15, 15);
        truckGraphics.fillStyle(0x87ceeb, 1);
        truckGraphics.fillRect(16, 12, 6, 8);
        truckGraphics.fillRect(23, 12, 6, 8);
        truckGraphics.fillStyle(0x333333, 1);
        truckGraphics.fillCircle(20, 40, 5);
        truckGraphics.fillCircle(40, 40, 5);
        truckGraphics.generateTexture('enemytruck', 60, 50);
        truckGraphics.destroy();

        this.enemyBoat = this.add.sprite(1100, this.oceanSurface - 25, 'enemyboat');
        this.enemyBoat.setDepth(10);
        
        // Create truck but hide it initially
        this.enemyTruck = this.add.sprite(this.levelWidth - 250, 600, 'enemytruck');
        this.enemyTruck.setDepth(10);
        this.enemyTruck.setVisible(false);
    }

    private spawnObstacles() {
        const camera = this.cameras.main;
        const spawnX = camera.scrollX + 1000; // Spawn 1000 pixels ahead
        
        // Random spawn (above water surface) - increased frequency
        if (Math.random() > 0.5) { // Was 0.7, now more frequent
            const type = Math.random() > 0.6 ? 'bomb' : 'spike';
            const spawnY = 50; // Above ocean surface
            const obstacle = new Obstacle(this, spawnX, spawnY, type);
            this.obstacles.push(obstacle);
            this.obstacleGroup.add(obstacle.sprite);
        }
        
        // Pattern spawn every 1000px (based on lead player position)
        if (this.players.length > 0) {
            const leadPlayerX = Math.max(...this.players.map(p => p.sprite.x));
            if (Math.floor(leadPlayerX / 1000) > this.spawnPatternIndex) {
                this.spawnPatternIndex = Math.floor(leadPlayerX / 1000);
                this.spawnObstaclePattern(camera.scrollX + 800);
            }
        }
    }

    private spawnObstaclePattern(startX: number) {
        // Create a pattern of obstacles
        for (let i = 0; i < 3; i++) {
            const spawnY = 30 + i * 20; // Staggered heights above surface
            const obstacle = new Obstacle(this, startX + i * 150, spawnY, 'spike');
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

    private handleObstacleHit(player: Player, obstacleSprite: any) {
        const damage = obstacleSprite.getData('damage');
        player.takeDamage(damage);
        
        // Destroy obstacle
        const obstacle = this.obstacles.find(o => o.sprite === obstacleSprite);
        if (obstacle) {
            obstacle.destroy();
            this.obstacles = this.obstacles.filter(o => o !== obstacle);
        }
    }

    private handleCollectiblePickup(player: Player, collectibleSprite: any) {
        const type = collectibleSprite.getData('type');
        const value = collectibleSprite.getData('value');
        
        if (type === 'bubble') {
            player.collectBubble();
            this.soundManager.playBubbleSound();
        } else {
            player.collectCoin(value);
            // Play appropriate coin sound
            if (value > 1) {
                this.soundManager.playMultiCoinSound();
            } else {
                this.soundManager.playCoinSound();
            }
        }
        
        // Destroy collectible
        const collectible = this.collectibles.find(c => c.sprite === collectibleSprite);
        if (collectible) {
            collectible.destroy();
            this.collectibles = this.collectibles.filter(c => c !== collectible);
        }
    }

    update(time: number, delta: number) {
        // Don't update if game is over or level complete
        if (this.levelComplete || this.gameOver) {
            return;
        }

        // Update all players
        this.players.forEach((player, index) => {
            if (this.controlSets[index]) {
                player.update(this.controlSets[index], this.players); // Pass all players for abilities
            }
        });

        // Update camera to follow players
        this.updateCamera();
        
        // Constrain all players to stay within camera bounds
        this.constrainPlayersToCamera();

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
        
        // Add bobbing animation to boat
        this.enemyBoat.y = this.oceanSurface - 25 + Math.sin(time / 200) * 5;

        // Update HUD
        this.updateHUD();

        // Clean up off-screen objects
        this.cleanupObjects();

        // Check for level completion (any ALIVE player reaches end)
        const anyAlivePlayerAtEnd = this.players.some(p => p.health > 0 && p.sprite.x >= this.levelWidth - 500);
        if (anyAlivePlayerAtEnd) {
            this.onLevelComplete();
        }

        // Check for game over (all players dead)
        const allPlayersDead = this.players.every(p => p.health <= 0);
        if (allPlayersDead) {
            this.onGameOver();
        }
    }
    
    private updateCamera() {
        // Calculate average position of all alive players
        const alivePlayers = this.players.filter(p => p.health > 0);
        if (alivePlayers.length === 0) return;
        
        // Find the spread of players
        const rightmostX = Math.max(...alivePlayers.map(p => p.sprite.x));
        const leftmostX = Math.min(...alivePlayers.map(p => p.sprite.x));
        
        // Camera should show all players
        // Position camera so leftmost player has some margin from left edge
        // and rightmost player has margin from right edge
        const leftMargin = 200;
        const rightMargin = 200;
        
        // Calculate ideal camera position to keep all players visible
        const idealScrollX = leftmostX - leftMargin;
        
        // But also make sure rightmost player isn't too close to right edge
        const minScrollForRightPlayer = rightmostX - (1280 - rightMargin);
        
        // Use the larger of the two (prioritize keeping everyone visible)
        let targetScrollX = Math.max(idealScrollX, minScrollForRightPlayer);
        
        // Camera can only move forward (never backward)
        targetScrollX = Math.max(targetScrollX, this.cameras.main.scrollX);
        
        // Smoothly pan camera to target position
        const lerpFactor = 0.05; // Slower to encourage players to stay together
        this.cameras.main.scrollX += (targetScrollX - this.cameras.main.scrollX) * lerpFactor;
        this.cameras.main.scrollY = 0; // Keep Y fixed for this game
        
        // Clamp camera to world bounds
        this.cameras.main.scrollX = Phaser.Math.Clamp(this.cameras.main.scrollX, 0, this.levelWidth - 1280);
    }
    
    private constrainPlayersToCamera() {
        // Get camera boundaries with margins
        const cameraLeft = this.cameras.main.scrollX + 100;
        const cameraRight = this.cameras.main.scrollX + 1280 - 100;
        const cameraTop = this.oceanSurface;
        const cameraBottom = this.oceanFloor;
        
        // Keep all players within camera bounds
        this.players.forEach(player => {
            if (player.health <= 0) return; // Don't constrain dead players
            
            let constrained = false;
            
            // Constrain horizontally
            if (player.sprite.x < cameraLeft) {
                player.sprite.x = cameraLeft;
                player.sprite.setVelocityX(Math.max(0, player.sprite.body.velocity.x)); // Can't go left
                constrained = true;
            } else if (player.sprite.x > cameraRight) {
                player.sprite.x = cameraRight;
                player.sprite.setVelocityX(Math.min(0, player.sprite.body.velocity.x)); // Can't go right
                constrained = true;
            }
            
            // Vertical bounds are already handled by Player class (ocean surface/floor)
            
            // Visual feedback when hitting boundary
            if (constrained) {
                player.sprite.setTint(0xffff00); // Yellow flash
                this.time.delayedCall(100, () => {
                    // Clear tint unless it's CrazyDuck with speed tint
                    const crazyDuckTints = [0x8888ff, 0xff8888];
                    if (player.characterName !== 'CrazyDuck' || !crazyDuckTints.includes(player.sprite.tint as number)) {
                        player.sprite.clearTint();
                    }
                });
            }
        });
    }

    private updateHUD() {
        // Update React HUD using global callback - send all players' data
        if ((window as any).updateGameState && this.players.length > 0) {
            // Get lead player for distance
            const leadPlayerX = Math.max(...this.players.map(p => p.sprite.x));
            
            (window as any).updateGameState({
                players: this.players.map(player => ({
                    health: player.health,
                    maxHealth: player.maxHealth,
                    coins: player.coins,
                    air: player.air,
                    maxAir: player.maxAir,
                    characterName: player.characterName,
                    speedMode: player.characterName === 'CrazyDuck' ? player.getSpeedModeName() : undefined,
                })),
                distance: Math.floor(leadPlayerX / 10),
                maxDistance: this.levelWidth / 10,
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
        if (this.levelComplete) return;
        this.levelComplete = true;
        
        // Stop background music and play victory sound
        this.soundManager.stopBackgroundMusic();
        this.soundManager.playVictorySound();
        
        // Stop all alive players movement
        this.players.forEach(player => {
            if (player.health > 0) {
                player.sprite.setVelocity(0, 0);
            }
        });
        
        // Animate boat -> truck transformation
        this.transformBoatToTruck();
        
        // Calculate stats (only count surviving players)
        const timeElapsed = Date.now() / 1000 - this.gameStartTime;
        const alivePlayers = this.players.filter(p => p.health > 0);
        const totalCoins = this.players.reduce((sum, p) => sum + p.coins, 0); // All coins count
        const totalHeartsRemaining = alivePlayers.reduce((sum, p) => sum + p.health, 0); // Only alive
        const totalMaxHearts = alivePlayers.reduce((sum, p) => sum + p.maxHealth, 0); // Only alive
        const survivorCount = alivePlayers.length;
        
        // Delay showing victory screen until after transformation (2 seconds)
        this.time.delayedCall(2000, () => {
            // Notify React to show victory screen
            if ((window as any).onVictory) {
                const characterDisplay = this.players.length > 1 
                    ? `${survivorCount}/${this.players.length} Players Survived` 
                    : this.players[0].characterName;
                    
                (window as any).onVictory({
                    coins: totalCoins,
                    timeElapsed: timeElapsed,
                    heartsRemaining: totalHeartsRemaining,
                    maxHearts: totalMaxHearts,
                    characterName: characterDisplay,
                });
            }
        });
        
        // Stop physics
        this.physics.pause();
    }
    
    private transformBoatToTruck() {
        // Position truck where boat currently is
        this.enemyTruck.setPosition(this.enemyBoat.x, 600);
        
        // Fade out boat
        this.tweens.add({
            targets: this.enemyBoat,
            alpha: 0,
            y: this.enemyBoat.y - 50, // Float up as it fades
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                this.enemyBoat.setVisible(false);
            }
        });
        
        // Show truck with animation (delayed slightly)
        this.time.delayedCall(400, () => {
            this.enemyTruck.setVisible(true);
            this.enemyTruck.setAlpha(0);
            this.enemyTruck.setScale(0.5);
            this.enemyTruck.setRotation(-0.3);
            
            this.tweens.add({
                targets: this.enemyTruck,
                alpha: 1,
                scale: 1.2,
                rotation: 0,
                duration: 600,
                ease: 'Back.easeOut',
                onComplete: () => {
                    // Settle to normal size
                    this.tweens.add({
                        targets: this.enemyTruck,
                        scale: 1,
                        duration: 200,
                        ease: 'Sine.easeOut',
                    });
                }
            });
        });
    }

    private onGameOver() {
        if (this.gameOver) return;
        this.gameOver = true;
        
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
