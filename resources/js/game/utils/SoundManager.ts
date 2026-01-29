export default class SoundManager {
    private audioContext: AudioContext;
    private masterVolume: number = 0.3;
    private musicVolume: number = 0.2;
    private sfxVolume: number = 0.4;
    private backgroundMusic: OscillatorNode | null = null;
    private musicGain: GainNode | null = null;

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Background Music - Simple underwater ambient theme
    startBackgroundMusic() {
        if (this.backgroundMusic) return; // Already playing

        // Create a simple ambient drone
        this.musicGain = this.audioContext.createGain();
        this.musicGain.gain.value = this.musicVolume * this.masterVolume;
        this.musicGain.connect(this.audioContext.destination);

        // Low frequency drone for underwater feel
        const drone = this.audioContext.createOscillator();
        drone.type = 'sine';
        drone.frequency.value = 110; // Low A note
        
        const droneGain = this.audioContext.createGain();
        droneGain.gain.value = 0.3;
        drone.connect(droneGain);
        droneGain.connect(this.musicGain);
        
        // Add some wobble with LFO
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.5; // Slow wobble
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 10;
        lfo.connect(lfoGain);
        lfoGain.connect(drone.frequency);
        
        drone.start();
        lfo.start();
        
        this.backgroundMusic = drone;
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
        }
        if (this.musicGain) {
            this.musicGain.disconnect();
            this.musicGain = null;
        }
    }

    // Coin collection sound - classic arcade ding
    playCoinSound() {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Bright bell-like sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }

    // Multi-coin sound - richer ding
    playMultiCoinSound() {
        const now = this.audioContext.currentTime;
        
        // Play multiple tones for richer sound
        [800, 1000, 1200].forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, now);
            oscillator.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

            gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.5, now + index * 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2 + index * 0.05);

            oscillator.start(now + index * 0.05);
            oscillator.stop(now + 0.25 + index * 0.05);
        });
    }

    // Damage sound - harsh hit
    playDamageSound() {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Harsh noise-like sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.2);

        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.8, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    // Bubble/Air collection sound
    playBubbleSound() {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Soft pop
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    // Ability activation sound - power-up
    playAbilitySound() {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Rising power-up sound
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.15);

        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    // Swimming sound - subtle whoosh (play periodically)
    playSwimSound() {
        const now = this.audioContext.currentTime;
        
        // Create white noise for water sound
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noise.start(now);
        noise.stop(now + 0.1);
    }

    // Victory sound - uplifting fanfare
    playVictorySound() {
        const now = this.audioContext.currentTime;
        
        // Play a simple ascending arpeggio
        const notes = [523, 659, 784, 1047]; // C, E, G, high C
        
        notes.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'square';
            oscillator.frequency.value = freq;

            const startTime = now + index * 0.15;
            gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.7, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // Death sound - descending tone
    playDeathSound() {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.5);

        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    }

    // Splash sound - water impact
    playSplashSound() {
        const now = this.audioContext.currentTime;
        
        // White noise for splash
        const bufferSize = this.audioContext.sampleRate * 0.2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        noise.start(now);
        noise.stop(now + 0.2);
    }

    // Volume controls
    setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume * this.masterVolume;
        }
    }

    setSfxVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume * this.masterVolume;
        }
    }
}
