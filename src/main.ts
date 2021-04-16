import { ClockTickDetail, ColorChangeDetail, eventClockTick, eventColorChange } from "./common";
import { state } from "./global";
import { Twitch } from "./twitch";
import { MIDI } from "./midi";
import { Overlay } from "./overlay";
import { UI } from "./ui";

console.log("Starting twitch component...");
new Twitch();
console.log("Started twitch component");
console.log("Starting MIDI component...");
new MIDI();
console.log("Started MIDI component");
console.log("Starting Overlay component...");
new Overlay();
console.log("Started Overlay component");
console.log("Starting UI component...");
new UI();
console.log("Started UI component");

window.addEventListener(eventClockTick, ((ev: CustomEvent<ClockTickDetail>) => {
    const phase = Math.trunc(ev.detail.phase);
    const beat = Math.trunc(ev.detail.beat);

    state.color.forEach((color, idx) => {
        if (state.lightFollowClock) {
            if (ev.detail.newBeat) {
                if (phase % 1 === 0) {
                    state.color[idx] = state.colorBase.brighten(state.brightness / 10).saturate(state.intensity / 10);
                }
            } else {
                state.color[idx] = state.color[idx].darken(state.decayTime / 1000);
            }
        } else {
            state.color[idx] = state.color[idx].darken(state.decayTime / 1000);
        }
        window.dispatchEvent(new CustomEvent(eventColorChange, {
            bubbles: true,
            composed: true,
            detail: <ColorChangeDetail>{
                colors: state.color,
                changedId: idx,
            }
        }));
    });
}) as EventListener);

