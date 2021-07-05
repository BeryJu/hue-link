import * as chroma from "chroma-js";
export const eventClockTick = "ev-clock-tick";
export const eventColorChange = "ev-color-change";
export const eventStateChange = "ev-state-change";
export const eventUILog = "ev-ui-log";

export const white = chroma("white");

export interface ClockTickDetail {
    bpm: number;
    phase: number;
    beat: number;
    newBeat: boolean;
    newPhase: boolean;
}

export interface ColorChangeDetail {
    colors: chroma.Color[];
    changedId?: number;
}

export interface LogDetail {
    message: string;
}
