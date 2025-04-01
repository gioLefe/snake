import { PickupItem } from "./";

export class Food extends PickupItem {
  constructor(ctx: CanvasRenderingContext2D, id: string) {
    super(ctx);
    this.id = id;
  }
  id: string;
  value = 1;
}
