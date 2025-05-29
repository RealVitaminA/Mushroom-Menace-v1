/**
 * UI screens management for Mushroom Menace
 * Handles game screens (start, game over, high scores)
 */
class ScreenManager {
    constructor() {
        // Get screen elements
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.highScoresScreen = document.getElementById('high-scores-screen');
        
        // Get buttons
        this.startButton = document.getElementById('start-button');
        this.highScoresButton = document.getElementById('high-scores-button');
        this.restartButton = document.getElementById('restart-button');
        this.menuButton = document.getElementById('menu-button');
        this.backButton = document.getElementById('back-button');
        this.saveScoreButton = document.getElementById('save-score-button');
        
        // Get other elements
        this.finalScoreElement = document.getElementById('final-score');
        this.newHighScoreElement = document.getElementById('new-high-score');
        this.playerNameInput = document.getElementById('player-name');
        this.scoresListElement = document.getElementById('scores-list');
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Start button
        this.startButton.addEventListener('click', () => {
            this.hideAllScreens();
            // Initialize audio on first interaction
            audioManager.init();
            audioManager.playSound('menu_select');
            // Trigger game start event
            const event = new CustomEvent('gameStart');
            document.dispatchEvent(event);
        });
        
        // High scores button
        this.highScoresButton.addEventListener('click', () => {
            audioManager.playSound('menu_select');
            this.showHighScores();
        });
        
        // Restart button
        this.restartButton.addEventListener('click', () => {
            this.hideAllScreens();
            audioManager.playSound('menu_select');
            // Trigger game restart event
            const event = new CustomEvent('gameRestart');
            document.dispatchEvent(event);
        });
        
        // Menu button
        this.menuButton.addEventListener('click', () => {
            audioManager.playSound('menu_select');
            this.showStartScreen();
        });
        
        // Back button
        this.backButton.addEventListener('click', () => {
            audioManager.playSound('menu_select');
            this.showStartScreen();
        });
        
        // Save score button
        this.saveScoreButton.addEventListener('click', () => {
            audioManager.playSound('menu_select');
            const playerName = this.playerNameInput.value.trim() || 'PLAYER';
            const finalScore = parseInt(this.finalScoreElement.textContent);
            
            highScoreManager.addScore(playerName, finalScore);
            this.newHighScoreElement.classList.add('hidden');
            this.showHighScores();
        });
    }
    
    showStartScreen() {
        this.hideAllScreens();
        this.startScreen.classList.remove('hidden');
        audioManager.playMusic('title', true);
    }
    
    showGameOverScreen(score) {
        this.hideAllScreens();
        this.gameOverScreen.classList.remove('hidden');
        this.finalScoreElement.textContent = score;
        
        // Check if it's a high score
        if (highScoreManager.isHighScore(score)) {
            this.newHighScoreElement.classList.remove('hidden');
            this.playerNameInput.value = '';
            this.playerNameInput.focus();
        } else {
            this.newHighScoreElement.classList.add('hidden');
        }
    }
    
    showHighScores() {
        this.hideAllScreens();
        this.highScoresScreen.classList.remove('hidden');
        highScoreManager.displayScores(this.scoresListElement);
    }
    
    hideAllScreens() {
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.highScoresScreen.classList.add('hidden');
    }
}
