import Phaser from 'phaser';

export default class Obstacle {
    public sprite: Phaser.Physics.Arcade.Sprite;
    private scene: Phaser.Scene;
    private type: 'spike' | 'bomb';
    private damage: number;
    private sinkSpeed: number = 104; // 30% faster than 80

    constructor(scene: Phaser.Scene, x: number, y: number, type: 'spike' | 'bomb') {
        this.scene = scene;
        this.type = type;
        this.damage = type === 'spike' ? 1 : 2;

        // Create texture if not exists
        const textureName = `obstacle_${type}`;
        if (!scene.textures.exists(textureName)) {
            this.createTexture(type);
        }

        // Create sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, textureName);
        
        // Enable physics body and set velocity
        if (this.sprite.body) {
            this.sprite.body.enable = true;
            this.sprite.setVelocityY(this.sinkSpeed); // Sink to ocean floor
        }
        
        this.sprite.setData('damage', this.damage);
        this.sprite.setData('type', type);
    }

    private createTexture(type: 'spike' | 'bomb') {
        const graphics = this.scene.add.graphics();
        
        if (type === 'spike') {
            // Create spike (dangerous looking!)
            graphics.fillStyle(0x808080, 1); // Gray
            graphics.fillTriangle(16, 0, 0, 32, 32, 32);
            
            // Add red tip
            graphics.fillStyle(0xff0000, 1);
            graphics.fillTriangle(16, 0, 10, 10, 22, 10);
            
            graphics.generateTexture('obstacle_spike', 32, 32);
        } else {
            // Create bomb (round with fuse)
            graphics.fillStyle(0x1a1a1a, 1); // Black
            graphics.fillCircle(16, 20, 12);
            
            // Fuse
            graphics.lineStyle(2, 0x8b4513, 1);
            graphics.lineBetween(16, 8, 16, 14);
            
            // Highlight
            graphics.fillStyle(0xffffff, 0.3);
            graphics.fillCircle(12, 16, 4);
            
            graphics.generateTexture('obstacle_bomb', 32, 32);
        }
        
        graphics.destroy();
    }

    update() {
        // Ensure velocity is still set
        if (this.sprite.body) {
            const body = this.sprite.body as Phaser.Physics.Arcade.Body;
            
            if (body.velocity.y === 0 && this.sprite.y < 700) {
                body.setVelocityY(this.sinkSpeed);
            }
        }
        
        // Stop sinking at ocean floor
        if (this.sprite.y >= 700) {
            this.sprite.setVelocityY(0);
            this.sprite.y = 700;
        }

        // Add slight rotation while falling
        if (this.sprite.body && this.sprite.body.velocity.y > 0) {
            this.sprite.rotation += 0.03; // Slower rotation
        }
    }

    destroy() {
        this.sprite.destroy();
    }
}
