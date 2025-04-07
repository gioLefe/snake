import { Vec2 } from "./vec";
import { BoundingBox } from "./bbox";
import { GameCycle, GraphicContext } from "./game-cycle";

export abstract class GameObject<T = GraphicContext> implements GameCycle {
  id?: string;
  ctx: T;
  protected position: Vec2<number> = { x: 0, y: 0 };
  protected bbox: BoundingBox<number> = {
    nw: { x: 0, y: 0 },
    se: { x: 0, y: 0 },
  };

  constructor(ctx: T) {
    this.ctx = ctx;
  }

  init(...args: any) { }
  update(deltaTime: number, ...args: any) { }
  render(...args: any) { }
  clean(...args: any) { }

  setPosition(value: Vec2<number>): void {
    this.position = value;
  }
  getPosition(): Vec2<number> {
    return this.position;
  }
}
