import * as chroma from "chroma-js";
import { eventStateChange } from "./common";
import { readFileSync } from "fs";
console.log("Loaded config");

export const CONFIG = JSON.parse(readFileSync("./config.json").toString());

export function sendUpdateEvent() {
    window.dispatchEvent(new CustomEvent(eventStateChange, {
        bubbles: true,
        composed: true,
    }));
}

export class State {

    _decayTime = 35;
    get decayTime(): number {
        return this._decayTime;
    }
    set decayTime(value: number) {
        this._decayTime = value;
        sendUpdateEvent();
    }

    _intensity = 25;
    get intensity(): number {
        return this._intensity;
    }
    set intensity(value: number) {
        this._intensity = value;
        sendUpdateEvent();
    }

    _brightness = 35;
    get brightness(): number {
        return this._brightness;
    }
    set brightness(value: number) {
        this._brightness = value;
        sendUpdateEvent();
    }

    _colorOffsetMax = 0;
    get colorOffsetMax(): number {
        return this._colorOffsetMax;
    }
    set colorOffsetMax(value: number) {
        this._colorOffsetMax = value;
        sendUpdateEvent();
    }

    _colorOffsetRand = 10;
    get colorOffsetRand(): number {
        return this._colorOffsetRand;
    }
    set colorOffsetRand(value: number) {
        this._colorOffsetRand = value;
        sendUpdateEvent();
    }

    _lightFollowClock = true;
    get lightFollowClock(): boolean {
        return this._lightFollowClock;
    }
    set lightFollowClock(value: boolean) {
        this._lightFollowClock = value;
        sendUpdateEvent();
    }

    color = [
        chroma("white"),
    ];
    colorBase = chroma("#4b0082");

    phrase = 0;
    prevBeat = 0;
    prevPhraseBeat = 0;

    getColor(): chroma.Color {
        return state.colorBase.brighten(state.brightness / 10).saturate(state.intensity / 10);
    }

}

export const state = new State();
