window.addEventListener('load', () => {
    new DrumPad();
});

class DrumPad {
    constructor() {
        this.drumset = 'lm1';
        this.pads = [...document.querySelectorAll('section.pads .pad')];
        this.initializeSamples();
        this.addPadHooks();
        this.addKeyboardHooks();
    }

    initializeSamples() {
        this.pads.forEach(pad => {
            pad.howl = new Howl({
                src: [`samples/${this.drumset}/${pad.dataset.sound}.wav`]
            });
        })
    }

    addPadHooks() {
        this.pads.forEach(pad => {
            if ('ontouchstart' in document.documentElement) {
                pad.addEventListener('touchstart', this.playSample);
            } else {
                pad.addEventListener('mousedown', this.playSample);
            }
            
        });
    }

    playSample({target: pad}) {
        pad.howl.stop();
        pad.howl.play();
    }

    addKeyboardHooks() {
        const keyToPadMap = {};
        this.pads.forEach(pad => {
            const {dataset: {key}} = pad;
            if (!key) return;
            keyToPadMap[key.toLowerCase()] = pad;
        });

        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            const pad = keyToPadMap[e.key.toLowerCase()];
            if (!pad) return;

            pad.dispatchEvent(new Event('mousedown'));
            pad.classList.add('active')
        });

        window.addEventListener('keyup', e => {
            const pad = keyToPadMap[e.key.toLowerCase()];
            if (!pad) return;

            pad.classList.remove('active')
        });
    }
}



