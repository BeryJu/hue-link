import * as chroma from "chroma-js";
import * as tmi from "tmi.js";
import { CONFIG, state } from "./global";

export class Twitch {

    client: tmi.Client;

    constructor() {
        this.client = new tmi.Client({
            options: { debug: true, messagesLogLevel: "info" },
            connection: {
                reconnect: true,
                secure: true
            },
            channels: CONFIG.twitch.channels
        });
        this.client.connect().catch(console.error);
        this.client.on('message', (channel, tags, message, self) => {
            if (self) return;
            if (!message.startsWith("!")) return;
            const isSubscriber = "subscriber" in (tags.badges || {}) || "founder" in (tags.badges || {});
            const isBoosted = "msg-id" in tags ? tags["msg-id"] === "highlighted-message" : false;
            if (!(isSubscriber || isBoosted)) return;
            const col = message.replace("!", "");
            console.log(`setting color to ${col}`);
            state.colorBase = chroma(col);
            // colorPicker.color.hexString = state.colorBase.hex();
        });
    }

}
