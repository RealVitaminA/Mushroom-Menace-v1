/**
 * Scorpion enemy entity for Mushroom Menace
 * Moves horizontally and poisons mushrooms
 */
class Scorpion {
    constructor(x, y, width, height, gameWidth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameWidth = gameWidth;
        this.speed = 2;
        this.direction = Math.random() < 0.5 ? -1 : 1;
        this.active = true;
        this.frameX = 0; // For animation
        this.frameCount = 2; // Number of animation frames
        this.frameTimer = 0;
        this.frameInterval = 8; // Update animation every 8 game ticks
    }
    
    update() {
        // Move horizontally
        this.x += this.speed * this.direction;
        
        // Deactivate if off screen
        if ((this.direction < 0 && this.x + this.width < 0) || 
            (this.direction > 0 && this.x > this.gameWidth)) {
            this.active = false;
        }
        
        // Update animation
        this.frameTimer++;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            this.frameX = (this.frameX + 1) % this.frameCount;
        }
    }
    
    checkMushroomCollision(mushroom) {
        return (
            this.x < mushroom.x + mushroom.width &&
            this.x + this.width > mushroom.x &&
            this.y < mushroom.y + mushroom.height &&
            this.y + this.height > mushroom.y
        );
    }
}
