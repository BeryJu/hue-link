import { eventColorChange, ColorChangeDetail } from "./common";
import { CONFIG } from "./global";

const Phea = require('phea');

export class HueLight {

    bridge!;

    constructor() {
    }

    async init(): Promise<void> {
        this.bridge = await Phea.bridge(CONFIG.hue.connection);
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
