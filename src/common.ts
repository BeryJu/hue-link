export const eventClockTick = "ev-clock-tick";
export const eventColorChange = "ev-color-change";

export interface ClockTickDetail {
    bpm: number;
    phase: number;
    beat: number;
    newBeat: boolean;
    newPhase: boolean;
}

export interface ColorChangeDetail {
    colorRgb: number[];
    colorHex: string;
}
