/**
 * Main game logic for Mushroom Menace
 * Handles game initialization, loop, and state management
 */
class Game {
    constructor() {
        // Get canvas and set dimensions
        this.canvas = document.getElementById('game-canvas');
        this.resizeCanvas();
        
        // Initialize game components
        this.renderer = new Renderer(this.canvas);
        this.collisionSystem = new CollisionSystem(16); // 16px grid size
        this.hud = new HUD();
        this.screenManager = new ScreenManager();
        
        // Game state
        this.gameState = 'title'; // title, playing, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.extraLifeThreshold = 12000;
        this.nextExtraLife = this.extraLifeThreshold;
        
        // Game entities
        this.player = null;
        this.projectiles = [];
        this.mushrooms = [];
        this.inchworms = [];
        this.fleas = [];
        this.spiders = [];
        this.scorpions = [];
        this.explosions = [];
        
        // Game settings
        this.gridSize = 16;
        this.mushroomDensity = 0.5; // Initial density (0-1)
        this.enemySpawnRate = 0.005; // Chance per frame
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Bind event listeners
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        document.addEventListener('gameStart', this.startGame.bind(this));
        document.addEventListener('gameRestart', this.restartGame.bind(this));
        
        // Start game loop
        this.lastFrameTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
        
        // Show title screen
        this.screenManager.showStartScreen();
    }
    
