/**
 * Flea enemy entity for Mushroom Menace
 * Drops straight down and spawns new mushrooms
 */
class Flea {
    constructor(x, y, width, height, gridSize) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gridSize = gridSize;
        this.speed = 4;
        this.health = 2; // Takes 2 hits to destroy
        this.active = true;
        this.frameX = 0; // For animation
        this.frameCount = 2; // Number of animation frames
        this.frameTimer = 0;
        this.frameInterval = 5; // Update animation every 5 game ticks
    }
    
    update(gameHeight) {
        // Move downward
        this.y += this.speed;
        
        // Update animation
        this.frameTimer++;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            this.frameX = (this.frameX + 1) % this.frameCount;
        }
        
        // Deactivate if off screen
        if (this.y > gameHeight) {
            this.active = false;
        }
    }
    
    hit() {
        if (this.health > 0) {
            this.health--;
            return this.health === 0; // Return true if destroyed
        }
        return false;
    }
    
    getGridPosition() {
        return {
            gridX: Math.floor(this.x / this.gridSize),
            gridY: Math.floor(this.y / this.gridSize)
        };
    }
}
