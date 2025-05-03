import {
  angleBetween,
  calculateNormals,
  checkSATCollision,
  createVector,
  getWorldPolygon,
  toPrecisionNumber,
  WorldPolygon,
} from "@octo/helpers";
import { GameObject, LinkedList, Vec2 } from "@octo/models";
import { DEFAULT_POLYGON_SIZE } from "snake/constants";
import { Pivot, pivotComparator } from "../../models/pivot";
import { Segment } from "./segment";

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

export class Snake extends GameObject<CanvasRenderingContext2D> {
  override id: string;
  protected override direction: number = Math.random() % (Math.PI * 2);
  private readonly BIT_DISTANCE = 20;
  private length: number = 10;
  private segments: Segment[] = [];
  private turboSpeed: number = 500;
  private speed: number = 350;
  private turbonOn: boolean = false;

  private maxSteerAngle = 0.2;
  private targetPoint: Vec2<number> | undefined = undefined;

  private pivots: LinkedList<Pivot> = new LinkedList(pivotComparator);
  private headWorldPolygon: WorldPolygon | undefined;

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
    this.segments[0] = new Segment(
      this.ctx,
      this.direction,
      false,
      this.popPivot,
      args.worldCoordinates,
      {
        sideLength: DEFAULT_POLYGON_SIZE,
        numSides: 10,
        color: HEAD_SEGMENT_COLOR,
        outline: true,
      },
    );

    for (let i = 1; i < (args.length ?? this.length); i++) {
      const previousBit: Segment = this.segments[i - 1];
      const tailDirection: number = this.direction + Math.PI;

      this.segments[i] = new Segment(
        this.ctx,
        this.direction,
        i === this.length - 1,
        this.popPivot,
        {
          x:
            previousBit.getPosition().x +
            Math.cos(tailDirection) * this.BIT_DISTANCE,
          y:
            previousBit.getPosition().y +
            Math.sin(tailDirection) * this.BIT_DISTANCE,
        },
        {
          sideLength: this.calcPolygonSize(i, this.length),
          numSides: 10,
          color: SEGMENT_COLOR,
          outline: true,
        },
      );
      this.segments[i].init();
    }
  }
  override clean(...args: any) {
    console.warn("Method not implemented.");
  }
  override render(...args: any): void {
    super.render(args);
    for (let i = this.segments.length - 1; i >= 0; i--) {
      this.segments[i].render();
    }

    if (DEBUG) {
      this.renderDebug(this.ctx);
    }
  }
  override update(deltaTime: number, ...args: any) {
    super.update(deltaTime, args);
    const speed = this.getSpeed();
    const head = this.segments[0];

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
    const headDistanceDelta: Vec2<number> = createVector(
      this.direction,
      distanceToCover,
    );
    head.setPosition({
      x: head.getPosition().x + headDistanceDelta.x,
      y: head.getPosition().y + headDistanceDelta.y,
    });

    this.headWorldPolygon = getWorldPolygon(
      this.segments[0].polygon,
      this.segments[0].getPosition(),
    );

    for (let i = 1; i < this.length; i++) {
      this.segments[i].update(deltaTime, distanceToCover);
    }
  }

  steer(radiants: number) {
    const headSegment: Segment = this.segments[0];

    // Use % PI*2 to simplify the direction number
    this.direction = (this.direction + radiants) % (Math.PI * 2);
    headSegment.setDirection(this.direction);
    headSegment.rotate(this.direction);

    const sPos = headSegment.getPosition();
    const pivot: Pivot = {
      position: { x: sPos.x, y: sPos.y },
      direction: this.direction,
    };
    const nodePivot = this.pivots.append(pivot);

    headSegment.polygon.normals = calculateNormals(headSegment.polygon.points);
    for (let i = 1; i < this.segments.length; i++) {
      this.segments[i].polygon.normals = calculateNormals(
        this.segments[i].polygon.points,
      );

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

  getHeadPos(): Vec2<number> {
    return this.segments[0].getPosition();
  }
  override getDirection(): number {
    return this.segments[0].getDirection();
  }
  getSpeed(): number {
    return this.turbonOn ? this.turboSpeed : this.speed;
  }
  getHeadSideLength(): number {
    return this.segments[0].getSideLength();
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
      new Segment(
        this.ctx,
        previousBit.getDirection(),
        true,
        this.popPivot,
        {
          x:
            previousBit.getPosition().x +
            Math.cos(tailDirection) * this.BIT_DISTANCE,
          y:
            previousBit.getPosition().y +
            Math.sin(tailDirection) * this.BIT_DISTANCE,
        },
        {
          sideLength: this.calcPolygonSize(
            this.segments.length + 1,
            this.length,
          ),
          numSides: 10,
          color: SEGMENT_COLOR,
          outline: true,
        },
      ),
    );
    const newBit = this.segments[newSegmentIndex - 1];
    newBit.setNextPivot(previousBit.getNextPivot());
    newBit.setTail(true);
    newBit.init(this.ctx!);
    this.segments.forEach(
      (s, i) => (s.polygon.sideLength = this.calcPolygonSize(i, this.length)),
    );
  }
  collidesWithItself(): boolean {
    if (!this.headWorldPolygon) {
      return false;
    }
    // Snake colliding with itself ( giv efor granted is impossible head collides with first 2 polygons)
    for (let i = 3; i < this.length; i++) {
      if (
        checkSATCollision(
          this.headWorldPolygon,
          getWorldPolygon(
            this.segments[i].polygon,
            this.segments[i].getPosition(),
          ),
        )
      ) {
        return true;
      }
    }
    return false;
  }

  private calcHeadTargetAngle(point: Vec2<number> | undefined): number {
    if (point === undefined) {
      return 0;
    }
    const headPos = this.getHeadPos();
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
    const segmentPos = this.segments[1].getPosition();
    ctx.strokeStyle = "#000";
    ctx.strokeText(
      "Head {" +
        toPrecisionNumber(segmentPos.x, 7) +
        " : " +
        toPrecisionNumber(segmentPos.y, 7) +
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
      ctx.strokeStyle = "#a4a";
      ctx.moveTo(this.getHeadPos().x, this.getHeadPos().y);
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
    ctx.moveTo(this.getHeadPos().x, this.getHeadPos().y);
    ctx.lineTo(
      this.getHeadPos().x + headDistanceDelta.x,
      this.getHeadPos().y + headDistanceDelta.y,
    );
    ctx.stroke();
    ctx.closePath();
  }

  static isSnake(obj: any): obj is Snake {
    return (
      obj && typeof obj.speed === "number" && typeof obj.length === "number"
    );
  }
}
