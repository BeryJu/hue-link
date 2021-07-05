import { ClockTickDetail, ColorChangeDetail, eventColorChange } from "../common";
import { state } from "../global";
import { LightMode } from "../mode";

export default class ImpactAll implements LightMode {

    onTick(detail: ClockTickDetail): void {
        const phase = Math.trunc(detail.phase);

        state.color.forEach((color, idx) => {
            if (state.lightFollowClock) {
                if (detail.newBeat) {
                    if (phase % 1 === 0) {
                        state.color[idx] = state.getColor();
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
    }

}
