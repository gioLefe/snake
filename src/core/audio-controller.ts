export class AudioController {
    static AUDIO_CONTROLLER_DI = "AudioController"
    private audioContext = new AudioContext();

    constructor() { }

    play(buffer: ArrayBuffer | undefined) {
        if (buffer === undefined) {
            return;
        }

        // THIS IS INCONVENIENT!
        // we are doing 2 operations (cloning buffer, and then decode) each time we want to play a sound , and this comes at a cost!
        // Look for a solution
        this.audioContext.decodeAudioData(buffer.slice(0)).then((audioBuffer) => {
            const audioBufferSourceNode = this.audioContext.createBufferSource();
            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(this.audioContext.destination);
            audioBufferSourceNode.start()
        })
    }
}