# Drum-pad Copilot Instructions

## Project Overview
A vanilla web-based drum machine with keyboard and touch controls. Single-page app using Alpine.js for reactivity and Howler.js for audio playback. No build process - runs directly in browser via ES6 modules from CDN.

## Architecture & Tech Stack

**Core Dependencies (CDN-loaded):**
- Alpine.js 3.x (reactive UI state, `x-data`, `x-for` directives)
- Howler.js 2.1.2 (audio playback engine)

**File Structure:**
- `index.html` - Alpine.js template with `x-data="drumPad"` component
- `app.js` - Single Alpine component (`Alpine.data('drumPad')`) with all logic
- `style.css` - CSS Grid layout with responsive portrait/landscape modes
- `samples/lm1/` - WAV drum samples (12 sounds)

## Key Patterns & Conventions

### Pad Configuration (app.js)
All drum pads defined in `PAD_CONFIG` array with this structure:
```javascript
{ sound: 'cy', label: 'Crash', keys: ['1', 'v'], chokeGroup: 2 }
```
- `sound`: filename (no extension) in `samples/{drumset}/`
- `keys`: array of keyboard mappings (lowercase)
- `chokeGroup`: `null` or numeric ID for mutually exclusive sounds (e.g., open/closed hi-hat)

### Audio System
- Howler.js instances created per pad in `initializeSamples()`
- Velocity-sensitive playback: distance from pad center = volume (0-1)
- Choke groups: playing one sound stops others in same group (see `playSound()`)
- Polyphony: `howl.stop()` before `howl.play()` prevents overlapping instances

### Layout Responsiveness
CSS Grid changes orientation based on aspect ratio:
- **Portrait** (3×4): `grid-template-columns: repeat(3, 1fr)`
- **Landscape** (4×3): `grid-template-columns: repeat(4, 1fr)` + `@media (orientation: landscape)`
- Grid areas (`grid-area: cy;`) map pads to specific positions

### State Management
Alpine.js reactive properties in `drumPad` component:
- `activePads`: Set tracking currently pressed pads (visual feedback)
- `sounds`: Object mapping sound names to Howler instances
- `keyToPadMap`: Built from `PAD_CONFIG.keys` for keyboard lookup

## Development Workflow

**Running locally:**
```bash
# No build needed - just serve files
python -m http.server 8000
# or
npx serve
```
Open `http://localhost:8000` in browser.

**Testing changes:**
- Refresh browser (no hot reload)
- Check browser console for errors
- Test both keyboard and touch/mouse inputs
- Verify on mobile devices for touch events

**Adding new sounds:**
1. Add WAV file to `samples/lm1/`
2. Add config to `PAD_CONFIG` with unique `sound`, `label`, `keys`
3. Assign `grid-area` in `style.css` for positioning
4. Update `grid-template-areas` if changing grid size

## Common Gotchas

- **Keys are case-insensitive**: `keyToPadMap` uses `.toLowerCase()` in both setup and event handlers
- **Touch events need `.prevent`**: `@touchstart.prevent` stops scrolling on mobile
- **Grid areas must match**: `data-sound` attribute drives CSS selector `[data-sound="xy"]`
- **No keyboard repeat**: `if (e.repeat) return;` prevents held keys from retriggering
- **Velocity updates pad state**: Each pad stores its own `velocity` property for visual/audio consistency

## Theme Support
Automatic dark/light mode via `@media (prefers-color-scheme: dark)` - no JavaScript toggle needed.

## File Naming
- Sample files: lowercase abbreviations (`bd.wav`, `cy.wav`)
- Config sound IDs must match filenames exactly (without extension)
