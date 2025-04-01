import { Vec2 } from "@octo/models";

export type BoundingBox<T> = {
  nw: Vec2<T>;
  se: Vec2<T>;
};
