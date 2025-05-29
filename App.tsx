import { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load game scripts dynamically
    const loadGameScripts = async () => {
      console.log("Starting to load game scripts...");
      
      // Create script elements for all game files in the correct order
      const scripts = [
        'audio.js',
        'highscore.js',
        'collision.js',
        'input.js',
        'renderer.js',
        'entities/mushroom.js',
        'entities/projectile.js',
        'entities/player.js',
        'entities/inchworm.js',
        'entities/flea.js',
        'entities/spider.js',
        'entities/scorpion.js',
        'ui/hud.js',
        'ui/screens.js',
        'game.js'
      ];
      
      // Load each script sequentially
      for (const script of scripts) {
        await new Promise<void>((resolve) => {
          const scriptElement = document.createElement('script');
          scriptElement.src = `/js/${script}`;
          scriptElement.onload = () => {
            console.log(`Loaded script: ${script}`);
            resolve();
          };
          scriptElement.onerror = (e) => {
            console.error(`Error loading script: ${script}`, e);
            resolve(); // Continue despite error
          };
          document.body.appendChild(scriptElement);
        });
      }
      
      console.log("All scripts loaded, initializing game...");
      
      // Initialize game after all scripts are loaded
      setTimeout(() => {
        try {
          console.log("Creating game instance...");
          // Create global game instance using window object to avoid TypeScript errors
          if ((window as any).Game) {
            (window as any).gameInstance = new (window as any).Game();
            console.log("Game instance created successfully");
          } else {
            console.error("Game class not found in window object");
          }
          
          // Add direct initialization to ensure buttons work
          const startButton = document.getElementById('start-button');
          const highScoresButton = document.getElementById('high-scores-button');
          const restartButton = document.getElementById('restart-button');
          const menuButton = document.getElementById('menu-button');
          const backButton = document.getElementById('back-button');
          const startScreen = document.getElementById('start-screen');
          const gameOverScreen = document.getElementById('game-over-screen');
          const highScoresScreen = document.getElementById('high-scores-screen');
          
          if (startButton) {
            console.log("Adding direct click handler to start button");
            startButton.onclick = function() {
              console.log("Start button clicked directly");
              startScreen?.classList.add('hidden');
              // Initialize audio on first interaction
              if ((window as any).audioManager) {
                (window as any).audioManager.init();
                (window as any).audioManager.playSound('menu_select');
              }
              // Trigger game start event
              const event = new CustomEvent('gameStart');
              document.dispatchEvent(event);
              console.log("gameStart event dispatched");
            };
          }
          
          if (highScoresButton) {
            console.log("Adding direct click handler to high scores button");
            highScoresButton.onclick = function() {
              console.log("High scores button clicked directly");
              if ((window as any).audioManager) {
                (window as any).audioManager.playSound('menu_select');
              }
              startScreen?.classList.add('hidden');
              gameOverScreen?.classList.add('hidden');
              highScoresScreen?.classList.remove('hidden');
              
              // Display high scores
              if ((window as any).highScoreManager && document.getElementById('scores-list')) {
                (window as any).highScoreManager.displayScores(document.getElementById('scores-list'));
              }
            };
          }
          
          if (backButton) {
            console.log("Adding direct click handler to back button");
            backButton.onclick = function() {
              console.log("Back button clicked directly");
              if ((window as any).audioManager) {
                (window as any).audioManager.playSound('menu_select');
              }
              highScoresScreen?.classList.add('hidden');
              startScreen?.classList.remove('hidden');
            };
          }
          
          if (restartButton) {
            console.log("Adding direct click handler to restart button");
            restartButton.onclick = function() {
              console.log("Restart button clicked directly");
              gameOverScreen?.classList.add('hidden');
              if ((window as any).audioManager) {
                (window as any).audioManager.playSound('menu_select');
              }
              // Trigger game restart event
              const event = new CustomEvent('gameRestart');
              document.dispatchEvent(event);
              console.log("gameRestart event dispatched");
            };
          }
          
          if (menuButton) {
            console.log("Adding direct click handler to menu button");
            menuButton.onclick = function() {
              console.log("Menu button clicked directly");
              if ((window as any).audioManager) {
                (window as any).audioManager.playSound('menu_select');
              }
              gameOverScreen?.classList.add('hidden');
              startScreen?.classList.remove('hidden');
            };
          }
        } catch (error) {
          console.error("Error initializing game:", error);
        }
      }, 1000); // Give a short delay to ensure DOM is fully ready
    };
    
    loadGameScripts();
    
    // Clean up scripts on unmount
    return () => {
      const scripts = document.querySelectorAll('script[src^="/js/"]');
      scripts.forEach(script => script.remove());
    };
  }, []);
  
  return (
    <div className="game-wrapper">
      <div id="game-container" ref={gameContainerRef}>
        <canvas id="game-canvas" ref={canvasRef}></canvas>
        <div id="game-ui">
          <div id="score-container">
            <div>SCORE: <span id="current-score">0</span></div>
            <div>HIGH: <span id="high-score">0</span></div>
          </div>
          <div id="lives-container">LIVES: <span id="lives">3</span></div>
          <div id="level-container">LEVEL: <span id="level">1</span></div>
        </div>
        <div id="start-screen" className="screen">
          <h1>MUSHROOM MENACE</h1>
          <p>Arrow keys or A/D to move, SPACE to shoot</p>
          <p>Mouse movement and left-click also supported</p>
          <button id="start-button">START GAME</button>
          <button id="high-scores-button">HIGH SCORES</button>
        </div>
        <div id="game-over-screen" className="screen hidden">
          <h2>GAME OVER</h2>
          <p>FINAL SCORE: <span id="final-score">0</span></p>
          <div id="new-high-score" className="hidden">
            <h3>NEW HIGH SCORE!</h3>
            <input type="text" id="player-name" maxLength={10} placeholder="Enter your name" />
            <button id="save-score-button">SAVE</button>
          </div>
          <button id="restart-button">PLAY AGAIN</button>
          <button id="menu-button">MAIN MENU</button>
        </div>
        <div id="high-scores-screen" className="screen hidden">
          <h2>HIGH SCORES</h2>
          <div id="scores-list"></div>
          <button id="back-button">BACK</button>
        </div>
      </div>
    </div>
  );
}

export default App;
