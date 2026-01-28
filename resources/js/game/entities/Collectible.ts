import Phaser from 'phaser';

export default class Collectible {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private type: 'coin' | 'multicoin' | 'bubble';
    private value: number;
    private floatSpeed: number = 30;

    constructor(scene: Phaser.Scene, x: number, y: number, type: 'coin' | 'multicoin' | 'bubble') {
        this.scene = scene;
        this.type = type;
        
        // Set values
        if (type === 'coin') {
            this.value = 1;
        } else if (type === 'multicoin') {
            this.value = 5; // Worth 5 coins
        } else {
            this.value = 0; // Bubble restores air
        }

        // Create texture if not exists
        const textureName = `collectible_${type}`;
        if (!scene.textures.exists(textureName)) {
            this.createTexture(type);
        }

        // Create sprite
        this.sprite = scene.physics.add.sprite(x, y, textureName);
        this.sprite.setData('value', this.value);
        this.sprite.setData('type', type);
        
        // Add floating animation
        scene.tweens.add({
            targets: this.sprite,
            y: y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    private createTexture(type: 'coin' | 'multicoin' | 'bubble') {
        const graphics = this.scene.add.graphics();
        
        if (type === 'coin') {
            // Gold coin
            graphics.fillStyle(0xffd700, 1);
            graphics.fillCircle(16, 16, 12);
            
            // Inner circle
            graphics.lineStyle(2, 0xffaa00, 1);
            graphics.strokeCircle(16, 16, 8);
            
            graphics.generateTexture('collectible_coin', 32, 32);
        } else if (type === 'multicoin') {
            // Multi-coin (larger, glowing)
            graphics.fillStyle(0xffd700, 1);
            graphics.fillCircle(16, 16, 14);
            
            // Number "5"
            const text = this.scene.add.text(16, 16, '5', {
                fontSize: '18px',
                color: '#ffffff',
                fontStyle: 'bold',
            }).setOrigin(0.5);
            
            graphics.generateTexture('collectible_multicoin', 32, 32);
            text.destroy();
        } else {
            // Air bubble
            graphics.fillStyle(0x87ceeb, 0.3);
            graphics.fillCircle(16, 16, 12);
            
            graphics.lineStyle(2, 0xffffff, 0.7);
            graphics.strokeCircle(16, 16, 12);
            
            // Highlight
            graphics.fillStyle(0xffffff, 0.5);
            graphics.fillCircle(12, 12, 4);
            
            graphics.generateTexture('collectible_bubble', 32, 32);
        }
        
        graphics.destroy();
    }

    destroy() {
        this.sprite.destroy();
    }
}
