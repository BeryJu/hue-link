import { ClockTickDetail } from "./common";

export interface LightMode {
    onTick(detail: ClockTickDetail): void;
}