    resizeCanvas() {
        // Set canvas size based on window dimensions
        // Maintain aspect ratio while fitting in window
        const aspectRatio = 4/3; // Classic arcade aspect ratio
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.8;
        
        let width = maxWidth;
        let height = width / aspectRatio;
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        // Ensure dimensions are multiples of grid size for clean rendering
        width = Math.floor(width / this.gridSize) * this.gridSize;
        height = Math.floor(height / this.gridSize) * this.gridSize;
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Update renderer dimensions
        if (this.renderer) {
            this.renderer.resize(width, height);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.nextExtraLife = this.extraLifeThreshold;
        
        // Initialize game entities
        this.initializeEntities();
        
        // Update HUD
        this.hud.reset(this.lives, this.level);
        
        // Start gameplay music
        audioManager.playMusic('gameplay', true);
    }
    
    restartGame() {
        // Same as startGame but keeps high scores
        this.startGame();
    }
    
    initializeEntities() {
        // Clear all entities
        this.projectiles = [];
        this.mushrooms = [];
        this.inchworms = [];
        this.fleas = [];
        this.spiders = [];
        this.scorpions = [];
        this.explosions = [];
        
        // Create player
        const playerWidth = this.gridSize * 1.5;
        const playerHeight = this.gridSize * 1.5;
        const playerX = (this.canvas.width - playerWidth) / 2;
        const playerY = this.canvas.height - playerHeight - this.gridSize;
        this.player = new Player(playerX, playerY, playerWidth, playerHeight, this.canvas.width);
        
        // Create initial mushroom field
        this.createMushroomField();
        
        // Create initial inchworm
        this.createInchworm();
    }
    
    createMushroomField() {
        const gridWidth = Math.floor(this.canvas.width / this.gridSize);
        const gridHeight = Math.floor(this.canvas.height / this.gridSize);
        
        // Create mushrooms with random distribution
        for (let gridY = 2; gridY < gridHeight - 4; gridY++) {
            for (let gridX = 0; gridX < gridWidth; gridX++) {
                // Skip if already a mushroom at this position
                if (this.collisionSystem.objectAtGridPosition(gridX, gridY, this.mushrooms)) {
                    continue;
                }
                
                // Random chance based on density
                if (Math.random() < this.mushroomDensity) {
                    const x = gridX * this.gridSize;
                    const y = gridY * this.gridSize;
                    const mushroom = new Mushroom(x, y, this.gridSize, this.gridSize, gridX, gridY);
                    this.mushrooms.push(mushroom);
                }
            }
        }
    }
    
    createInchworm() {
        const segmentWidth = this.gridSize;
        const segmentHeight = this.gridSize;
        const segmentCount = 12; // Initial length
        const startX = 0;
        const startY = this.gridSize * 2;
        
        const inchworm = new Inchworm(startX, startY, segmentWidth, segmentHeight, segmentCount, this.gridSize);
        this.inchworms.push(inchworm);
    }
    
    spawnEnemies() {
        // Increase spawn rate with level
        const adjustedSpawnRate = this.enemySpawnRate * (1 + (this.level - 1) * 0.2);
        
        // Random chance to spawn enemies
        if (Math.random() < adjustedSpawnRate) {
            // Choose which enemy to spawn
            const enemyType = Math.random();
            
            if (enemyType < 0.6) { // 60% chance for flea
                this.spawnFlea();
            } else if (enemyType < 0.9) { // 30% chance for spider
                this.spawnSpider();
            } else { // 10% chance for scorpion
                this.spawnScorpion();
            }
        }
    }
    
    spawnFlea() {
        const width = this.gridSize;
        const height = this.gridSize;
        const x = Math.floor(Math.random() * (this.canvas.width - width));
        const y = 0;
        
        const flea = new Flea(x, y, width, height, this.gridSize);
        this.fleas.push(flea);
        
        audioManager.playSound('flea');
    }
    
    spawnSpider() {
        const width = this.gridSize * 1.5;
        const height = this.gridSize;
        const side = Math.random() < 0.5 ? 0 : this.canvas.width - width;
        const y = this.canvas.height - this.gridSize * 4;
        
        const spider = new Spider(side, y, width, height, this.canvas.width, this.player.y);
        this.spiders.push(spider);
        
        audioManager.playSound('spider');
    }
    
    spawnScorpion() {
        const width = this.gridSize * 2;
        const height = this.gridSize;
        const side = Math.random() < 0.5 ? -width : this.canvas.width;
        const y = this.gridSize * (2 + Math.floor(Math.random() * 5));
        
        const scorpion = new Scorpion(side, y, width, height, this.canvas.width);
        this.scorpions.push(scorpion);
        
        audioManager.playSound('scorpion');
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Clear canvas
        this.renderer.clear();
        
        // Update and render based on game state
        if (this.gameState === 'playing') {
            this.update(deltaTime);
            this.render();
        }
        
        // Continue game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    update(deltaTime) {
        this.frameCount++;
        
        // Update player
        this.player.update(inputManager);
        
        // Handle shooting
        if (inputManager.isShooting()) {
            this.shoot();
        }
        
        // Update projectiles
        this.updateProjectiles();
        
        // Update mushrooms
        this.updateMushrooms();
        
        // Update inchworms
        this.updateInchworms();
        
        // Update special enemies
        this.updateFleas();
        this.updateSpiders();
        this.updateScorpions();
        
        // Update explosions
        this.updateExplosions();
        
        // Spawn enemies
        this.spawnEnemies();
        
        // Check for level completion
        this.checkLevelCompletion();
        
        // Check for extra life
        this.checkExtraLife();
    }
    
    shoot() {
        const projectileWidth = 4;
        const projectileHeight = 8;
        const projectileX = this.player.x + (this.player.width / 2) - (projectileWidth / 2);
        const projectileY = this.player.y - projectileHeight;
        
        const projectile = new Projectile(projectileX, projectileY, projectileWidth, projectileHeight);
        this.projectiles.push(projectile);
        
        audioManager.playSound('shoot');
    }
    
    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update();
            
            // Check for collisions
            this.checkProjectileCollisions(projectile, i);
            
            // Remove inactive projectiles
            if (!projectile.active) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    checkProjectileCollisions(projectile, projectileIndex) {
        // Check collision with mushrooms
        for (let i = 0; i < this.mushrooms.length; i++) {
            const mushroom = this.mushrooms[i];
            
            if (!mushroom.isDestroyed() && this.collisionSystem.checkCollision(projectile, mushroom)) {
                // Hit mushroom
                const destroyed = mushroom.hit();
                projectile.active = false;
                
                // Play sound
                audioManager.playSound(destroyed ? 'mushroom_destroy' : 'mushroom_hit');
                
                // Add score
                this.score += 1;
                this.hud.updateScore(this.score);
                
                return; // Projectile can only hit one thing
            }
        }
        
        // Check collision with inchworm segments
        for (let i = 0; i < this.inchworms.length; i++) {
            const inchworm = this.inchworms[i];
            
            for (let j = 0; j < inchworm.segments.length; j++) {
                const segment = inchworm.segments[j];
                
                if (segment.active && this.collisionSystem.checkCollision(projectile, segment)) {
                    // Hit inchworm segment
                    const hit = inchworm.hitSegment(j);
                    
                    if (hit) {
                        projectile.active = false;
                        
                        // Add score based on segment type
                        if (segment.isHead) {
                            this.score += 100; // Head is worth more
                        } else {
                            this.score += 10; // Body segment
                        }
                        
                        this.hud.updateScore(this.score);
                        
                        // Create explosion
                        this.createExplosion(segment.x, segment.y);
                        
                        // Play sound
                        audioManager.playSound('explosion');
                        
                        return; // Projectile can only hit one thing
                    }
                }
            }
        }
        
        // Check collision with fleas
        for (let i = this.fleas.length - 1; i >= 0; i--) {
            const flea = this.fleas[i];
            
            if (flea.active && this.collisionSystem.checkCollision(projectile, flea)) {
                // Hit flea
                const destroyed = flea.hit();
                projectile.active = false;
                
                if (destroyed) {
                    // Add score
                    this.score += 200;
                    this.hud.updateScore(this.score);
                    
                    // Create explosion
                    this.createExplosion(flea.x, flea.y);
                    
                    // Remove flea
                    this.fleas.splice(i, 1);
                    
                    // Play sound
                    audioManager.playSound('explosion');
                } else {
                    // Play hit sound
                    audioManager.playSound('hit');
                }
                
                return; // Projectile can only hit one thing
            }
        }
        
        // Check collision with spiders
        for (let i = this.spiders.length - 1; i >= 0; i--) {
            const spider = this.spiders[i];
            
            if (spider.active && this.collisionSystem.checkCollision(projectile, spider)) {
                // Hit spider
                projectile.active = false;
                
                // Add score based on distance
                const points = spider.getPointValue(this.player.y);
                this.score += points;
                this.hud.updateScore(this.score);
                
                // Create explosion
                this.createExplosion(spider.x, spider.y);
                
                // Remove spider
                this.spiders.splice(i, 1);
                
                // Play sound
                audioManager.playSound('explosion');
                
                return; // Projectile can only hit one thing
            }
        }
        
        // Check collision with scorpions
        for (let i = this.scorpions.length - 1; i >= 0; i--) {
            const scorpion = this.scorpions[i];
            
            if (scorpion.active && this.collisionSystem.checkCollision(projectile, scorpion)) {
                // Hit scorpion
                projectile.active = false;
                
                // Add score
                this.score += 1000;
                this.hud.updateScore(this.score);
                
                // Create explosion
                this.createExplosion(scorpion.x, scorpion.y);
                
                // Remove scorpion
                this.scorpions.splice(i, 1);
                
                // Play sound
                audioManager.playSound('explosion');
                
                return; // Projectile can only hit one thing
            }
        }
    }
    
    updateMushrooms() {
        // Nothing to update for mushrooms, they're static
        // But we could add animations or effects here
    }
    
    updateInchworms() {
        for (let i = this.inchworms.length - 1; i >= 0; i--) {
            const inchworm = this.inchworms[i];
            
            inchworm.update(this.mushrooms, this.canvas.width, this.canvas.height);
            
            // Check if inchworm reached player area
            for (const segment of inchworm.segments) {
                if (segment.active && segment.y >= this.player.y - this.gridSize) {
                    // Player loses a life if inchworm reaches bottom
                    this.loseLife();
                    break;
                }
            }
            
            // Check collision with player
            for (const segment of inchworm.segments) {
                if (segment.active && this.collisionSystem.checkCollision(segment, this.player)) {
                    // Player loses a life on collision
                    this.loseLife();
                    break;
                }
            }
            
            // Remove inactive inchworms
            if (!inchworm.isActive()) {
                this.inchworms.splice(i, 1);
                
                // Create new inchworm if all are gone
                if (this.inchworms.length === 0) {
                    this.createInchworm();
                }
            }
        }
    }
    
    updateFleas() {
        for (let i = this.fleas.length - 1; i >= 0; i--) {
            const flea = this.fleas[i];
            
            flea.update(this.canvas.height);
            
            // Check if flea should spawn a mushroom
            if (flea.active && Math.random() < 0.02) {
                const gridPos = flea.getGridPosition();
                
                // Only spawn if no mushroom exists at this position
                if (!this.collisionSystem.objectAtGridPosition(gridPos.gridX, gridPos.gridY, this.mushrooms)) {
                    const x = gridPos.gridX * this.gridSize;
                    const y = gridPos.gridY * this.gridSize;
                    const mushroom = new Mushroom(x, y, this.gridSize, this.gridSize, gridPos.gridX, gridPos.gridY);
                    this.mushrooms.push(mushroom);
                }
            }
            
            // Check collision with player
            if (flea.active && this.collisionSystem.checkCollision(flea, this.player)) {
                // Player loses a life on collision
                this.loseLife();
                
                // Remove flea
                this.fleas.splice(i, 1);
                continue;
            }
            
            // Remove inactive fleas
            if (!flea.active) {
                this.fleas.splice(i, 1);
            }
        }
    }
    
    updateSpiders() {
        for (let i = this.spiders.length - 1; i >= 0; i--) {
            const spider = this.spiders[i];
            
            spider.update();
            
            // Check if spider should eat a mushroom
            if (spider.active && Math.random() < 0.05) {
                for (let j = 0; j < this.mushrooms.length; j++) {
                    const mushroom = this.mushrooms[j];
                    
                    if (!mushroom.isDestroyed() && this.collisionSystem.checkCollision(spider, mushroom)) {
                        // Spider eats mushroom
                        mushroom.health = 0; // Destroy mushroom
                        break;
                    }
                }
            }
            
            // Check collision with player
            if (spider.active && this.collisionSystem.checkCollision(spider, this.player)) {
                // Player loses a life on collision
                this.loseLife();
                
                // Remove spider
                this.spiders.splice(i, 1);
                continue;
            }
            
            // Remove spiders that have been active too long
            if (Math.random() < 0.002) { // Small chance to despawn
                this.spiders.splice(i, 1);
            }
        }
    }
    
    updateScorpions() {
        for (let i = this.scorpions.length - 1; i >= 0; i--) {
            const scorpion = this.scorpions[i];
            
            scorpion.update();
            
            // Check if scorpion should poison a mushroom
            for (let j = 0; j < this.mushrooms.length; j++) {
                const mushroom = this.mushrooms[j];
                
                if (!mushroom.isDestroyed() && !mushroom.poisoned && 
                    scorpion.checkMushroomCollision(mushroom)) {
                    // Scorpion poisons mushroom
                    mushroom.poison();
                }
            }
            
            // Check collision with player
            if (scorpion.active && this.collisionSystem.checkCollision(scorpion, this.player)) {
                // Player loses a life on collision
                this.loseLife();
                
                // Remove scorpion
                this.scorpions.splice(i, 1);
                continue;
            }
            
            // Remove inactive scorpions
            if (!scorpion.active) {
                this.scorpions.splice(i, 1);
            }
        }
    }
    
    updateExplosions() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            
            explosion.frameTimer++;
            if (explosion.frameTimer >= explosion.frameInterval) {
                explosion.frameTimer = 0;
                explosion.frameX++;
                
                // Remove explosion when animation is complete
                if (explosion.frameX >= explosion.frameCount) {
                    this.explosions.splice(i, 1);
                }
            }
        }
    }
    
    createExplosion(x, y) {
        const explosion = {
            x: x,
            y: y,
            width: this.gridSize,
            height: this.gridSize,
            frameX: 0,
            frameCount: 5, // Number of animation frames
            frameTimer: 0,
            frameInterval: 3 // Update animation every 3 game ticks
        };
        
        this.explosions.push(explosion);
    }
    
    checkLevelCompletion() {
        // Level is complete when all inchworms are destroyed
        if (this.inchworms.length === 0) {
            this.level++;
            this.hud.updateLevel(this.level);
            
            // Increase difficulty
            this.mushroomDensity = Math.min(0.8, this.mushroomDensity + 0.05);
            
            // Create new inchworm with increased speed
            this.createInchworm();
            for (const inchworm of this.inchworms) {
                inchworm.increaseSpeed(2);
            }
            
            // Play level up sound
            audioManager.playSound('level_up');
        }
    }
    
    checkExtraLife() {
        if (this.score >= this.nextExtraLife) {
            this.lives++;
            this.hud.updateLives(this.lives);
            this.nextExtraLife += this.extraLifeThreshold;
            
            // Play extra life sound
            audioManager.playSound('extra_life');
        }
    }
    
    loseLife() {
        this.lives--;
        this.hud.updateLives(this.lives);
        
        // Check for game over
        if (this.lives <= 0) {
            this.gameOver();
            return;
        }
        
        // Reset player position
        const playerX = (this.canvas.width - this.player.width) / 2;
        const playerY = this.canvas.height - this.player.height - this.gridSize;
        this.player.reset(playerX, playerY);
        
        // Clear projectiles
        this.projectiles = [];
        
        // Clear enemies
        this.fleas = [];
        this.spiders = [];
        this.scorpions = [];
        
        // Partially reset mushroom field
        this.resetMushroomField();
    }
    
    resetMushroomField() {
        // Regenerate some mushrooms
        const gridWidth = Math.floor(this.canvas.width / this.gridSize);
        const gridHeight = Math.floor(this.canvas.height / this.gridSize);
        
        // Regenerate about 50% of destroyed mushrooms
        for (let i = 0; i < this.mushrooms.length; i++) {
            const mushroom = this.mushrooms[i];
            
            if (mushroom.isDestroyed() && Math.random() < 0.5) {
                mushroom.reset();
                
                // Add points for regenerated mushrooms
                this.score += 5;
            }
        }
        
        this.hud.updateScore(this.score);
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Show game over screen
        this.screenManager.showGameOverScreen(this.score);
        
        // Play game over sound
        audioManager.playSound('game_over');
        audioManager.stopMusic();
    }
    
    render() {
        // Draw mushrooms
        for (const mushroom of this.mushrooms) {
            if (!mushroom.isDestroyed()) {
                this.renderer.drawMushroom(mushroom);
            }
        }
        
        // Draw inchworm segments
        for (const inchworm of this.inchworms) {
            for (const segment of inchworm.segments) {
                if (segment.active) {
                    this.renderer.drawInchwormSegment(segment);
                }
            }
        }
        
        // Draw fleas
        for (const flea of this.fleas) {
            this.renderer.drawEnemy(flea);
        }
        
        // Draw spiders
        for (const spider of this.spiders) {
            this.renderer.drawEnemy(spider);
        }
        
        // Draw scorpions
        for (const scorpion of this.scorpions) {
            this.renderer.drawEnemy(scorpion);
        }
        
        // Draw projectiles
        for (const projectile of this.projectiles) {
            this.renderer.drawProjectile(projectile);
        }
        
        // Draw player
        this.renderer.drawPlayer(this.player);
        
        // Draw explosions
        for (const explosion of this.explosions) {
            this.renderer.drawExplosion(explosion);
        }
        
        // Draw debug grid (uncomment for debugging)
        // this.renderer.drawGrid(this.gridSize);
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
