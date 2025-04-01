import { HTMLImageAsset, Tag } from "@octo/models";

export type AssetRequest = { id: string; path: string };

export interface AssetsHandler {
  assets: Map<string, HTMLImageAsset> | undefined;
  addImage(id: string, path: string): Promise<void>;
  addImages(images: AssetRequest[]): Promise<void>[];
  getImage(id: string): HTMLImageAsset | undefined;
  deleteImage(id: string): void;
  addTag(id: string, tag: Tag): void;
}

export class AssetsManager implements AssetsHandler {
  assets: Map<string, HTMLImageAsset>;

  constructor() {
    this.assets = new Map();
  }

  addImage(id: string, path: string): Promise<void> {
    return this.addImagePromise(this, id, path);
  }
  addImages(images: AssetRequest[]): Promise<void>[] {
    return images.map((i) => this.addImagePromise(this, i.id, i.path));
  }

  getImage(id: string): HTMLImageAsset | undefined {
    if (this.assets.has(id) === false) {
      console.warn(`cannot find asset ${id}`);
      return;
    }
    return this.assets.get(id);
  }
  deleteImage(id: string): void {
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

  private addImagePromise(assetManagerHandle: this, id: string, path: string) {
    return new Promise<void>(function (resolve, reject) {
      const img = new Image();
      img.onload = function () {
        assetManagerHandle.assets.set(id, { img, tags: [] });
        resolve();
      };
      img.onerror = function () {
        reject(`cannot load ${id} at ${path}`);
      };
      img.src = path;
    });
  }
}
