import Phaser from 'phaser';

export default class Player {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private swimSpeed: number = 200;
    private dragAmount: number = 0.85; // Water friction

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;

        // Create a simple circle for SmileyFaceBob (stick figure head for now)
        const graphics = scene.add.graphics();
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

        // Create physics sprite
        this.sprite = scene.physics.add.sprite(x, y, 'smileyface');
        this.sprite.setCollideWorldBounds(true);
        
        // Set drag for water resistance
        this.sprite.setDrag(this.dragAmount * 1000);
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

        // Keep player within bounds (surface to floor)
        if (this.sprite.y < 100) {
            this.sprite.y = 100;
        }
        if (this.sprite.y > 700) {
            this.sprite.y = 700;
        }
    }
}
