import { AssetsHandler, DIContainer } from "@octo/core";
import { ASSETS_MANAGER_DI, GameObject, ImageAsset } from "@octo/models";

export class Spinner extends GameObject<CanvasRenderingContext2D> {
  assetsManager =
    DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);
  image: ImageAsset | undefined;
  rotation = 0;
  speed = 0.1;

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  init() {
    super.init();
    this.image = this.assetsManager.find("spinner");
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    this.rotation = this.rotation >= 1 ? 0 : this.rotation + this.speed;
  }

  render(...args: any) {
    super.render(args);
    if (this.image === undefined) {
      console.warn("image is not loaded");
      return;
    }
    if (this.ctx === undefined) {
      throw new Error("ctx is undefined");
    }
    // drawRotated(this.ctx, this.canv)

    // this.ctx?.translate(232, 232);
    // this.ctx?.rotate(this.rotation);
    this.ctx.save();
    this.ctx.globalAlpha = this.rotation;
    this.ctx.drawImage(this.image?.source, 150, 150);
    this.ctx.restore();
    // this.ctx?.rotate(0);
  }
}
