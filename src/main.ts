import { ClockTickDetail, eventClockTick } from "./common";
import { state } from "./global";
import { Twitch } from "./twitch";
import { MIDI } from "./midi";
import { Overlay } from "./overlay";
import { UI } from "./ui";
import ImpactAll from "./modes/impactAll";

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

state.mode = new ImpactAll();

window.addEventListener(eventClockTick, ((ev: CustomEvent<ClockTickDetail>) => {
    state.mode?.onTick(ev.detail);
}) as EventListener);
