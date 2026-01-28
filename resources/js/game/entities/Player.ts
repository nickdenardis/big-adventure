import Phaser from 'phaser';

export default class Player {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private swimSpeed: number = 200;
    private dragAmount: number = 0.85; // Water friction
    public characterName: string;
    private oceanSurface: number = 100;
    private oceanFloor: number = 700;
    
    // Player stats
    public health: number;
    public maxHealth: number;
    public coins: number = 0;
    public air: number = 100;
    public maxAir: number = 100;
    private isInvincible: boolean = false;
    private coinMultiplier: number = 1;
    private speedMultiplier: number = 1;
    private speedMode: number = 1; // 0=slow, 1=normal, 2=fast (for CrazyDuck)

    constructor(scene: Phaser.Scene, x: number, y: number, characterName: string) {
        this.scene = scene;
        this.characterName = characterName;

        // Set character-specific stats
        this.setCharacterStats();

        // Create character texture if not already created
        const textureName = this.getCharacterTexture();
        if (!scene.textures.exists(textureName)) {
            this.createCharacterTexture();
        }

        // Create physics sprite
        this.sprite = scene.physics.add.sprite(x, y, textureName);
        this.sprite.setCollideWorldBounds(true);
        
        // Set drag for water resistance
        this.sprite.setDrag(this.dragAmount * 1000);
        this.sprite.setMaxVelocity(250, 250);
    }

    private setCharacterStats() {
        switch (this.characterName) {
            case 'SmileyFaceBob':
                this.maxHealth = 5;
                this.health = 5;
                this.coinMultiplier = 2; // Double coins
                break;
            case 'Cutie':
                this.maxHealth = 5;
                this.health = 5;
                break;
            case 'ChillDuck':
                this.maxHealth = 10; // Double health
                this.health = 10;
                break;
            case 'CrazyDuck':
                this.maxHealth = 5;
                this.health = 5;
                break;
            default:
                this.maxHealth = 5;
                this.health = 5;
        }
    }

    private getCharacterTexture(): string {
        return `character_${this.characterName.toLowerCase()}`;
    }

    private createCharacterTexture() {
        const graphics = this.scene.add.graphics();
        const textureName = this.getCharacterTexture();
        
        switch (this.characterName) {
            case 'SmileyFaceBob':
                // Yellow smiley face stick figure
                graphics.fillStyle(0xffff00, 1);
                graphics.fillCircle(16, 16, 14);
                graphics.lineStyle(2, 0x000000, 1);
                graphics.fillStyle(0x000000, 1);
                graphics.fillCircle(10, 12, 2);
                graphics.fillCircle(22, 12, 2);
                graphics.beginPath();
                graphics.arc(16, 16, 8, 0, Math.PI, false);
                graphics.strokePath();
                break;
                
            case 'Cutie':
                // Gingerbread man with tiny face
                graphics.fillStyle(0xcd7f32, 1); // Brown/copper
                graphics.fillCircle(16, 12, 10); // Head
                graphics.fillRect(10, 20, 12, 8); // Body
                graphics.fillCircle(6, 26, 4); // Left arm
                graphics.fillCircle(26, 26, 4); // Right arm
                graphics.fillCircle(12, 32, 3); // Left leg
                graphics.fillCircle(20, 32, 3); // Right leg
                // Tiny face
                graphics.fillStyle(0x000000, 1);
                graphics.fillCircle(13, 11, 1);
                graphics.fillCircle(19, 11, 1);
                graphics.fillCircle(16, 14, 1);
                break;
                
            case 'ChillDuck':
                // Duck with headphones and phone
                graphics.fillStyle(0xffd700, 1); // Yellow duck
                graphics.fillCircle(16, 14, 10); // Head
                graphics.fillEllipse(16, 24, 12, 10); // Body
                // Beak
                graphics.fillStyle(0xff8c00, 1);
                graphics.fillTriangle(20, 14, 26, 12, 26, 16);
                // Eye
                graphics.fillStyle(0x000000, 1);
                graphics.fillCircle(14, 12, 2);
                // Headphones
                graphics.lineStyle(3, 0x000000, 1);
                graphics.arc(16, 14, 12, Math.PI, 0, false);
                // Phone
                graphics.fillStyle(0x333333, 1);
                graphics.fillRect(8, 22, 4, 6);
                break;
                
            case 'CrazyDuck':
                // Duck with crown and cape
                graphics.fillStyle(0xffd700, 1); // Yellow duck
                graphics.fillCircle(16, 16, 10); // Head
                graphics.fillEllipse(16, 26, 12, 10); // Body
                // Beak
                graphics.fillStyle(0xff8c00, 1);
                graphics.fillTriangle(20, 16, 26, 14, 26, 18);
                // Eye
                graphics.fillStyle(0x000000, 1);
                graphics.fillCircle(14, 14, 2);
                // Crown
                graphics.fillStyle(0xffd700, 1);
                graphics.fillRect(10, 4, 12, 6);
                graphics.fillTriangle(10, 4, 12, 0, 14, 4);
                graphics.fillTriangle(14, 4, 16, 0, 18, 4);
                graphics.fillTriangle(18, 4, 20, 0, 22, 4);
                // Cape
                graphics.fillStyle(0xff0000, 1);
                graphics.fillTriangle(4, 20, 10, 18, 10, 28);
                graphics.fillTriangle(22, 18, 28, 20, 22, 28);
                break;
        }
        
        graphics.generateTexture(textureName, 32, 36);
        graphics.destroy();
    }

