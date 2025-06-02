import { GameObject } from "@octo/models";

export abstract class Pickup extends GameObject<CanvasRenderingContext2D> {
  onPickup(...args: any): any {}
}

export abstract class PickupItem extends Pickup {
  override id: string = "";

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  override onPickup(...args: any) {
    super.onPickup(args);
  }
}
