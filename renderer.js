/**
 * Renderer for Mushroom Menace
 * Handles canvas drawing operations
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.sprites = {};
        this.loaded = false;
        
        // Set up pixel art rendering
        this.ctx.imageSmoothingEnabled = false;
        
        // Load sprite sheets
        this.loadSprites();
    }
    
    loadSprites() {
        // Define sprite sheets to load
        const spriteSheets = {
            'player': 'assets/images/player.png',
            'mushrooms': 'assets/images/mushrooms.png',
            'inchworm': 'assets/images/inchworm.png',
            'enemies': 'assets/images/enemies.png',
            'projectile': 'assets/images/projectile.png',
            'explosion': 'assets/images/explosion.png'
        };
        
        let loadedCount = 0;
        const totalSprites = Object.keys(spriteSheets).length;
        
        // Load each sprite sheet
        for (const [name, path] of Object.entries(spriteSheets)) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalSprites) {
                    this.loaded = true;
                    console.log('All sprites loaded');
                }
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${name}`);
            };
            img.src = path;
            this.sprites[name] = img;
        }
    }
    
    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawPlayer(player) {
        if (!this.loaded || !this.sprites.player) return;
        
        // Draw player sprite
        this.ctx.drawImage(
            this.sprites.player,
            player.frameX * player.width, 0,
            player.width, player.height,
            player.x, player.y,
            player.width, player.height
        );
    }
    
    drawMushroom(mushroom) {
        if (!this.loaded || !this.sprites.mushrooms) return;
        
        // Draw mushroom sprite based on health
        const frameX = 4 - mushroom.health; // 4 health states (0-3)
        
        this.ctx.drawImage(
            this.sprites.mushrooms,
            frameX * mushroom.width, 0,
            mushroom.width, mushroom.height,
            mushroom.x, mushroom.y,
            mushroom.width, mushroom.height
        );
    }
    
    drawInchwormSegment(segment) {
        if (!this.loaded || !this.sprites.inchworm) return;
        
        // Draw segment based on type (head or body)
        const frameX = segment.isHead ? 0 : 1;
        
        this.ctx.drawImage(
            this.sprites.inchworm,
            frameX * segment.width, 0,
            segment.width, segment.height,
            segment.x, segment.y,
            segment.width, segment.height
        );
    }
    
    drawEnemy(enemy) {
        if (!this.loaded || !this.sprites.enemies) return;
        
        // Draw enemy based on type
        let frameX = 0;
        switch (enemy.type) {
            case 'flea': frameX = 0; break;
            case 'spider': frameX = 1; break;
            case 'scorpion': frameX = 2; break;
        }
        
        this.ctx.drawImage(
            this.sprites.enemies,
            frameX * enemy.width, 0,
            enemy.width, enemy.height,
            enemy.x, enemy.y,
            enemy.width, enemy.height
        );
    }
    
    drawProjectile(projectile) {
        if (!this.loaded || !this.sprites.projectile) return;
        
        this.ctx.drawImage(
            this.sprites.projectile,
            0, 0,
            projectile.width, projectile.height,
            projectile.x, projectile.y,
            projectile.width, projectile.height
        );
    }
    
    drawExplosion(explosion) {
        if (!this.loaded || !this.sprites.explosion) return;
        
        this.ctx.drawImage(
            this.sprites.explosion,
            explosion.frameX * explosion.width, 0,
            explosion.width, explosion.height,
            explosion.x, explosion.y,
            explosion.width, explosion.height
        );
    }
    
    drawGrid(gridSize, color = 'rgba(255, 255, 255, 0.1)') {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    drawText(text, x, y, color = '#0f0', size = '16px', align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size} 'Courier New', monospace`;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }
    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        
        // Reset pixel art rendering
        this.ctx.imageSmoothingEnabled = false;
    }
}
