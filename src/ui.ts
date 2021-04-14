import * as chroma from "chroma-js";
import { eventClockTick, ClockTickDetail, eventColorChange, ColorChangeDetail } from "./common";
import { state } from "./global";
import { AbletonLink } from "./link";

const iro = require('@jaames/iro');

const startButton = document.querySelector("button[name='start']")!;
startButton.addEventListener("click", () => {
    new AbletonLink().start();
});

const colorPicker = new iro.ColorPicker('#picker');
colorPicker.on('color:change', function (color: any) {
    state.colorBase = chroma(color.hexString);
});
const intensitySlider = document.querySelector("input[name=intensity]")!;
intensitySlider.addEventListener("input", (ev: Event) => {
    state.intensity = parseInt((ev.target as HTMLInputElement).value, 10);
});
const brightnessSlider = document.querySelector("input[name=brightness]")!;
brightnessSlider.addEventListener("input", (ev: Event) => {
    state.brightness = parseInt((ev.target as HTMLInputElement).value, 10);
});
const decayTimeSlider = document.querySelector("input[name=decayTime]")!;
decayTimeSlider.addEventListener("input", (ev: Event) => {
    state.decayTime = parseInt((ev.target as HTMLInputElement).value, 10);
});
const colorOffsetMaxSlider = document.querySelector("input[name=colorOffsetMax]")!;
colorOffsetMaxSlider.addEventListener("input", (ev: Event) => {
    state.colorOffsetMax = parseInt((ev.target as HTMLInputElement).value, 10);
});
const colorOffsetRandSlider = document.querySelector("input[name=colorOffsetRand]")!;
colorOffsetRandSlider.addEventListener("input", (ev: Event) => {
    state.colorOffsetRand = parseInt((ev.target as HTMLInputElement).value, 10);
});

const linkInfoBeat = document.querySelector("#link-info-beat")!;
const linkInfoPhase = document.querySelector("#link-info-phase")!;
const linkInfoBPM = document.querySelector("#link-info-bpm")!;
const linkInfoNB = document.querySelector("#link-info-new-beat")!;
window.addEventListener(eventClockTick, ((ev: CustomEvent<ClockTickDetail>) => {
    linkInfoBPM.textContent = Math.trunc(ev.detail.bpm).toString();
    linkInfoPhase.textContent = (Math.trunc(ev.detail.phase) + 1).toString();
    linkInfoBeat.textContent = Math.trunc(ev.detail.beat).toString();
    linkInfoNB.textContent = ev.detail.newBeat.toString();
}) as EventListener);

const preview = document.querySelector<HTMLDivElement>("#preview-rect")!;
window.addEventListener(eventColorChange, ((ev: CustomEvent<ColorChangeDetail>) => {
    preview.style.background = ev.detail.colorHex;
    colorPicker.color.hexString = ev.detail.colorHex;
}) as EventListener);
