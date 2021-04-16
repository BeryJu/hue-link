import * as chroma from "chroma-js";
import { eventClockTick, ClockTickDetail, eventColorChange, ColorChangeDetail, eventStateChange, eventUILog, LogDetail } from "./common";
import { state } from "./global";
import { AbletonLink } from "./link";
import { HueLight } from "./hue" ;

const iro = require('@jaames/iro');
let link: AbletonLink | undefined;
let hue: HueLight | undefined;

const linkStartButton = document.querySelector<HTMLButtonElement>("button[name='linkStart']")!;
const linkStopButton = document.querySelector<HTMLButtonElement>("button[name='linkStop']")!;
linkStartButton.addEventListener("click", () => {
    link = new AbletonLink()
    link.start();
    linkStartButton.disabled = true;
    linkStopButton.disabled = false;
});
linkStopButton.addEventListener("click", () => {
    link?.stop();
    linkStartButton.disabled = false;
    linkStopButton.disabled = true;
});

const hueStartButton = document.querySelector<HTMLButtonElement>("button[name='hueStart']")!;
const hueStopButton = document.querySelector<HTMLButtonElement>("button[name='hueStop']")!;
hueStartButton.addEventListener("click", async () => {
    hue = new HueLight();
    await hue.init();
    await hue.start();
    hueStartButton.disabled = true;
    hueStopButton.disabled = false;
});
hueStopButton.addEventListener("click", async () => {
    await hue?.stop();
    hueStartButton.disabled = false;
    hueStopButton.disabled = true;
});

export class UI {

    constructor() {
        const colorPicker = new iro.ColorPicker('#picker');
        colorPicker.on('color:change', function (color: any) {
            state.colorBase = chroma(color.hexString);
        });
        const intensitySlider = document.querySelector<HTMLInputElement>("input[name=intensity]")!;
        intensitySlider.addEventListener("input", (ev: Event) => {
            state.intensity = parseInt((ev.target as HTMLInputElement).value, 10);
        });
        const brightnessSlider = document.querySelector<HTMLInputElement>("input[name=brightness]")!;
        brightnessSlider.addEventListener("input", (ev: Event) => {
            state.brightness = parseInt((ev.target as HTMLInputElement).value, 10);
        });
        const decayTimeSlider = document.querySelector<HTMLInputElement>("input[name=decayTime]")!;
        decayTimeSlider.addEventListener("input", (ev: Event) => {
            state.decayTime = parseInt((ev.target as HTMLInputElement).value, 10);
        });
        const colorOffsetMaxSlider = document.querySelector<HTMLInputElement>("input[name=colorOffsetMax]")!;
        colorOffsetMaxSlider.addEventListener("input", (ev: Event) => {
            state.colorOffsetMax = parseInt((ev.target as HTMLInputElement).value, 10);
        });
        const colorOffsetRandSlider = document.querySelector<HTMLInputElement>("input[name=colorOffsetRand]")!;
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

        const logs = document.querySelector("textarea")!;
        window.addEventListener(eventUILog, ((ev: CustomEvent<LogDetail>) => {
            logs.textContent += ev.detail.message + "\n";
            logs.scrollTop = logs.scrollHeight;
        }) as EventListener);

        const preview = document.querySelector<HTMLDivElement>("#preview-rect")!;
        window.addEventListener(eventColorChange, ((ev: CustomEvent<ColorChangeDetail>) => {
            preview.style.background = ev.detail.colors[0].hex();
        }) as EventListener);

        window.addEventListener(eventStateChange, () => {
            intensitySlider.value = state.intensity.toString();
            brightnessSlider.value = state.brightness.toString();
            decayTimeSlider.value = state.decayTime.toString();
            colorOffsetMaxSlider.value = state.colorOffsetMax.toString();
            colorOffsetRandSlider.value = state.colorOffsetRand.toString();
            colorPicker.color.hexString = state.colorBase.hex();
        });
    }

}
