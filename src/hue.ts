import { eventColorChange, ColorChangeDetail, eventUILog } from "./common";
import { CONFIG, state } from "./global";
import { bridge } from "Phea";
import { HueBridge } from "Phea/build/hue-bridge";
import chroma = require("chroma-js");

export class HueLight {

    bridge!: HueBridge;

    constructor() {
    }

    async init(): Promise<void> {
        this.bridge = await bridge(CONFIG.hue.connection);
        window.dispatchEvent(new CustomEvent(eventUILog, {
            bubbles: true,
            composed: true,
            detail: {
                message: `[hue] connected`
            }
        }));
    }

    async start(): Promise<void> {
        const groups = await this.bridge.getGroup(0); // 0 will fetch all groups.
        console.log(groups);
        // Ensure we're tracking the same amount of colors as lights
        const ourGroup = groups[CONFIG.hue.config.group];
        ourGroup.lights.forEach((lightId: any, idx: number) => {
            state.color[idx] = chroma("white");
        });
        this.bridge.start(CONFIG.hue.config.group);
        const transitionTime = 0;
        window.addEventListener(eventColorChange, ((ev: CustomEvent<ColorChangeDetail>) => {
            if (ev.detail.changedId) {
                this.bridge.transition([ev.detail.changedId], ev.detail.colors[ev.detail.changedId].rgb(), transitionTime);
            } else {
                ev.detail.colors.forEach((color, idx) => {
                    this.bridge.transition([idx], color.rgb(), transitionTime);
                });
            }
        }) as EventListener);
    }

    async stop(): Promise<void> {
        await this.bridge.stop();
    }

}
