import * as chroma from "chroma-js";
const fs = require("fs");
console.log("Loaded config");

export const CONFIG = JSON.parse(fs.readFileSync("./config.json"));

export class State {
    decayTime = 35;
    intensity = 25;
    brightness = 35;
    colorOffsetMax = 0;
    colorOffsetRand = 10;

    color = chroma("white");
    colorBase = chroma("#4b0082");

    phrase = 0;
    prevBeat = 0;
    prevPhraseBeat = 0;

    lightFollowClock = true;
}

export const state = new State();
