/**
 * Input handling for Mushroom Menace
 * Manages keyboard and mouse input
 */
class InputManager {
    constructor() {
        this.keys = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePressed = false;
        this.lastShot = 0;
        this.shotDelay = 250; // ms between shots
        
        // Bind event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    
    handleKeyDown(event) {
        this.keys[event.key] = true;
        
        // Prevent default for game control keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'A', 'D', ' '].includes(event.key)) {
            event.preventDefault();
        }
    }
    
    handleKeyUp(event) {
        this.keys[event.key] = false;
    }
    
    handleMouseMove(event) {
        const canvas = document.getElementById('game-canvas');
        const rect = canvas.getBoundingClientRect();
        
        // Calculate mouse position relative to canvas
        this.mouseX = event.clientX - rect.left;
        this.mouseY = event.clientY - rect.top;
    }
    
    handleMouseDown(event) {
        if (event.button === 0) { // Left click
            this.mousePressed = true;
        }
    }
    
    handleMouseUp(event) {
        if (event.button === 0) { // Left click
            this.mousePressed = false;
        }
    }
    
    isKeyDown(key) {
        return this.keys[key] === true;
    }
    
    isMovingLeft() {
        return this.isKeyDown('ArrowLeft') || this.isKeyDown('a') || this.isKeyDown('A');
    }
    
    isMovingRight() {
        return this.isKeyDown('ArrowRight') || this.isKeyDown('d') || this.isKeyDown('D');
    }
    
    isShooting() {
        const now = Date.now();
        
        // Check keyboard space
        if (this.isKeyDown(' ') && now - this.lastShot > this.shotDelay) {
            this.lastShot = now;
            return true;
        }
        
        // Check mouse click
        if (this.mousePressed && now - this.lastShot > this.shotDelay) {
            this.lastShot = now;
            return true;
        }
        
        return false;
    }
    
    getMousePosition() {
        return { x: this.mouseX, y: this.mouseY };
    }
    
    reset() {
        this.keys = {};
        this.mousePressed = false;
        this.lastShot = 0;
    }
}

// Create global input manager instance
const inputManager = new InputManager();
