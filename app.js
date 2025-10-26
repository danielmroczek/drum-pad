// Import external dependencies
import 'https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.core.min.js';
import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js';

// Configuration: Drum pad definitions
const DRUMSET = 'lm1';

const PAD_CONFIG = [
  { sound: 'cy', label: 'Crash', keys: ['1', 'v'], chokeGroup: 2 },
  { sound: 'cb', label: 'Cowbell', keys: ['2', 'f'], chokeGroup: null },
  { sound: 'sp', label: 'Ride', keys: ['3', 'r'], chokeGroup: 2 },
  { sound: 'lt', label: 'Low Tom', keys: ['q'], chokeGroup: null },
  { sound: 'mt', label: 'Mid Tom', keys: ['w'], chokeGroup: null },
  { sound: 'ht', label: 'High Tom', keys: ['e'], chokeGroup: null },
  { sound: 'ch', label: 'CH', keys: ['c'], chokeGroup: 1 },
  { sound: 'oh', label: 'OH', keys: ['d'], chokeGroup: 1 },
  { sound: 'bd', label: 'Kick', keys: ['z'], chokeGroup: null },
  { sound: 'rs', label: 'Rim', keys: ['s'], chokeGroup: null },
  { sound: 'sd', label: 'Snare', keys: ['x'], chokeGroup: null },
  { sound: 'cp', label: 'Clap', keys: ['a'], chokeGroup: null }
];

// Alpine.js drum pad component
Alpine.data('drumPad', () => ({
  drumset: DRUMSET,
  pads: PAD_CONFIG.map(pad => ({ ...pad, velocity: 1 })), // Add velocity to each pad
  sounds: {},
  activePads: new Set(),
  keyToPadMap: {},

  init() {
    this.initializeSamples();
    this.setupKeyboardControls();
  },

  initializeSamples() {
    this.pads.forEach((pad) => {
      this.sounds[pad.sound] = new Howl({
        src: [`samples/${this.drumset}/${pad.sound}.wav`]
      });

      // Build key mapping
      if (pad.keys) {
        pad.keys.forEach(key => {
          this.keyToPadMap[key.toLowerCase()] = pad.sound;
        });
      }
    });
  },

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const padSound = this.keyToPadMap[e.key.toLowerCase()];
      if (!padSound) return;

      this.activePads.add(padSound);
      
      // Find the pad data to get choke group and velocity
      const padInfo = this.pads.find(p => p.sound === padSound);
      this.playSound(padSound, padInfo.velocity, padInfo?.chokeGroup);
    });

    window.addEventListener('keyup', (e) => {
      const padSound = this.keyToPadMap[e.key.toLowerCase()];
      if (!padSound) return;

      this.activePads.delete(padSound);
    });
  },

  handleTouchStart(event, sound) {
    this.activePads.add(sound);
    
    const touch = event.touches[0];
    const rect = event.target.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const velocity = this.calculateVelocity(rect, x, y);
    const padInfo = this.pads.find(p => p.sound === sound);
    
    // Update the pad's velocity
    padInfo.velocity = velocity;
    this.playSound(sound, velocity, padInfo?.chokeGroup);
  },

  handleTouchEnd(event, sound) {
    this.activePads.delete(sound);
  },

  playSample(event, sound) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const velocity = this.calculateVelocity(rect, x, y);
    const padInfo = this.pads.find(p => p.sound === sound);
    
    // Update the pad's velocity
    padInfo.velocity = velocity;
    this.playSound(sound, velocity, padInfo?.chokeGroup);
  },

  calculateVelocity(rect, x, y) {
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
    return 1 - distance / maxDistance;
  },

  playSound(sound, velocity, chokeGroup) {
    // Handle choke groups
    if (chokeGroup) {
      this.pads.forEach(pad => {
        if (pad.sound !== sound && pad.chokeGroup === chokeGroup) {
          this.sounds[pad.sound].stop();
        }
      });
    }

    const howl = this.sounds[sound];
    howl.volume(velocity);
    howl.stop();
    howl.play();
  }
}));

// Start Alpine
Alpine.start();
