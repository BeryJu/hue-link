const abletonlink = require('abletonlink');
const chroma = require("chroma-js");
const iro = require('@jaames/iro');
const Phea = require('phea');
const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const fs = require("fs");

const CONFIG = JSON.parse(fs.readFileSync("./config.json"));
console.log("Loaded config");

const eventClockTick = "ev-clock-tick";
const eventLightChange = "ev-light-change";

let decayTime = 35;
let intensity = 25;
let brightness = 35;
let colorOffsetMax = 0;
let colorOffsetRand = 10;
let colorBase = chroma("#4b0082");

let phrase = 0;
let prevBeat = 0;
let prevPhraseBeat = 0;

let lightFollowClock = true;

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
    window.dispatchEvent(new CustomEvent(eventClockTick, {
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
const decayTimeSlider = document.querySelector("input[name=decayTime]");
decayTimeSlider.addEventListener("input", (ev) => {
    decayTime = ev.target.value;
});
const colorOffsetMaxSlider = document.querySelector("input[name=colorOffsetMax]");
colorOffsetMaxSlider.addEventListener("input", (ev) => {
    colorOffsetMax = ev.target.value;
});
const colorOffsetRandSlider = document.querySelector("input[name=colorOffsetRand]");
colorOffsetRandSlider.addEventListener("input", (ev) => {
    colorOffsetRand = ev.target.value;
});

const linkInfoBeat = document.querySelector("#link-info-beat");
const linkInfoPhase = document.querySelector("#link-info-phase");
const linkInfoBPM = document.querySelector("#link-info-bpm");
const linkInfoNB = document.querySelector("#link-info-new-beat");
window.addEventListener(eventClockTick, (ev) => {
    linkInfoBPM.textContent = parseInt(ev.detail.bpm, 10);
    linkInfoPhase.textContent = parseInt(ev.detail.phase, 10) + 1;
    linkInfoBeat.textContent = parseInt(ev.detail.beat, 10);
    linkInfoNB.textContent = ev.detail.newBeat;
});

const preview = document.querySelector("#preview-rect");
window.addEventListener(eventLightChange, (ev) => {
    preview.style.background = ev.detail.colorHex;
});

let color = chroma("#fff");
function setRandomColor() {
    const hsv = colorBase.hsv();
    hsv[0] += colorOffsetMax + (Math.random() * colorOffsetRand);
    colorBase = chroma.hsv(...hsv);
    colorPicker.color.hexString = colorBase.hex();
}
window.addEventListener(eventClockTick, (ev) => {
    const phase = parseInt(ev.detail.phase, 10);
    const beat = parseInt(ev.detail.beat, 10);

    if (lightFollowClock) {
        if (ev.detail.newPhase) {
            setRandomColor();
        }
        if (ev.detail.newBeat) {
            if (phase % 1 === 0) {
                color = colorBase.brighten(brightness / 10).saturate(intensity / 10);
            }
        } else {
            color = color.darken(decayTime/1000);
        }
    } else {
        color = color.darken(decayTime/1000);
    }
    window.dispatchEvent(new CustomEvent(eventLightChange, {
        bubbles: true,
        composed: true,
        detail: {
            colorRgb: color.rgb(),
            colorHex: color.hex(),
        }
    }));
});

document.querySelector("button[name='hueStart']").addEventListener("click", async () => {
    let bridge = await Phea.bridge(CONFIG.hue);
    let groups = await bridge.getGroup(0); // 0 will fetch all groups.
    console.log(groups);
    bridge.start(13);
    window.addEventListener(eventLightChange, (ev) => {
        let lightId = [0];
        let transitionTime = 0;

        bridge.transition(lightId, ev.detail.colorRgb, transitionTime);
    });
});
document.querySelector("button[name='hueDiscover']").addEventListener("click", () => {
    Phea.discover().then(b => {
        console.log(b);
    });
});
document.querySelector("button[name='hueRegister']").addEventListener("click", () => {
    Phea.register(CONFIG.hue.address).then(cred => {
        console.log(cred);
    });
});

const app = express();
expressWs(app);
const port = 3000;
app.use(express.static("vids"));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/overlay/index.html'));
});
app.get('/ui/overlay.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/ui/overlay.css'));
});
app.ws('/beat', function (ws, req) {
    const cb = (ev) => {
        ws.send(JSON.stringify({
            type: "clock",
            data: ev.detail
        }));
    };
    ws.on("close", () => {
        console.log("WS Remove");
        window.removeEventListener(eventClockTick, cb);
        // window.removeEventListener(eventLightChange, cb);
    });
    console.log("WS Add");
    window.addEventListener(eventClockTick, cb);
    // window.addEventListener(eventLightChange, cb);
});

app.listen(port, "127.0.0.1", () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
