import {
  angleBetween,
  checkSATCollision,
  createPolygon,
  createVector,
  renderPolygon,
  toPrecisionNumber,
  WorldPolygon,
} from "@octo/helpers";
import { GameObject, LinkedList, Polygon, Vec2 } from "@octo/models";
import { DEFAULT_POLYGON_SIZE } from "snake/constants";
import { Pivot, pivotComparator } from "../../models/pivot";
import { Segment } from "./segment";
import { SpriteImage } from "./sprite-image";
import { SpritePolygon } from "./sprite-polygon";

export type SnakeInitParam = Partial<Snake> & {
  worldCoordinates?: Vec2<number>;
  initialDirection?: number;
  length?: number;
};

export type SteerDirection = {
  Left: 1;
  Right: 2;
};

const DEBUG = false;
const HEAD_SEGMENT_COLOR = "#86a04e";
const SEGMENT_COLOR = "#576c1a";
const SEGMENT_SIDES = 6;
const HEAD_SIZE: Vec2<number> = { x: 64, y: 64 };

export class Snake extends GameObject<CanvasRenderingContext2D> {
  override id: string;
  protected override direction: number = Math.random() % (Math.PI * 2);
  private readonly BIT_DISTANCE = 15;
  private length: number = 10;
  private headSegment: Segment<SpriteImage> | undefined;
  private segments: Segment<SpritePolygon>[] = [];
  private turboSpeed: number = 500;
  private speed: number = 350;
  private turbonOn: boolean = false;

  private maxSteerAngle = 0.1;
  private targetPoint: Vec2<number> | undefined = undefined;

  private pivots: LinkedList<Pivot> = new LinkedList(pivotComparator);

  constructor(ctx: CanvasRenderingContext2D, id: string) {
    super(ctx);
    this.id = id;
  }

  override init(args: SnakeInitParam) {
    if (args?.initialDirection) {
      this.direction = args.initialDirection;
    }
    if (args?.length) {
      this.length = args.length;
    }
    this.headSegment = new Segment<SpriteImage>(
      this.ctx,
      this.direction,
      false,
      new SpriteImage(
        this.ctx,
        "snake-face",
        HEAD_SIZE.x,
        HEAD_SIZE.y,
        -(HEAD_SIZE.x / 2),
        -(HEAD_SIZE.y / 2),
      ),
      this.popPivot,
      createPolygon({
        numSides: 6,
        sideLength: HEAD_SIZE.x / 2,
      }) as WorldPolygon,
      args.worldCoordinates,
    );
    this.headSegment.init();

    for (let i = 0; i < (args.length ?? this.length); i++) {
      const previousBit: Segment<SpritePolygon> | Segment<SpriteImage> =
        i === 0 ? this.headSegment : this.segments[i - 1];
      const tailDirection: number = this.direction + Math.PI;

      this.segments[i] = new Segment<SpritePolygon>(
        this.ctx,
        this.direction,
        i === this.length - 1,
        new SpritePolygon(this.ctx, {
          sideLength: this.calcPolygonSize(i, this.length),
          numSides: SEGMENT_SIDES,
          color: SEGMENT_COLOR,
          outline: true,
        }),
        this.popPivot,
        createPolygon({
          numSides: SEGMENT_SIDES,
          sideLength: this.calcPolygonSize(i, this.length),
        }) as WorldPolygon,
        {
          x:
            previousBit.getPosition().x +
            Math.cos(tailDirection) * this.BIT_DISTANCE,
          y:
            previousBit.getPosition().y +
            Math.sin(tailDirection) * this.BIT_DISTANCE,
        },
      );
      this.segments[i].init();
    }
  }
  override clean(..._args: any) {
    console.warn("Method not implemented.");
  }
  override render(...args: any): void {
    super.render(args);
    for (let i = this.segments.length - 1; i >= 0; i--) {
      this.segments[i].render();
    }
    this.headSegment?.render();

    if (DEBUG) {
      this.renderDebug(this.ctx);
    }
  }
  override update(deltaTime: number, ...args: any) {
    if (this.headSegment === undefined) {
      throw new Error("Head segment is undefined");
    }

    super.update(deltaTime, args);
    const speed = this.getSpeed();

    // Check if there is a target point to steer towards to (i.e: Mouse movement)
    const angleToTarget = this.calcHeadTargetAngle(this.targetPoint);
    if (angleToTarget !== 0) {
      let angleFactor = angleToTarget > 0 ? -1 : 1;
      let steerAngle: number = 0;

      if (Math.abs(angleToTarget - Math.PI) < this.maxSteerAngle) {
        steerAngle = Math.abs(angleToTarget - Math.PI) * angleFactor;
        this.targetPoint = undefined;
      } else {
        steerAngle = this.maxSteerAngle * angleFactor;
      }

      this.steer(steerAngle);
    }

    const distanceToCover = speed * deltaTime;
    this.headSegment.update(deltaTime, distanceToCover);
    for (let i = 0; i < this.length; i++) {
      this.segments[i].update(deltaTime, distanceToCover);
    }
  }

