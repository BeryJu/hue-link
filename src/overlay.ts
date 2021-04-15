import * as express from "express";
import * as expressWs from 'express-ws';
import { eventClockTick, eventUILog } from "./common";
import { CONFIG } from "./global";

export class Overlay {

    app: express.Application;

    constructor() {
        this.app = express();
        expressWs(this.app);
        const port = 3000;
        this.app.use(express.static("vids"));
        this.app.get('/', (req, res) => {
            res.sendFile('index.html', { root: "./overlay" });
        });
        this.app.get('/overlay.css', (req, res) => {
            res.sendFile('overlay.css', { root: "./overlay" });
        });
        (this.app as unknown as expressWs.Router).ws('/beat', function (ws, req) {
            const cb = (ev: CustomEvent) => {
                ws.send(JSON.stringify({
                    type: "clock",
                    data: ev.detail
                }));
            };
            ws.on("close", () => {
                console.log("WS Remove");
                window.removeEventListener(eventClockTick, cb as EventListener);
                // window.removeEventListener(eventColorChange, cb);
            });
            console.log("WS Add");
            window.addEventListener(eventClockTick, cb as EventListener);
            // window.addEventListener(eventColorChange, cb);
        });

        this.app.listen(port, CONFIG.overlay.host, () => {
            window.dispatchEvent(new CustomEvent(eventUILog, {
                bubbles: true,
                composed: true,
                detail: {
                    message: `[overlay] open http://${CONFIG.overlay.host}:${port}`
                }
            }));
        });
    }

}
