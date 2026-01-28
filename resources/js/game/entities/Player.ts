import Phaser from 'phaser';

export default class Player {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private swimSpeed: number = 200;
    private dragAmount: number = 0.85; // Water friction
    private characterName: string;
    private oceanSurface: number = 100;
    private oceanFloor: number = 700;
    
    // Player stats
    public health: number = 5;
    public maxHealth: number = 5;
    public coins: number = 0;
    public air: number = 100;
    public maxAir: number = 100;
    private isInvincible: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, characterName: string) {
        this.scene = scene;
        this.characterName = characterName;

        // Create character texture if not already created
        if (!scene.textures.exists('smileyface')) {
            this.createSmileyFaceTexture();
        }

        // Create physics sprite
        this.sprite = scene.physics.add.sprite(x, y, 'smileyface');
        this.sprite.setCollideWorldBounds(true);
        
        // Set drag for water resistance
        this.sprite.setDrag(this.dragAmount * 1000);
        this.sprite.setMaxVelocity(250, 250);
    }

    private createSmileyFaceTexture() {
        // Create a simple circle for SmileyFaceBob (stick figure head for now)
        const graphics = this.scene.add.graphics();
        graphics.fillStyle(0xffff00, 1); // Yellow
        graphics.fillCircle(16, 16, 16); // 32px diameter circle
        
        // Add smiley face
        graphics.lineStyle(2, 0x000000, 1);
        // Eyes
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(10, 12, 2);
        graphics.fillCircle(22, 12, 2);
        // Smile
        graphics.beginPath();
        graphics.arc(16, 16, 8, 0, Math.PI, false);
        graphics.strokePath();

        graphics.generateTexture('smileyface', 32, 32);
        graphics.destroy();
    }

    update(keys: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    }) {
        // Reset velocity
        let velocityX = 0;
        let velocityY = 0;

        // 8-directional swimming movement
        if (keys.W.isDown) {
            velocityY = -this.swimSpeed;
        }
        if (keys.S.isDown) {
            velocityY = this.swimSpeed;
        }
        if (keys.A.isDown) {
            velocityX = -this.swimSpeed;
        }
        if (keys.D.isDown) {
            velocityX = this.swimSpeed;
        }

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
        this.coins += amount;
    }

    collectBubble() {
        this.air = Math.min(this.maxAir, this.air + 30);
    }
}
