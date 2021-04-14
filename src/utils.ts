import { state } from "./global";
import * as Chroma from "chroma-js";

export function setRandomColor() {
    const hsv = state.colorBase.hsv();
    hsv[0] += state.colorOffsetMax + (Math.random() * state.colorOffsetRand);
    state.colorBase = Chroma.hsv(...hsv);
    // colorPicker.color.hexString = state.colorBase.hex();
}
