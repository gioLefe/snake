import {
  calculateNormals,
  createPolygon,
  createVector,
  diffVectors,
  rotatePolygon,
  WorldPolygon,
} from "@octo/helpers";
import { GameObject, LinkedListNode, UnitVector, Sprite, Vec2 } from "@octo/models";

export class Segment<
  T extends Sprite,
> extends GameObject<CanvasRenderingContext2D> {
  sprite: T | undefined;

  private nextPivot: LinkedListNode<UnitVector> | undefined;
  private popPivotFn: () => UnitVector | undefined;
  private isTailSegment = false;
  private bboxPolygon: WorldPolygon;

  constructor(
    ctx: CanvasRenderingContext2D,
    direction: number,
    isTail = false,
    sprite: T,
    popPivotFn: () => UnitVector | undefined,
    bboxPolygon: WorldPolygon | undefined,
    worldPosition?: Vec2<number>,
  ) {
    super(ctx);

    this.popPivotFn = popPivotFn;
    this.isTailSegment = isTail;
    this.direction = direction;
    this.position = worldPosition ?? { x: 0, y: 0 };
    this.sprite = sprite;
    this.bboxPolygon =
      bboxPolygon ?? (createPolygon({ numSides: 4 }) as WorldPolygon);
    this.rotate(this.direction);
  }
  override init(...args: any) {
    super.init(args);
  }
  override render(...args: any): void {
    super.render(args);
    this.sprite?.render(this.position);
  }
  override clean(...args: any) {
    super.clean(args);
  }

  override update(deltaTime: number, distance: number): void {
    super.update(deltaTime);
    this.sprite?.update(deltaTime);
    this.moveToNextPosition(distance);
  }

  isTail(): boolean {
    return this.isTailSegment;
  }
  setTail(value: boolean): void {
    this.isTailSegment = value;
  }

  popPivot(): UnitVector | undefined {
    return this.popPivotFn();
  }
  setNextPivot(pivot: LinkedListNode<UnitVector> | undefined) {
    this.nextPivot = pivot;
  }
  getNextPivot(): LinkedListNode<UnitVector> | undefined {
    return this.nextPivot;
  }

  steer(radiants: number): void {
    this.direction = (this.direction + radiants) % (Math.PI * 2);
  }
  rotate(radiants: number): void {
    this.sprite?.rotate(radiants);
    this.bboxPolygon = rotatePolygon(
      this.bboxPolygon,
      radiants,
    ) as WorldPolygon;
  }

  getSideLength(): number | undefined {
    return this.sprite?.getDistanceFromCenterToSide();
  }

  getBBoxPolygon(): WorldPolygon {
    return this.bboxPolygon;
  }

  private moveToNextPosition(distance: number): void {
    while (distance > 0 && this.nextPivot !== undefined) {
      let currDirection = this.getDirection();
      let currPosition = this.getPosition();

      // Calculate if distance to cover is more or less the distance to next pivot
      const pivotPosition = this.nextPivot.data.position;
      const distanceToPivotVec: Vec2<number> = {
        x: currPosition.x - pivotPosition.x,
        y: currPosition.y - pivotPosition.y,
      };
      const distanceProjection = createVector(currDirection, distance);
      const difference = diffVectors(distanceProjection, distanceToPivotVec);

      // If difference is longer than distance to pivot, move to pivot and set next pivot
      if (difference > 0) {
        this.setDirection(this.nextPivot.data.direction);
        this.rotate(this.nextPivot.data.direction);
        this.setPosition({
          x: pivotPosition.x,
          y: pivotPosition.y,
        });
        distance = Math.abs(difference);
        this.setNextPivot(this.nextPivot.next ?? undefined);

        // Tail segment is responsible to pop elements from the pivots list in the snake
        if (this.isTail()) {
          this.popPivot();
        }
      } else {
        this.setPosition({
          x: this.getPosition().x + distanceProjection.x,
          y: this.getPosition().y + distanceProjection.y,
        });
        distance = 0;
      }
    }
    if (this.getNextPivot() === undefined && distance > 0) {
      let nextPositionVec = createVector(this.getDirection(), distance);
      this.setPosition({
        x: this.getPosition().x + nextPositionVec.x,
        y: this.getPosition().y + nextPositionVec.y,
      });
    }
    this.bboxPolygon.worldCoordinates = {
      x: this.getPosition().x,
      y: this.getPosition().y,
    };

    this.bboxPolygon.normals = calculateNormals(
      this.bboxPolygon.points.map(
        (p) =>
          ({
            x: p.x + this.getPosition().x,
            y: p.y + this.getPosition().y,
          }) as Vec2<number>,
      ),
    );
  }
}
