import { Vec2 } from "@octo/models";

export type Pivot = {
  position: Vec2<number>;
  direction: number;
};

export function pivotComparator(p1: Pivot, p2: Pivot) {
  return (
    p1.position.x === p2.position.x &&
    p1.position.y === p2.position.y &&
    p1.direction === p2.direction
  );
}
