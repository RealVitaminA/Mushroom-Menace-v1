/**
 * High score management for Mushroom Menace
 * Handles saving, loading, and displaying high scores
 */
class HighScoreManager {
    constructor() {
        this.scores = [];
        this.maxScores = 10;
        this.localStorageKey = 'mushroomMenaceHighScores';
        this.loadScores();
    }
    
    loadScores() {
        const savedScores = localStorage.getItem(this.localStorageKey);
        if (savedScores) {
            try {
                this.scores = JSON.parse(savedScores);
                console.log('High scores loaded:', this.scores);
            } catch (e) {
                console.error('Error parsing high scores:', e);
                this.scores = [];
            }
        } else {
            // Initialize with some default scores
            this.scores = [
                { name: 'BUG', score: 12000 },
                { name: 'WORM', score: 10000 },
                { name: 'FLEA', score: 8000 },
                { name: 'SPIDER', score: 6000 },
                { name: 'PLAYER', score: 4000 }
            ];
            this.saveScores();
        }
    }
    
    saveScores() {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.scores));
    }
    
    addScore(name, score) {
        // Don't add if score is 0
        if (score <= 0) return false;
        
        // Default name if empty
        if (!name || name.trim() === '') {
            name = 'PLAYER';
        }
        
        // Limit name length
        name = name.toUpperCase().substring(0, 10);
        
        // Add new score
        this.scores.push({ name, score });
        
        // Sort scores (highest first)
        this.scores.sort((a, b) => b.score - a.score);
        
        // Trim to max length
        if (this.scores.length > this.maxScores) {
            this.scores = this.scores.slice(0, this.maxScores);
        }
        
        // Save to localStorage
        this.saveScores();
        
        // Return true if score made it to the list
        return this.isHighScore(score);
    }
    
    isHighScore(score) {
        // Check if score would make it to the high score list
        if (this.scores.length < this.maxScores) {
            return true;
        }
        
        return score > this.scores[this.scores.length - 1].score;
    }
    
    getHighestScore() {
        if (this.scores.length === 0) return 0;
        return this.scores[0].score;
    }
    
    displayScores(container) {
        container.innerHTML = '';
        
        if (this.scores.length === 0) {
            const noScores = document.createElement('div');
            noScores.textContent = 'No high scores yet!';
            container.appendChild(noScores);
            return;
        }
        
        this.scores.forEach((entry, index) => {
            const scoreEntry = document.createElement('div');
            scoreEntry.className = 'score-entry';
            
            const rank = document.createElement('span');
            rank.textContent = `${index + 1}.`;
            
            const name = document.createElement('span');
            name.textContent = entry.name;
            
            const score = document.createElement('span');
            score.textContent = entry.score.toString().padStart(6, '0');
            
            scoreEntry.appendChild(rank);
            scoreEntry.appendChild(name);
            scoreEntry.appendChild(score);
            
            container.appendChild(scoreEntry);
        });
    }
}

// Create global high score manager instance
const highScoreManager = new HighScoreManager();
