import { ASSETS_MANAGER_DI } from "models/game";
import { AssetsManager } from "./assets-manager";
import { DIContainer } from "./di-container";
import { SoundAsset } from "@octo/models";

export type AudioPlayingOptions = {
  loop: boolean;
  force: boolean;
};

const MAX_VOLUME = 0.5

export class AudioController {
  static AUDIO_CONTROLLER_DI = "AudioController";
  private assetsManager =
    DIContainer.getInstance().resolve<AssetsManager>(ASSETS_MANAGER_DI);
  private audioContext = new AudioContext();
  private mainGainNode = this.audioContext.createGain();
  private playingSounds: Record<string, AudioPlayingOptions> = {};
  get playingAssetsIds() {
    return Object.keys(this.playingSounds);
  }

  constructor() {
    this.mainGainNode.gain.value = MAX_VOLUME;
    this.mainGainNode.connect(this.audioContext.destination);
  }

  setMainVolume(value: number) {
    this.mainGainNode.gain.value =
      value >= 0 && value <= MAX_VOLUME ? value : MAX_VOLUME;
  }

  getMainVolume(): number {
    return this.mainGainNode.gain.value;
  }

  playAsset(
    id: string,
    audioPlayingOptions: AudioPlayingOptions = { loop: false, force: true },
  ) {
    const soundAsset: SoundAsset | undefined =
      this.assetsManager.find<SoundAsset>(id);
    if (soundAsset === undefined) {
      console.warn("Can`t find asset", id);
    }
    if (
      this.playingAssetsIds.indexOf(id) > -1 &&
      audioPlayingOptions.force === false
    ) {
      return;
    }
    this.playingSounds[id] = audioPlayingOptions;

    const buffer = this.assetsManager.find<SoundAsset>(id)?.source;
    if (buffer === undefined) {
      return;
    }

    // THIS IS INCONVENIENT!
    // we are doing 2 operations (cloning buffer, and then decode) each time we want to play a sound , and this comes at a cost!
    // Look for a solution
    this.audioContext.decodeAudioData(buffer.slice(0)).then((audioBuffer) => {
      const audioBufferSourceNode = this.audioContext.createBufferSource();
      audioBufferSourceNode.buffer = audioBuffer;
      audioBufferSourceNode.connect(this.mainGainNode);
      audioBufferSourceNode.start();
      audioBufferSourceNode.loop = audioPlayingOptions.loop;
      audioBufferSourceNode.addEventListener("ended", () => {
        Object.entries(this.playingSounds).forEach((n) => {
          if (n[0] === id) {
            console.log(`Audio buffer ended event: ${id}`);
            delete this.playingSounds[id];
          }
        });
      });
    });
  }
}
