const tmi = require('tmi.js');
const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    channels: CONFIG.twitch.channels
});
client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {
    if (self) return;
    if (!message.startsWith("!")) return;
    const isSubscriber = "subscriber" in tags.badges || "founder" in tags.badges;
    const isBoosted = "msg-id" in tags ? tags["msg-id"] === "highlighted-message" : false;
    if (!(isSubscriber || isBoosted)) return;
    const col = message.replace("!", "");
    console.log(`setting color to ${col}`);
    colorBase = chroma(col);
    colorPicker.color.hexString = colorBase.hex();
});
