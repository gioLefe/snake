import { createPolygon, renderPolygon, rotatePolygon } from "@octo/helpers";
import { Polygon, Sprite, Vec2 } from "@octo/models";

export class SpritePolygon implements Sprite {
  ctx: CanvasRenderingContext2D;
  polygon: Polygon = {
    sideLength: 0,
    numSides: 0,
    points: [],
  };

  constructor(ctx: CanvasRenderingContext2D, polygonOptions: Partial<Polygon>) {
    this.ctx = ctx;
    this.polygon = createPolygon({
      sideLength: polygonOptions?.sideLength,
      numSides: polygonOptions?.numSides,
      color: polygonOptions?.color,
      outline: polygonOptions?.outline,
    });
  }

  rotate(radiants: number): void {
    this.polygon = rotatePolygon(this.polygon, radiants);
  }

  init(...args: any) {}
  update(deltaTime: number, ...args: any) {}
  render(position: Vec2<number>) {
    renderPolygon(this.polygon, this.ctx, { worldCoordinates: position });
  }
  clean(...args: any) {}

  getDistanceFromCenterToSide(): number {
    return this.getSideLength();
  }
  getSideLength(): number {
    return this.polygon.sideLength;
  }
}
