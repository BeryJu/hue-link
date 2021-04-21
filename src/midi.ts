import * as chroma from "chroma-js";
import { ColorChangeDetail, eventColorChange, eventUILog } from "./common";
import { CONFIG, state } from "./global";

export const midiNoteOff = 8; // 1000
export const midiNoteOn = 9; // 1001
export const midiCC = 11; // 1011

export function setRandomColor() {
    const hsv = state.colorBase.hsv();
    hsv[0] += state.colorOffsetMax + (Math.random() * state.colorOffsetRand);
    state.colorBase = chroma.hsv(...hsv);
}

export class MIDI {

    constructor() {
        navigator.requestMIDIAccess().then(midi => {
            midi.inputs.forEach(input => {
                if (input.name !== CONFIG.midi.deviceName) {
                    return;
                }
                input.addEventListener("midimessage", (m) => {
                    this.callback(m);
                });
            });
        }).catch(err => {
            console.error(err);
        });
    }

    callback(m: WebMidi.MIDIMessageEvent): void {
        const bytes = m.data;
        const type = bytes[0] >> 4;
        const channel = bytes[0] & type;
        const byteA = bytes[1];
        const byteB = bytes[2] + 1;
        console.debug(`MIDI type ${type} on channel ${channel}: ${bytes[1]};${bytes[2]};${bytes[2] / 2}`);
        if (type === midiCC) {
            // byteA is controlNumber and byteB is controlValue
            switch (CONFIG.midi.cc[byteA.toString()]) {
                case "intensity":
                    state.intensity = byteB / 2;
                    break;
                case "brightness":
                    state.brightness = byteB / 2;
                    break;
                case "decayTime":
                    state.decayTime = byteB / 2;
                    break;
                case "colorOffsetMax":
                    state.colorOffsetMax = byteB * 1.417322835;
                    break;
                case "colorOffsetRand":
                    state.colorOffsetRand = byteB / 2;
                    break;
                default:
                    break;
            }
        } else if (type === midiNoteOn) {
            // byteA is note and byteB is velocity
            if (byteB <= 5) {
                return;
            }
            const key = CONFIG.midi.notes[byteA.toString()];
            if (!key) {
                return;
            }
            switch (key.cmd) {
                case "randomColor":
                    setRandomColor();
                    break;
                case "flashCurrent":
                    if (key.light !== undefined) {
                        state.color[key.light] = state.getColor();
                        window.dispatchEvent(new CustomEvent(eventColorChange, {
                            bubbles: true,
                            composed: true,
                            detail: <ColorChangeDetail>{
                                colors: state.color,
                                changedId: key.light,
                            }
                        }));
                    } else {
                        state.color.forEach((c, idx) => {
                            state.color[idx] = state.getColor();
                        });
                    }
                    break;
                case "flash":
                    if (key.light !== undefined) {
                        state.color[key.light] = chroma(key.color);
                        window.dispatchEvent(new CustomEvent(eventColorChange, {
                            bubbles: true,
                            composed: true,
                            detail: <ColorChangeDetail>{
                                colors: state.color,
                                changedId: key.light,
                            }
                        }));
                    } else {
                        state.color.forEach((c, idx) => {
                            state.color[idx] = chroma(key.color);
                        });
                    }
                    break;
                case "setColor":
                    state.colorBase = chroma(key.color);
                    break;
                case "clockFollowOn":
                    state.lightFollowClock = true;
                    break;
                case "clockFollowOff":
                    state.lightFollowClock = false;
                    break;
                case "newPhrase":
                    state.prevPhraseBeat = state.prevBeat;
                    break;
                case "linkStop":
                    state.prevPhraseBeat = state.prevBeat;
                    break;
                default:
                    break;
            }
        } else {
            window.dispatchEvent(new CustomEvent(eventUILog, {
                bubbles: true,
                composed: true,
                detail: {
                    message: `[mid] unknown midi type`
                }
            }));
        }
    }

}
