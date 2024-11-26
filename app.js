import "https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.core.min.js";

window.addEventListener("DOMContentLoaded", () => {
  new DrumPad();
});

class DrumPad {
  drumset = "lm1";
  pads = [...document.querySelectorAll("section.pads .pad")];

  constructor() {
    this.initializeSamples();
    this.addPadHooks();
    this.addKeyboardHooks();
  }

  initializeSamples() {
    this.pads.forEach((pad) => {
      pad.howl = new Howl({
        src: [`samples/${this.drumset}/${pad.dataset.sound}.wav`],
      });
    });
  }

  addPadHooks = () => {
    this.pads.forEach((pad) => {
      const eventType =
        "ontouchstart" in document.documentElement ? "touchstart" : "mousedown";
      pad.addEventListener(eventType, this.playSample);
    });
  };

  playSample = ({ target: pad }) => {
    pad.howl.stop();
    pad.howl.play();
  };

  addKeyboardHooks() {
    const keyToPadMap = {};
    this.pads.forEach((pad) => {
      const {
        dataset: { key },
      } = pad;
      if (!key) return;
      keyToPadMap[key.toLowerCase()] = pad;
    });

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      const pad = keyToPadMap[e.key.toLowerCase()];
      if (!pad) return;

      pad.dispatchEvent(new Event("mousedown"));
      pad.classList.add("active");
    });

    window.addEventListener("keyup", (e) => {
      const pad = keyToPadMap[e.key.toLowerCase()];
      if (!pad) return;

      pad.classList.remove("active");
    });
  }
}
