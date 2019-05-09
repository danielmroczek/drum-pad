window.addEventListener('load', () => {
    new DrumPad();
});

class DrumPad {
    constructor() {
        this.drumset = 'lm1';
        this.addPadHooks();
    }

    addPadHooks() {
        document.querySelectorAll('section.pads .pad').forEach(padEl => {
            let howl = new Howl({
                src: [`samples/${this.drumset}/${padEl.dataset.sound}.wav`]
            });

            const playSample = e => {
                howl.stop();
                howl.play();
            };

            if ('ontouchstart' in document.documentElement) {
                padEl.addEventListener('touchstart', playSample);
            } else {
                padEl.addEventListener('mousedown', playSample);
            }
            
        });
    }
}



