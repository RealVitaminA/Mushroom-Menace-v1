/**
 * Player entity for Mushroom Menace
 * Represents the Bug Blaster controlled by the player
 */
class Player {
    constructor(x, y, width, height, gameWidth) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameWidth = gameWidth;
        this.speed = 5;
        this.frameX = 0; // For animation
        this.frameCount = 2; // Number of animation frames
        this.frameTimer = 0;
        this.frameInterval = 10; // Update animation every 10 game ticks
    }
    
    update(inputManager) {
        // Handle keyboard movement
        if (inputManager.isMovingLeft()) {
            this.x -= this.speed;
            this.frameX = 1; // Left-facing frame
        } else if (inputManager.isMovingRight()) {
            this.x += this.speed;
            this.frameX = 0; // Right-facing frame
        }
        
        // Handle mouse movement (if in bottom third of screen)
        const mousePos = inputManager.getMousePosition();
        if (mousePos.y > this.y - 50) { // Only if mouse is near player area
            // Move towards mouse X position
            const targetX = mousePos.x - this.width / 2;
            const dx = targetX - this.x;
            
            // Only move if far enough from target
            if (Math.abs(dx) > this.speed) {
                this.x += Math.sign(dx) * this.speed;
                this.frameX = dx > 0 ? 0 : 1; // Set frame based on direction
            }
        }
        
        // Keep player within game bounds
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.gameWidth) {
            this.x = this.gameWidth - this.width;
        }
        
        // Update animation
        this.frameTimer++;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            // Only animate when moving
            if (inputManager.isMovingLeft() || inputManager.isMovingRight()) {
                this.frameX = (this.frameX + 1) % this.frameCount;
            }
        }
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.frameX = 0;
        this.frameTimer = 0;
    }
}
