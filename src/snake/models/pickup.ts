import { GameObject, Vec2 } from "@octo/models";

export abstract class Pickup extends GameObject<CanvasRenderingContext2D> {
  protected width: number = 64;
  protected height: number = 64;
  protected override position: Vec2<number> = { x: 0, y: 0 };

  getWidth(): number {
    return this.width;
  }
  setWidth(width: number) {
    this.width = width;
  }
  getHeight(): number {
    return this.height;
  }
  setHeight(height: number) {
    this.height = height;
  }

  onPickup(...args: any): any {}
  override getPosition(): Vec2<number> {
    return this.position;
  }
}

export abstract class PickupItem extends Pickup {
  override id: string = "";

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }
  override init(ctx: CanvasRenderingContext2D, ...args: any) {
    super.init(ctx, args);
  }
  override update(deltaTime: number, ...args: any) {
    super.update(args);
  }
  override render(...args: any) {
    super.render(args);
  }
  override clean(...args: any) {
    super.clean(args);
  }

  override onPickup(...args: any) {
    super.onPickup(args);
  }
}
