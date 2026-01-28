import Phaser from 'phaser';

export default class Player {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private swimSpeed: number = 200;
    private dragAmount: number = 0.85; // Water friction
    private characterName: string;
    private oceanSurface: number = 100;
    private oceanFloor: number = 700;

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
    }
}
