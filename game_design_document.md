# Mushroom Menace: Technical Design Document

## 1. Game Overview

**Title:** Mushroom Menace
**Platform:** Web browsers (desktop PCs) via HTML5/JavaScript
**Genre:** Fixed-screen arcade shooter
**Art Style:** Retro pixel art

## 2. Technical Architecture

### Core Components
- **Game Engine:** Custom HTML5 Canvas-based engine
- **Rendering:** 2D Canvas API with sprite-based rendering
- **Input:** Keyboard (arrow keys/A/D + spacebar) and mouse controls
- **Audio:** Web Audio API for sound effects and background music
- **Storage:** LocalStorage for high scores persistence

### File Structure
```
mushroom_menace/
├── index.html           # Main HTML file
├── css/
│   └── style.css        # Game styling
├── js/
│   ├── game.js          # Main game loop and initialization
│   ├── input.js         # Input handling
│   ├── renderer.js      # Canvas rendering
│   ├── audio.js         # Sound and music management
│   ├── collision.js     # Collision detection system
│   ├── highscore.js     # High score tracking
│   ├── entities/
│   │   ├── player.js    # Bug Blaster player
│   │   ├── projectile.js # Player darts
│   │   ├── mushroom.js  # Mushroom caps
│   │   ├── inchworm.js  # Segmented inchworm enemy
│   │   ├── flea.js      # Flea enemy
│   │   ├── spider.js    # Spider enemy
│   │   └── scorpion.js  # Scorpion enemy
│   └── ui/
│       ├── hud.js       # Heads-up display (score, lives)
│       ├── menu.js      # Game menus
│       └── screens.js   # Title, game over screens
└── assets/
    ├── images/          # Sprite sheets and images
    ├── sounds/          # Sound effects
    └── music/           # Background music
```

## 3. Game Mechanics Implementation

### Game Loop
- Fixed time step of 60 FPS using `requestAnimationFrame`
- Separate update and render phases
- State management for different game screens (title, gameplay, game over)

### Grid System
- Game field divided into a grid for efficient collision detection
- Grid-based placement of mushroom caps
- Grid-aligned movement for inchworms

### Player (Bug Blaster)
- Constrained to bottom third of the screen
- Horizontal movement only
- Projectile firing with rate limiting
- Collision detection with enemies

### Mushroom Caps
- Four-hit destruction (visual states for each hit)
- Grid-aligned placement
- Collision interaction with inchworms (path alteration)
- Regeneration on player death

### Inchworm Mechanics
- Multi-segment chain with head and body segments
- Path following with direction changes at edges and mushrooms
- Segment splitting when middle segments are hit
- New head generation for detached segments
- Increasing speed with level progression

### Special Enemies
- **Fleas:** Vertical dropping with mushroom spawning
- **Spiders:** Zig-zag movement pattern with mushroom destruction
- **Scorpions:** Horizontal movement with mushroom poisoning

### Scoring System
- Point values as specified in the design document
- Score display in HUD
- High score tracking and persistence

### Lives and Progression
- Three starting lives
- Extra life at 12,000 points
- Level progression with increasing difficulty
- Partial mushroom field reset on death

## 4. Asset Requirements

### Sprites
- Player (Bug Blaster) with animation frames
- Projectile (dart)
- Mushroom caps (4 damage states)
- Inchworm segments (head and body)
- Flea enemy
- Spider enemy
- Scorpion enemy
- Explosion/death animations
- UI elements (lives indicator, etc.)

### Audio
- Player shooting sound
- Enemy movement sounds
- Enemy death sounds
- Mushroom hit/destruction sounds
- Level up sound
- Extra life earned sound
- Game over sound
- Background music (title screen and gameplay)

## 5. User Interface

### HUD Elements
- Current score display
- High score display
- Lives remaining indicator
- Current level indicator

### Screens
- Title screen with game logo and start prompt
- Game over screen with final score and restart option
- High score table display

## 6. Implementation Approach

### Phase 1: Core Engine
- Set up HTML5 Canvas and basic rendering
- Implement game loop and timing
- Create input handling system
- Develop basic collision detection

### Phase 2: Basic Gameplay
- Implement player movement and shooting
- Add mushroom caps with hit detection
- Create basic inchworm movement
- Implement scoring system

### Phase 3: Advanced Mechanics
- Add inchworm segment splitting behavior
- Implement special enemies (fleas, spiders, scorpions)
- Add level progression and difficulty scaling
- Implement lives system

### Phase 4: Polish and Extras
- Create and integrate all sprite assets
- Add sound effects and background music
- Implement high score system
- Add UI elements and game screens
- Final testing and balancing

## 7. Performance Considerations
- Object pooling for projectiles and particles
- Sprite batching for efficient rendering
- Grid-based collision detection for performance
- Asset preloading to prevent in-game delays

## 8. Browser Compatibility
- Target modern browsers with HTML5 Canvas support
- Focus on desktop experience as specified
- Responsive canvas scaling while maintaining aspect ratio
