import chroma = require("chroma-js");
import { ClockTickDetail, ColorChangeDetail, eventColorChange, white } from "../common";
import { state } from "../global";
import { LightMode } from "../mode";

export default class Alternate implements LightMode {

    leftLights = [2];
    rightLights = [0];

    onTick(detail: ClockTickDetail): void {
        const phase = Math.trunc(detail.phase);

        state.color.forEach((color, idx) => {
            if (state.lightFollowClock) {
                if (detail.newBeat) {
                    if (phase === 0 || phase === 2) {
                        if (this.leftLights.includes(idx)) {
                            state.color[idx] = state.getColor();
                        } else {
                            state.color[idx] = white;
                        }
                    } else if (phase === 1 || phase === 3) {
                        if (this.rightLights.includes(idx)) {
                            state.color[idx] = state.getColor();
                        } else {
                            state.color[idx] = white;
                        }
                    }
                    if (phase % 1 === 0) {
                        if (!this.leftLights.includes(idx) && !this.rightLights.includes(idx)) {
                            state.color[idx] = state.getColor();
                        }
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
