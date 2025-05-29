/**
 * Mushroom entity for Mushroom Menace
 * Represents the mushroom caps that guide inchworm movement
 */
class Mushroom {
    constructor(x, y, width, height, gridX, gridY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gridX = gridX;
        this.gridY = gridY;
        this.health = 4; // Takes 4 hits to destroy
        this.poisoned = false; // For scorpion effect
    }
    
    hit() {
        if (this.health > 0) {
            this.health--;
            return this.health === 0; // Return true if destroyed
        }
        return false;
    }
    
    poison() {
        this.poisoned = true;
    }
    
    reset() {
        this.health = 4;
        this.poisoned = false;
    }
    
    isDestroyed() {
        return this.health === 0;
    }
}
