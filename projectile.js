/**
 * Projectile entity for Mushroom Menace
 * Represents the darts fired by the player
 */
class Projectile {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 8;
        this.active = true;
    }
    
    update() {
        // Move projectile upward
        this.y -= this.speed;
        
        // Deactivate if off screen
        if (this.y + this.height < 0) {
            this.active = false;
        }
    }
    
    reset() {
        this.active = false;
    }
}
