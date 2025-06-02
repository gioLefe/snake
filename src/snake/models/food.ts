import { PickupItem } from "./";

export class Food extends PickupItem {
  value = 1;
  constructor(ctx: CanvasRenderingContext2D, id: string) {
    super(ctx);
    this.id = id;
  }
}
