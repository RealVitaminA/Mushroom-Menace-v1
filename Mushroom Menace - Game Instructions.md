# Mushroom Menace - Game Instructions

## Overview
Mushroom Menace is a retro-style arcade shooter inspired by classic games like Centipede. Control the Bug Blaster to clear segmented Inchworms and other critters from a field of mushroom caps while chasing high scores.

## How to Play

### Controls
- **Keyboard**: Use Arrow keys or A/D to move horizontally. Press Spacebar to fire.
- **Mouse**: Move cursor within the lower play area; left-click to shoot.

### Gameplay
1. **Objective**: Destroy enemies and survive as long as possible while earning points.
2. **Inchworms**: The main segmented enemies that split into two when a middle segment is hit.
3. **Special Enemies**:
   - **Fleas**: Drop straight down and spawn new mushroom caps. Require two hits to destroy.
   - **Spiders**: Zig-zag across the lower area, eating mushroom caps. Points scale with shot distance.
   - **Scorpions**: Move horizontally, poisoning mushroom caps they touch.
4. **Mushroom Caps**: Obstacles that require four hits to destroy. They guide Inchworm movement.
5. **Lives**: Start with three lives. Lose a life on any enemy collision.
6. **Scoring**:
   - Head kills: 100 points
   - Body segments: 10 points
   - Fleas: 200 points
   - Spiders: 300/600/900 points based on shooting distance
   - Scorpions: 1,000 points
   - Mushroom destruction: 1 point each
   - Regenerated caps on life loss: 5 points each
7. **Bonuses**: Earn an extra life at every 12,000 points.

## Running the Game
1. Extract all files, maintaining the folder structure.
2. Open the `index.html` file in a modern web browser.
3. Click "START GAME" to begin playing.
4. Use the high score system to track your best performances.

## Technical Information
- The game is built using HTML5 Canvas and JavaScript.
- All game assets are included in the package.
- The game is designed for desktop browsers and requires keyboard/mouse input.
- Local storage is used to save high scores between sessions.

Enjoy playing Mushroom Menace!
