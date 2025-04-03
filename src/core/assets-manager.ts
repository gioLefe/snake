import { ImageAsset, SoundAsset, Tag } from "@octo/models";

export type GameAsset = { id: string; path: string, type: 'IMAGE' | 'AUDIO' };

export interface AssetsHandler {
  assets: Map<string, ImageAsset | SoundAsset> | undefined;
  add(assetRequests: GameAsset[]): Promise<void>[];
  find<T extends ImageAsset | SoundAsset>(id: string): T | undefined;
  delete(id: string): void;

  addTag(id: string, tag: Tag): void;
}

export class AssetsManager implements AssetsHandler {
  assets: Map<string, ImageAsset | SoundAsset> = new Map();

  add(assetRequests: GameAsset[]): Promise<void>[] {
    return assetRequests.map((request) => this.createObjectPromise(this, request));
  }

  find<T>(id: string): T | undefined {
    if (this.assets.has(id) === false) {
      console.warn(`cannot find asset ${id}`);
      return;
    }
    return this.assets.get(id) as T;
  }
  delete(id: string): void {
    this.assets.delete(id);
  }
  addTag(id: string, tag: Tag): void {
    const a = this.assets.get(id);
    if (a === undefined) {
      console.warn(`cannot find asset ${id}`);
      return;
    }
    a.tags.push(tag);
    this.assets.set(id, a);
  }

  private createObjectPromise(assetManagerHandle: this, assetRequest: GameAsset): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let obj: HTMLImageElement | HTMLAudioElement;

      if (assetRequest.type === "AUDIO") {
        obj = new Audio(assetRequest.path);
        assetManagerHandle.assets.set(assetRequest.id, { source: obj as HTMLAudioElement, tags: [] });
        return resolve();
      }

      obj = new Image();
      obj.onload = function () {
        assetManagerHandle.assets.set(assetRequest.id, { source: obj as HTMLImageElement, tags: [] });
        return resolve();
      };
      obj.onerror = function () {
        reject(`cannot load ${assetRequest.id} at ${assetRequest.path}`);
      };
      obj.src = assetRequest.path;
    })
  }
}
