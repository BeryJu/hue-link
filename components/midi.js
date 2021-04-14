const midiNoteOff = 8; // 1000
const midiNoteOn = 9; // 1001
const midiCC = 11; // 1011

navigator.requestMIDIAccess().then(midi => {
    midi.inputs.forEach(input => {
        if (input.name !== CONFIG.midi.deviceName) {
            return;
        }
        input.onmidimessage = (m) => {
            const bytes = m.data;
            const type = bytes[0] >> 4;
            const channel = bytes[0] & type;
            const byteA = bytes[1];
            const byteB = bytes[2] + 1;
            if (type === midiCC) {
                // byteA is controlNumber and byteB is controlValue
                switch (CONFIG.midi.cc[byteA.toString()]) {
                    case "intensity":
                        intensitySlider.value = byteB / 2;
                        intensity = byteB / 2;
                        break;
                    case "brightness":
                        brightnessSlider.value = byteB / 2;
                        brightness = byteB / 2;
                        break;
                    case "decayTime":
                        decayTimeSlider.value = byteB / 2;
                        decayTime = byteB / 2;
                        break;
                    case "colorOffsetMax":
                        colorOffsetMaxSlider.value = byteB *1.417322835;
                        colorOffsetMax = byteB *1.417322835;
                        break;
                    case "colorOffsetRand":
                        colorOffsetRandSlider.value = byteB;
                        colorOffsetRand = byteB;
                        break;
                    default:
                        break;
                }
            } else if (type === midiNoteOn) {
                // byteA is note and byteB is velocity
                if (byteB <= 5) {
                    return;
                }
                switch (CONFIG.midi.notes[byteA.toString()]) {
                    case "randomColor":
                        setRandomColor();
                        break;
                    case "flashCurrent":
                        color = colorBase;
                        break;
                    case "flashWhite":
                        color = chroma("white");
                        break;
                    case "clockFollowOn":
                        lightFollowClock = true;
                        break;
                    case "clockFollowOff":
                        lightFollowClock = false;
                        break;
                    case "newPhrase":
                        prevPhraseBeat = prevBeat;
                        break;
                    case "linkStop":
                        prevPhraseBeat = prevBeat;
                        break;
                    default:
                        break;
                }
            } else {
                console.log(bytes);
            }
            console.debug(`MIDI type ${type} on channel ${channel}: ${bytes[1]};${bytes[2]};${bytes[2]/2}`);
        };
    });
}).catch(err => {
    console.error(err);
});
