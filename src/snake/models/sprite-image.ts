import { AssetsHandler, DIContainer } from "@octo/core";
import { ASSETS_MANAGER_DI, ImageAsset, Sprite, Vec2 } from "@octo/models";

export class SpriteImage implements Sprite {
  image: ImageAsset | undefined;
  assetsManager =
    DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);
  width: number = 0;
  height: number = 0;
  ctx: CanvasRenderingContext2D;
  rotationRadiants: number = 0;
  dx: number = 0;
  dy: number = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    image: string,
    width: number,
    height: number,
    dx: number = 0,
    dy: number = 0,
  ) {
    this.ctx = ctx;
    this.image = this.assetsManager.find<ImageAsset>(image);
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy = dy;
  }

  rotate(radiants: number): void {
    this.rotationRadiants = radiants;
  }

  init(...args: any) {}
  update(deltaTime: number, ...args: any) {}
  render(position: Vec2<number>) {
    if (this.ctx === undefined) {
      throw new Error("ctx is undefined");
    }
    if (this.image === undefined || position === undefined) {
      throw new Error("image or position not defined");
    }

    this.ctx.save();

    // move to the center of the canvas
    this.ctx.translate(position.x, position.y);

    // rotate the canvas to the specified degrees
    if (this.rotationRadiants !== 0) {
      this.ctx.rotate(this.rotationRadiants);
    }

    this.ctx.drawImage(
      this.image?.source,
      // position.x - this.width / 2,
      // position.y - this.height / 2,
      this.dx,
      this.dy,
      this.width,
      this.height,
    );

    this.ctx.restore();
  }
  clean(...args: any) {}

  getDistanceFromCenterToSide(): number {
    return this.getSideLength();
  }
  getSideLength(): number {
    // TODO
    return 0;
  }
}
