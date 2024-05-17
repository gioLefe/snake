import { Vec2 } from "@octo/models";
import { BoundingBox } from "@octo/ui/canvas/models";

export function isPointInAlignedBBox(point: Vec2<number>, bbox: BoundingBox<number>) {
    return point.x >= bbox.nw.x && point.x <= bbox.se.x && point.y >= bbox.nw.y && point.y <= bbox.se.y
}