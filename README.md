# Hue-Link

Link philips hue lights with ableton link based on BPM

## Configuration

Create a `config.json` file in the root directory, copying from the `config.example.json` file.

```json
{
    "hue": {
        "connection": {
            "address": "1.2.3.4", # IP Address of your Hue bridge
            "psk": "",
            "username": ""
        },
        "config": {
            "group": 13 # Group of the lights that should be synced
        }
    },
    "twitch": {
        "channels": [] # List of twitch channels to watch for commands
    },
    "overlay": {
        "host": "127.0.0.1"
    },
    "midi": {
        "deviceName": "USB Trigger Finger",
        "cc": {
            "102": "intensity",
            "103": "brightness",
            "104": "decayTime",
            "106": "colorOffsetMax",
            "107": "colorOffsetRand"
        },
        "notes": {
            "36": "randomColor",
            "37": "flashWhite",
            "41": "flashCurrent",
            "47": "clockFollowOff",
            "51": "clockFollowOn",
            "48": "newPhrase"
        }
    }
}
```
