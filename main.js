const abletonlink = require('abletonlink');
const chroma = require("chroma-js");
const iro = require('@jaames/iro');
const updateEvent = "link-bpm";
const Phea = require('phea');

let intensity = 25;
let brightness = 25;
let color = chroma("#4b0082");
let colorBase = color;

let phrase = 0;
let prevBeat = 0;
let prevPhraseBeat = 0;
const callback = (beatF, phaseF, bpmF) => {
    const beat = parseInt(beatF, 10);
    let newBeat = false;
    if (beat > prevBeat) {
        prevBeat = beat;
        newBeat = true;
        console.log("new beat");
    }
    let newPhase = false;
    if (prevPhraseBeat + 16 <= beat) {
        prevPhraseBeat = beat;
        phrase += 1;
        newPhase = true;
        console.log("new phrase");
    }
    window.dispatchEvent(new CustomEvent(updateEvent, {
        bubbles: true,
        composed: true,
        detail: {
            bpm: bpmF,
            phase: phaseF,
            beat: beatF,
            newBeat: newBeat,
            newPhase: newPhase,
        }
    }));
};
const startButton = document.querySelector("button[name='start']");
startButton.addEventListener("click", () => {
    const link = new abletonlink();
    link.update();
    link.startUpdate(link.bpm / 15 / 4, callback);
    console.log(`Updating at ${link.bpm / 15 / 4}`)
});

const colorPicker = new iro.ColorPicker('#picker');
colorPicker.on('color:change', function (color) {
    colorBase = chroma(color.hexString);
});
const intensitySlider = document.querySelector("input[name=intensity]");
intensitySlider.addEventListener("input", (ev) => {
    intensity = ev.target.value;
});
const brightnessSlider = document.querySelector("input[name=brightness]");
brightnessSlider.addEventListener("input", (ev) => {
    brightness = ev.target.value;
});

const linkInfoBeat = document.querySelector("#link-info-beat");
const linkInfoPhase = document.querySelector("#link-info-phase");
const linkInfoBPM = document.querySelector("#link-info-bpm");
const linkInfoNB = document.querySelector("#link-info-new-beat");
window.addEventListener(updateEvent, (ev) => {
    linkInfoBPM.textContent = parseInt(ev.detail.bpm, 10);
    linkInfoPhase.textContent = parseInt(ev.detail.phase, 10);
    linkInfoBeat.textContent = parseInt(ev.detail.beat, 10);
    linkInfoNB.textContent = ev.detail.newBeat;
});

const preview = document.querySelector("#preview-rect");

window.addEventListener(updateEvent, (ev) => {
    const phase = parseInt(ev.detail.phase, 10);
    const beat = parseInt(ev.detail.beat, 10);

    if (ev.detail.newPhase) {
        const hsv = colorBase.hsv();
        hsv[0] += 175 + (Math.random() * 10 * -1); // 180 +- 15c
        colorBase = chroma.hsv(...hsv);
        colorPicker.color.hexString = colorBase.hex();
    }
    if (ev.detail.newBeat) {
        if (phase % 1 === 0) {
            color = colorBase.brighten(brightness / 10).saturate(intensity / 10);
        }
    } else {
        color = color.darken(0.05);
    }
    preview.style.background = color;
});

document.querySelector("button[name='hueStart']").addEventListener("click", async () => {
    let options = {
        address: "10.120.20.51",
    };
    let bridge = await Phea.bridge(options);
    bridge.start(13);
    window.addEventListener(updateEvent, () => {
        let lightId = [0];         // 0 is the Default Group for setting all lights in group.
        let transitionTime = 0; // Milliseconds

        bridge.transition(lightId, color.rgb(), transitionTime);
    });
});
document.querySelector("button[name='hueDiscover']").addEventListener("click", () => {
    Phea.discover().then(b => {
        console.log(b);
    });
});
document.querySelector("button[name='hueRegister']").addEventListener("click", () => {
    Phea.register("10.120.20.51").then(cred => {
        console.log(cred);
    })
});
