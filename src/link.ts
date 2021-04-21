import { ClockTickDetail, eventClockTick } from "./common";
import { state } from "./global";
const abletonlink = require('abletonlink');

type eventTypes = 'tempo' | 'numPeers' | 'playState';
type updateCallback = (beat: number, phase: number, bpm: number, playState: boolean) => void;

declare abstract class AbletonLinkBase {
    // native code
    constructor(bpm?: number, quantum?: number, enable?: boolean)
    setBeatForce(beat: number): void
    play(): void
    stop(): void
    getNumPeers(): number
    enable(): void
    disable(): void
    enablePlayStateSync(): void
    disablePlayStateSync(): void
    update(): void
    onTempoChanged(cb: updateCallback): void
    onNumPeersChanged(cb: updateCallback): void
    onPlayStateChanged(cb: updateCallback): void
    on(key: eventTypes, cb: updateCallback): void
    off(key: eventTypes): void
    bpm: number;
    // JavaScript
    startUpdate(interval_ms: number, cb?: updateCallback): void
    stopUpdate(): void
}

export class AbletonLink {

    link: AbletonLinkBase;

    constructor() {
        this.link = new abletonlink();
    }

    start(): void {
        this.link.update();
        this.link.startUpdate(this.link.bpm / 15 / 4, (beatF: number, phaseF: number, bpmF: number) => {
            const beat = Math.trunc(beatF);
            let newBeat = false;
            if (beat > state.prevBeat) {
                state.prevBeat = beat;
                newBeat = true;
                console.log("new beat");
            }
            let newPhase = false;
            if (state.prevPhraseBeat + 16 <= beat) {
                state.prevPhraseBeat = beat;
                state.phrase += 1;
                newPhase = true;
                console.log("new phrase");
            }
            window.dispatchEvent(new CustomEvent<ClockTickDetail>(eventClockTick, {
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
        });
        console.log(`Updating at ${this.link.bpm / 15 / 4}`)
    }

    stop(): void {
        this.link.stopUpdate();
        this.link.stop();
    }

}
