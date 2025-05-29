/**
 * Audio management for Mushroom Menace
 * Handles sound effects and background music
 */
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.currentMusic = null;
        this.isMuted = false;
        this.soundVolume = 0.7;
        this.musicVolume = 0.4;
        
        // Initialize audio context when user interacts
        this.initialized = false;
        this.context = null;
    }
    
    init() {
        if (this.initialized) return;
        
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.initialized = true;
            console.log('Audio context initialized');
            
            // Load all game audio
            this.loadSounds();
            this.loadMusic();
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }
    
    loadSounds() {
        // Define sound effects to load
        const soundFiles = {
            'shoot': 'assets/sounds/shoot.mp3',
            'explosion': 'assets/sounds/explosion.mp3',
            'hit': 'assets/sounds/hit.mp3',
            'mushroom_hit': 'assets/sounds/mushroom_hit.mp3',
            'mushroom_destroy': 'assets/sounds/mushroom_destroy.mp3',
            'level_up': 'assets/sounds/level_up.mp3',
            'extra_life': 'assets/sounds/extra_life.mp3',
            'game_over': 'assets/sounds/game_over.mp3',
            'menu_select': 'assets/sounds/menu_select.mp3',
            'flea': 'assets/sounds/flea.mp3',
            'spider': 'assets/sounds/spider.mp3',
            'scorpion': 'assets/sounds/scorpion.mp3'
        };
        
        // Load each sound
        for (const [name, path] of Object.entries(soundFiles)) {
            this.loadSound(name, path);
        }
    }
    
    loadMusic() {
        // Define music tracks to load
        const musicFiles = {
            'title': 'assets/music/title.mp3',
            'gameplay': 'assets/music/gameplay.mp3'
        };
        
        // Load each music track
        for (const [name, path] of Object.entries(musicFiles)) {
            this.loadMusic(name, path);
        }
    }
    
    loadSound(name, path) {
        fetch(path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.sounds[name] = audioBuffer;
                console.log(`Sound loaded: ${name}`);
            })
            .catch(error => console.error(`Error loading sound ${name}:`, error));
    }
    
    loadMusic(name, path) {
        fetch(path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.music[name] = audioBuffer;
                console.log(`Music loaded: ${name}`);
            })
            .catch(error => console.error(`Error loading music ${name}:`, error));
    }
    
    playSound(name) {
        if (!this.initialized || this.isMuted || !this.sounds[name]) return;
        
        const source = this.context.createBufferSource();
        source.buffer = this.sounds[name];
        
        const gainNode = this.context.createGain();
        gainNode.gain.value = this.soundVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
    }
    
    playMusic(name, loop = true) {
        if (!this.initialized || this.isMuted || !this.music[name]) return;
        
        // Stop current music if playing
        this.stopMusic();
        
        const source = this.context.createBufferSource();
        source.buffer = this.music[name];
        source.loop = loop;
        
        const gainNode = this.context.createGain();
        gainNode.gain.value = this.musicVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        source.start(0);
        
        this.currentMusic = {
            source: source,
            gainNode: gainNode,
            name: name
        };
    }
    
    stopMusic() {
        if (this.currentMusic && this.currentMusic.source) {
            try {
                this.currentMusic.source.stop();
            } catch (e) {
                console.log('Music already stopped');
            }
            this.currentMusic = null;
        }
    }
    
    mute() {
        this.isMuted = true;
        if (this.currentMusic && this.currentMusic.gainNode) {
            this.currentMusic.gainNode.gain.value = 0;
        }
    }
    
    unmute() {
        this.isMuted = false;
        if (this.currentMusic && this.currentMusic.gainNode) {
            this.currentMusic.gainNode.gain.value = this.musicVolume;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic && this.currentMusic.gainNode && !this.isMuted) {
            this.currentMusic.gainNode.gain.value = this.musicVolume;
        }
    }
    
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();
