import { toPrecisionNumber } from "@octo/helpers";
import { Polygon } from "@octo/models";
import { createPolygon, drawPolygon, rotatePolygon } from "helpers/polygon";
import { GameObject } from "models/game-object";
import { Vec2 } from "models/vec";

export type SnakeInitParam = Partial<Snake> & {
    position: Vec2<number>,
    initialDirection?: number,
    length?: number
}

export type DirectionChangeEvent = {
    position: Vec2<number>,
    direction: number
}

export type SteerDirection = {
    'Left': 1,
    'Right': 2
}

const DEBUG = false;

class Segment {
    polygon: Polygon = {
        sideLength: 0,
        position: { x: 0, y: 0 },
        numSides: 0,
        points: []
    };
    private direction: number = 0;
    private directionChanges: DirectionChangeEvent[] = [];

    constructor(direction: number, polygonOptions?: Partial<Polygon>) {
        this.direction = direction;
        this.polygon = createPolygon({
            sideLength: polygonOptions?.sideLength,
            numSides: polygonOptions?.numSides,
            color: polygonOptions?.color,
            position: polygonOptions?.position ?? { x: 0, y: 0 }
        })
        this.rotate(this.direction)
    }

    getPosition(): Vec2<number> {
        return this.polygon.position
    }
    setPosition(value: Vec2<number>) {
        this.polygon.position = value
    }

    getDirection(): number {
        return this.direction
    }
    setDirection(value: number): void {
        this.direction = value;
    }

    getDirectionChanges(index?: number): DirectionChangeEvent[] {
        return index ? [this.directionChanges[index]] : this.directionChanges;
    }
    pushDirectionChanges(value: DirectionChangeEvent): void {
        this.directionChanges.push(value);
    }
    popDirectionChanges(): void {
        this.directionChanges = this.directionChanges.length > 1 ? this.directionChanges.slice(1, this.directionChanges.length) : []
    }

    steer(radiants: number) {
        this.direction = (this.direction + radiants) % (Math.PI * 2);
        // TODO: Rotate the polygon
    }
    rotate(radiants: number) {
        this.polygon = rotatePolygon(this.polygon, radiants)
    }
}

export class Snake implements GameObject {
    id: string;
    private readonly BIT_DISTANCE = 8;
    private length: number = 20;
    private direction: number = Math.random() % (Math.PI * 2);
    private segments: Segment[] = []
    private turboSpeed: number = 1.8
    private speed: number = 0.95
    private turbonOn: boolean = false;

    constructor(id: string, options?: SnakeInitParam) {
        if (options?.initialDirection) {
            this.direction = options.initialDirection
        }
        this.id = id;
        this.segments[0] = new Segment(this.direction, {
            sideLength: 18,
            numSides: 10,
            color: "#86a04e",
            position: options?.position ?? { x: 0, y: 0 }
        });

        for (let i = 1; i < (options?.length ?? this.length); i++) {
            this.segments[i] =
                new Segment(this.direction, {
                    sideLength: 18,
                    numSides: 10,
                    color: "#576c1a",
                    position: this.calculateTailFromPreviousBit(this.segments[i - 1], this.direction + Math.PI)
                });
        }
    }

    update(deltaTime: number) {
        const distanceTraveled = this.distanceTraveled();
        const head = this.segments[0];
        const headDistanceDelta: Vec2<number> = this.movePosition(this.direction, distanceTraveled)

        head.getPosition().x = head.getPosition().x + headDistanceDelta.x
        head.getPosition().y = head.getPosition().y + headDistanceDelta.y

        for (let i = 1; i < this.length; i++) {
            const segment = this.segments[i];
            const segmentDirection = segment.getDirection();
            const segmentPosition = segment.getPosition();
            const segmentDirectionChangeEvents = segment.getDirectionChanges();


            if (segmentDirectionChangeEvents.length) {
                const turnPoint = segmentDirectionChangeEvents[0].position;
                const sPosApprox = { x: toPrecisionNumber(segmentPosition.x, 7), y: toPrecisionNumber(segmentPosition.y, 7) }
                const turnApprox = { x: toPrecisionNumber(turnPoint.x, 7), y: toPrecisionNumber(turnPoint.y, 7) }

                if (this.approxHitPoint(sPosApprox, turnApprox)) {
                    segment.setDirection(segmentDirectionChangeEvents[0].direction);
                    segment.rotate(segmentDirectionChangeEvents[0].direction);
                    segment.popDirectionChanges();
                }
            }

            let segmentDistanceDelta = this.movePosition(segmentDirection, distanceTraveled);
            segment.setPosition({
                x: segment.getPosition().x + segmentDistanceDelta.x,
                y: segment.getPosition().y + segmentDistanceDelta.y
            })
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (let i = this.segments.length - 1; i >= 0; i--) {
            drawPolygon(this.segments[i].polygon, ctx)
        }
        if (DEBUG) {
            const segmentPos = this.segments[1].getPosition();
            ctx.strokeStyle = "#000";
            ctx.strokeText('Head {' + toPrecisionNumber(segmentPos.x, 7) + ' : ' + toPrecisionNumber(segmentPos.y, 7) + '}', 10, 50)
            ctx.strokeStyle = "#22F";
            this.segments[1].getDirectionChanges().forEach((d) => {
                ctx.beginPath();
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#F00";
                ctx.arc(d.position.x, d.position.y, 8, d.direction, d.direction + Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();

                ctx.strokeText('x:' + toPrecisionNumber(d.position.x, 7) + ' y:' + toPrecisionNumber(d.position.y, 7), d.position.x - 1, d.position.y + 1)
            })
        }
    }

    steer(radiants: number) {
        // Use % PI*2 to simplify the direction number
        this.direction = (this.direction + radiants) % (Math.PI * 2);
        this.segments[0].setDirection(this.direction);
        this.segments[0].rotate(this.direction);

        const sPos = this.segments[0].getPosition()
        const directionChangeEvent: DirectionChangeEvent = { position: { x: sPos.x, y: sPos.y }, direction: this.direction };
        this.segments.forEach((s) => {
            s.pushDirectionChanges(directionChangeEvent);
        })
    }

    setTurbo(turbo: boolean) {
        this.turbonOn = turbo
    }

    private getSpeed() {
        return this.turbonOn ? this.turboSpeed : this.speed
    }

    private calculateTailFromPreviousBit(previousBit: Segment, tailDirection: number): Vec2<number> {
        return {
            x: previousBit.getPosition().x + this.distanceTraveled() * Math.cos(tailDirection) * this.BIT_DISTANCE,
            y: previousBit.getPosition().y + this.distanceTraveled() * Math.sin(tailDirection) * this.BIT_DISTANCE
        }
    }

    private distanceTraveled() {
        // return this.getSpeed() * this.BIT_DISTANCE
        return this.getSpeed()
    }

    private movePosition(direction: number, distance: number): Vec2<number> {
        return {
            x: Math.cos(direction) * distance,
            y: Math.sin(direction) * distance
        }
    }

    private printPositionLog(position: Vec2<number>): string {
        return `x:${position.x} - y:${position.y}`
    }

    private approxHitPoint(point: Vec2<number>, checkpoint: Vec2<number>): boolean {
        const tolerance = 0.5 + this.getSpeed()
        return point.x < checkpoint.x + tolerance && point.x > checkpoint.x - tolerance &&
            point.y < checkpoint.y + tolerance && point.y > checkpoint.y - tolerance
    }
}