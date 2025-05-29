/**
 * Spider enemy entity for Mushroom Menace
 * Zig-zags across the lower area and eats mushrooms
 */
class Spider {
    constructor(x, y, width, height, gameWidth, playerY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.gameWidth = gameWidth;
        this.playerY = playerY; // Bottom area where player moves
        this.speedX = 3;
        this.speedY = 2;
        this.directionX = Math.random() < 0.5 ? -1 : 1;
        this.directionY = Math.random() < 0.5 ? -1 : 1;
        this.active = true;
        this.frameX = 0; // For animation
        this.frameCount = 2; // Number of animation frames
        this.frameTimer = 0;
        this.frameInterval = 5; // Update animation every 5 game ticks
    }
    
    update() {
        // Move in zig-zag pattern
        this.x += this.speedX * this.directionX;
        this.y += this.speedY * this.directionY;
        
        // Bounce off edges
        if (this.x <= 0 || this.x + this.width >= this.gameWidth) {
            this.directionX *= -1;
        }
        
        // Bounce within player area
        const minY = this.playerY - this.height * 3;
        const maxY = this.playerY - this.height;
        
        if (this.y <= minY || this.y >= maxY) {
            this.directionY *= -1;
        }
        
        // Update animation
        this.frameTimer++;
        if (this.frameTimer >= this.frameInterval) {
            this.frameTimer = 0;
            this.frameX = (this.frameX + 1) % this.frameCount;
        }
    }
    
    getPointValue(playerY) {
        // Point value scales by shot range
        const distance = this.y - playerY;
        if (distance > 200) {
            return 900; // Far shot
        } else if (distance > 100) {
            return 600; // Medium shot
        } else {
            return 300; // Close shot
        }
    }
}
