/**
 * Heads-up display for Mushroom Menace
 * Manages score, lives, and level display
 */
class HUD {
    constructor() {
        // Get HUD elements
        this.currentScoreElement = document.getElementById('current-score');
        this.highScoreElement = document.getElementById('high-score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
    }
    
    updateScore(score) {
        this.currentScoreElement.textContent = score;
    }
    
    updateHighScore(highScore) {
        this.highScoreElement.textContent = highScore;
    }
    
    updateLives(lives) {
        this.livesElement.textContent = lives;
    }
    
    updateLevel(level) {
        this.levelElement.textContent = level;
    }
    
    reset(lives, level) {
        this.updateLives(lives);
        this.updateLevel(level);
        this.updateScore(0);
        this.updateHighScore(highScoreManager.getHighestScore());
    }
}
