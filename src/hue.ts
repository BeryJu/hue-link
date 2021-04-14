import { eventColorChange, ColorChangeDetail, eventUILog } from "./common";
import { CONFIG } from "./global";
import { bridge } from "Phea";
import { HueBridge } from "Phea/build/hue-bridge";

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
        let groups = await this.bridge.getGroup(0); // 0 will fetch all groups.
        console.log(groups);
        this.bridge.start(CONFIG.hue.config.group);
        window.addEventListener(eventColorChange, ((ev: CustomEvent<ColorChangeDetail>) => {
            let lightId = [0];
            let transitionTime = 0;

            this.bridge.transition(lightId, ev.detail.colorRgb, transitionTime);
        }) as EventListener);
    }

}