  steer(radiants: number) {
    if (this.headSegment === undefined) {
      throw new Error("Head segment is undefined");
    }
    if (this.headSegment.sprite === undefined) {
      throw new Error("Head sprite is undefined");
    }
    const sPos = this.headSegment.getPosition();
    if (sPos === undefined) {
      throw new Error("Head Segment does not have a position!");
    }

    // Use % PI*2 to simplify the direction number
    this.direction = (this.direction + radiants) % (Math.PI * 2);
    this.headSegment.setDirection(this.direction);
    this.headSegment.rotate(this.direction);

    const pivot: Pivot = {
      position: { x: sPos.x, y: sPos.y },
      direction: this.direction,
    };
    const nodePivot = this.pivots.append(pivot);

    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (segment === undefined) {
        throw new Error("Segment is undefined");
      }
      if (segment.sprite === undefined) {
        throw new Error("segment sprite is undefined");
      }

      if (this.segments[i].getNextPivot() !== undefined) {
        continue;
      }
      this.segments[i].setNextPivot(nodePivot);
    }
  }
  steerTo(point: Vec2<number>): void {
    this.targetPoint = point;
  }
  setTurbo(turbo: boolean) {
    this.turbonOn = turbo;
  }

  getHeadPosition(): Vec2<number> {
    return this.headSegment?.getPosition() ?? { x: 0, y: 0 };
  }
  override getDirection(): number {
    return this.headSegment?.getDirection() ?? -1;
  }
  getSpeed(): number {
    return this.turbonOn ? this.turboSpeed : this.speed;
  }
  getHeadSideLength(): number | undefined {
    return this.headSegment?.getSideLength();
  }
  popPivot = (): Pivot | undefined => {
    if (this.pivots.size()) {
      const pivot = this.pivots.head;
      if (pivot !== null) {
        this.pivots.delete(pivot.data);
      }
      return pivot?.data;
    }
    return undefined;
  };
  addSegment() {
    this.length = this.length + 1;
    const previousBit = this.segments[this.segments.length - 1];
    previousBit.setTail(false);

    const tailDirection: number = previousBit.getDirection() + Math.PI;

    const newSegmentIndex = this.segments.push(
      new Segment<SpritePolygon>(
        this.ctx,
        previousBit.getDirection(),
        true,
        new SpritePolygon(this.ctx, {
          sideLength: this.calcPolygonSize(
            this.segments.length + 1,
            this.length,
          ),
          numSides: SEGMENT_SIDES,
          color: SEGMENT_COLOR,
          outline: true,
        }),
        this.popPivot,
        createPolygon({
          numSides: SEGMENT_SIDES,
          sideLength: this.calcPolygonSize(
            this.segments.length + 1,
            this.length,
          ),
        }) as WorldPolygon,
        {
          x:
            previousBit.getPosition().x +
            Math.cos(tailDirection) * this.BIT_DISTANCE,
          y:
            previousBit.getPosition().y +
            Math.sin(tailDirection) * this.BIT_DISTANCE,
        },
      ),
    );
    const newBit = this.segments[newSegmentIndex - 1];
    newBit.setNextPivot(previousBit.getNextPivot());
    newBit.setTail(true);
    newBit.init(this.ctx!);
    this.segments.forEach((s, i) => {
      if (s.sprite === undefined) {
        return;
      }
      s.sprite.polygon.sideLength = this.calcPolygonSize(i, this.length);
    });
  }
  getHeadSegment(): Segment<SpriteImage> | undefined {
    return this.headSegment;
  }
  getSegments(): Segment<SpritePolygon>[] {
    return this.segments;
  }
  getLength(): number {
    return this.length;
  }

  private calcHeadTargetAngle(point: Vec2<number> | undefined): number {
    if (point === undefined) {
      return 0;
    }
    const headPos = this.getHeadPosition();
    const currVector = createVector(this.getDirection(), this.getSpeed());
    const mouseVector = { x: headPos.x - point.x, y: headPos.y - point.y };

    return angleBetween(currVector, mouseVector, 0.001);
  }

  private calcPolygonSize(index: number, length: number) {
    switch (index) {
      case 1:
        return DEFAULT_POLYGON_SIZE - 1;
      case 2:
        return DEFAULT_POLYGON_SIZE - 2;
      case 3:
        return DEFAULT_POLYGON_SIZE - 1;
      case length - 5:
      case length - 4:
      case length - 3:
        return DEFAULT_POLYGON_SIZE - 2;
      case length - 2:
        return DEFAULT_POLYGON_SIZE - 6;
      case length - 1:
        return DEFAULT_POLYGON_SIZE - 7;

      default:
        return DEFAULT_POLYGON_SIZE;
    }
  }

  private renderDebug(ctx: CanvasRenderingContext2D) {
    ctx.font = `20px Verdana`;
    const segmentPos = this.headSegment?.getPosition();
    ctx.strokeStyle = "#000";
    ctx.strokeText(
      "Head {" +
        toPrecisionNumber(segmentPos?.x ?? 0, 7) +
        " : " +
        toPrecisionNumber(segmentPos?.y ?? 0, 7) +
        "}",
      10,
      50,
    );
    ctx.strokeStyle = "#22F";
    // this.segments[1].getPivots().forEach((d) => {
    //     ctx.beginPath();
    //     ctx.strokeStyle = "#000";
    //     ctx.fillStyle = "#F00";
    //     ctx.arc(d.position.x, d.position.y, 8, d.direction, d.direction + Math.PI);
    //     ctx.stroke();
    //     ctx.fill();
    //     ctx.closePath();

    //     ctx.fillText('x:' + toPrecisionNumber(d.position.x, 7) + ' y:' + toPrecisionNumber(d.position.y, 7), d.position.x - 1, d.position.y + 1)
    // })

    if (this.targetPoint) {
      ctx.beginPath();
      ctx.strokeStyle = "#ff9";
      ctx.moveTo(this.getHeadPosition().x, this.getHeadPosition().y);
      ctx.lineTo(this.targetPoint.x, this.targetPoint.y);
      ctx.stroke();
      ctx.closePath();

      // ctx.strokeStyle = "#000";
      // ctx.strokeText('Angle between Head-MousePoint and Head-Direction', 10, 70, 240);
      // ctx.fillStyle = "#F00";
      // ctx.fillText(this.angleToTargetPoint.toString(), 250, 70)
    }

    // Render direction
    const headDistanceDelta: Vec2<number> = createVector(
      this.direction,
      this.getSpeed() + 50,
    );
    ctx.beginPath();
    ctx.strokeStyle = "#a22";
    ctx.moveTo(this.getHeadPosition().x, this.getHeadPosition().y);
    ctx.lineTo(
      this.getHeadPosition().x + headDistanceDelta.x,
      this.getHeadPosition().y + headDistanceDelta.y,
    );
    ctx.stroke();
    ctx.closePath();

    // Render Bounding boxes
    if (this.headSegment !== undefined) {
      const headBBox = this.headSegment?.getBBoxPolygon();
      renderPolygon(headBBox as Polygon, ctx, {
        worldCoordinates: this.headSegment?.getPosition(),
      });
      // if (headBBox !== undefined) printWorldPolygonInfo(headBBox, "head");
    }
    this.segments.forEach((s, i) => {
      const bbox = s.getBBoxPolygon();
      renderPolygon(bbox as Polygon, ctx, {
        worldCoordinates: s.getPosition(),
      });
      // if (s !== undefined) printWorldPolygonInfo(bbox, `segment-${i}`);
    });
  }

  static isSnake(obj: any): obj is Snake {
    return (
      obj && typeof obj.speed === "number" && typeof obj.length === "number"
    );
  }
}
