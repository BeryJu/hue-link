const path = require('path');
import * as express from "express";
import * as expressWs from 'express-ws';
import { eventClockTick } from "./common";

export class Overlay {

    app: express.Application;

    constructor() {
        this.app = express();
        expressWs(this.app);
        const port = 3000;
        this.app.use(express.static("vids"));
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname + '/overlay/index.html'));
        });
        this.app.get('/ui/overlay.css', (req, res) => {
            res.sendFile(path.join(__dirname + '/ui/overlay.css'));
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

        this.app.listen(port, "127.0.0.1", () => {
            console.log(`Example app listening at http://localhost:${port}`)
        });
    }

}
