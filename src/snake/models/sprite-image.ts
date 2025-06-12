import { DIContainer } from "../../core";
import { AssetsHandler } from "../../core/models/assets-handler";
import { Sprite, ImageAsset, ASSETS_MANAGER_DI, Vec2 } from "../../models";

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

  init(..._args: any) {}
  update(_deltaTime: number, ..._args: any) {}
  render(
    position: Vec2<number>,
    dx: number = -this.width / 2,
    dy: number = -this.height / 2,
  ) {
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

    this.ctx.drawImage(this.image?.source, dx, dy, this.width, this.height);

    this.ctx.restore();
  }
  clean(..._args: any) {}

  getDistanceFromCenterToSide(): number {
    return this.getSideLength();
  }
  getSideLength(): number {
    // TODO
    return this.width / 2;
  }
}