    update(keys: {
        W?: Phaser.Input.Keyboard.Key;
        A?: Phaser.Input.Keyboard.Key;
        S?: Phaser.Input.Keyboard.Key;
        D?: Phaser.Input.Keyboard.Key;
        SPACE?: Phaser.Input.Keyboard.Key;
    }) {
        // Reset velocity
        let velocityX = 0;
        let velocityY = 0;

        // 8-directional swimming movement
        if (keys.W?.isDown) {
            velocityY = -this.swimSpeed;
        }
        if (keys.S?.isDown) {
            velocityY = this.swimSpeed;
        }
        if (keys.A?.isDown) {
            velocityX = -this.swimSpeed;
        }
        if (keys.D?.isDown) {
            velocityX = this.swimSpeed;
        }

        // Apply speed multiplier (for CrazyDuck)
        velocityX *= this.speedMultiplier;
        velocityY *= this.speedMultiplier;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707; // sqrt(2)/2
            velocityY *= 0.707;
        }

        // Apply velocity
        this.sprite.setVelocity(velocityX, velocityY);

        // Keep player within vertical bounds (surface to floor)
        if (this.sprite.y < this.oceanSurface) {
            this.sprite.y = this.oceanSurface;
            this.sprite.setVelocityY(0);
        }
        if (this.sprite.y > this.oceanFloor) {
            this.sprite.y = this.oceanFloor;
            this.sprite.setVelocityY(0);
        }

        // Add slight rotation based on movement direction (swimming animation)
        if (velocityX !== 0 || velocityY !== 0) {
            const angle = Math.atan2(velocityY, velocityX);
            this.sprite.setRotation(angle * 0.1); // Subtle tilt
        } else {
            // Return to upright when stopped
            this.sprite.setRotation(this.sprite.rotation * 0.9);
        }

        // Air system: deplete underwater, restore at surface
        if (this.sprite.y < this.oceanSurface + 20) {
            // At surface - restore air
            this.air = Math.min(this.maxAir, this.air + 2);
        } else {
            // Underwater - deplete air
            this.air = Math.max(0, this.air - 0.1);
            
            // Take damage if out of air
            if (this.air <= 0) {
                this.takeDamage(0.02); // Slow drowning damage
            }
        }

        // Character-specific abilities (handle key presses)
        if (keys.SPACE?.isDown) {
            this.useAbility();
        }
    }

    private useAbility() {
        // Ability logic will be implemented when we add multiplayer
        // For now, just handle CrazyDuck speed toggle
        if (this.characterName === 'CrazyDuck') {
            // Cycle through speed modes: slow (0.5x) -> normal (1x) -> fast (1.5x)
            this.speedMode = (this.speedMode + 1) % 3;
            switch (this.speedMode) {
                case 0:
                    this.speedMultiplier = 0.5;
                    break;
                case 1:
                    this.speedMultiplier = 1.0;
                    break;
                case 2:
                    this.speedMultiplier = 1.5;
                    break;
            }
        }
    }

    takeDamage(amount: number) {
        if (this.isInvincible) return;

        this.health = Math.max(0, this.health - amount);
        
        // Make invincible temporarily
        if (amount >= 1) {
            this.isInvincible = true;
            
            // Flash effect
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    this.sprite.alpha = 1;
                    this.isInvincible = false;
                }
            });
        }
    }

    collectCoin(amount: number) {
        // Apply coin multiplier (SmileyFaceBob gets 2x)
        this.coins += amount * this.coinMultiplier;
    }

    collectBubble() {
        this.air = Math.min(this.maxAir, this.air + 30);
    }

    getSpeedModeName(): string {
        switch (this.speedMode) {
            case 0: return 'Slow';
            case 1: return 'Normal';
            case 2: return 'Fast';
            default: return 'Normal';
        }
    }
}
