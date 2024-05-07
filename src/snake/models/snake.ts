import { angleBetween, createVector, renderPolygon, toPrecisionNumber } from "@octo/helpers";
import { GameObject, Vec2 } from "@octo/models";
import { Segment } from "./segment";

export type SnakeInitParam = Partial<Snake> & {
    position: Vec2<number>,
    initialDirection?: number,
    length?: number
}

export type Pivot = {
    position: Vec2<number>,
    direction: number
}

export type SteerDirection = {
    'Left': 1,
    'Right': 2
}

const DEBUG = false;

export class Snake implements GameObject {
    id: string;
    private readonly BIT_DISTANCE = 7;
    private length: number = 20;
    private direction: number = Math.random() % (Math.PI * 2);
    private segments: Segment[] = []
    private turboSpeed: number = 4
    private speed: number = 2
    private turbonOn: boolean = false;

    private angleToTargetPoint: number = 0;
    private maxSteerAngle = 0.06
    private targetPoint: Vec2<number> | undefined = undefined;

    constructor(id: string, options?: SnakeInitParam) {
        if (options?.initialDirection) {
            this.direction = options.initialDirection
        }
        this.id = id;
        this.segments[0] = new Segment(this.direction, {
            sideLength: 15,
            numSides: 10,
            color: "#86a04e",
            position: options?.position ?? { x: 0, y: 0 },
            outline: true
        });

        for (let i = 1; i < (options?.length ?? this.length); i++) {
            this.segments[i] =
                new Segment(this.direction, {
                    sideLength: 15,
                    numSides: 10,
                    color: "#576c1a",
                    position: this.calculateTailFromPreviousBit(this.segments[i - 1], this.direction + Math.PI),
                    outline: true
                });
        }
    }

    update(deltaTime: number) {
        const speed = this.getSpeed();
        const head = this.segments[0];

        // Check if there is a target point to steer toards to (i.e: Mouse movement)
        if (this.angleToTargetPoint !== 0) {

            let steerAngle
            if (Math.abs(this.angleToTargetPoint) < this.maxSteerAngle) {
                steerAngle = this.angleToTargetPoint + (this.angleToTargetPoint > 0 ? -1 : 1) * this.maxSteerAngle;
            } else if (Math.abs(this.angleToTargetPoint - Math.PI) < this.maxSteerAngle) {
                steerAngle = Math.abs(this.angleToTargetPoint) + (this.angleToTargetPoint > 0 ? -1 : 1) * (this.maxSteerAngle + Math.PI);
                this.targetPoint = undefined;
                this.angleToTargetPoint = 0;
            } else {
                steerAngle = this.angleToTargetPoint > 0 ? -this.maxSteerAngle : this.maxSteerAngle;
            }

            this.steer(steerAngle);
            if (this.targetPoint) {
                this.calcHeadTargetAngle(this.targetPoint);
            }
        }

        const headDistanceDelta: Vec2<number> = createVector(this.direction, speed)

        head.setPosition({
            x: head.getPosition().x + headDistanceDelta.x,
            y: head.getPosition().y + headDistanceDelta.y
        })

        for (let i = 1; i < this.length; i++) {
            this.segments[i].update(deltaTime, speed)
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (let i = this.segments.length - 1; i >= 0; i--) {
            renderPolygon(this.segments[i].polygon, ctx)
        }
        if (DEBUG) {
            ctx.font = `20px Verdana`
            const segmentPos = this.segments[1].getPosition();
            ctx.strokeStyle = "#000";
            ctx.strokeText('Head {' + toPrecisionNumber(segmentPos.x, 7) + ' : ' + toPrecisionNumber(segmentPos.y, 7) + '}', 10, 50)
            ctx.strokeStyle = "#22F";
            this.segments[1].getPivots().forEach((d) => {
                ctx.beginPath();
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#F00";
                ctx.arc(d.position.x, d.position.y, 8, d.direction, d.direction + Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();

                ctx.fillText('x:' + toPrecisionNumber(d.position.x, 7) + ' y:' + toPrecisionNumber(d.position.y, 7), d.position.x - 1, d.position.y + 1)
            })

            if (this.targetPoint) {
                // Render  line to mouse point
                ctx.beginPath();
                ctx.strokeStyle = "#a4a";
                ctx.moveTo(this.getHeadPos().x, this.getHeadPos().y);
                ctx.lineTo(this.targetPoint.x, this.targetPoint.y);
                ctx.stroke();
                ctx.closePath();

                ctx.strokeStyle = "#000";
                ctx.strokeText('Angle between Head-MousePoint and Head-Direction', 10, 70, 240);
                ctx.fillStyle = "#F00";
                ctx.fillText(this.angleToTargetPoint.toString(), 250, 70)
            }

            // Render direction
            const headDistanceDelta: Vec2<number> = createVector(this.direction, this.getSpeed() + 50)
            ctx.beginPath();
            ctx.strokeStyle = "#a22";
            ctx.moveTo(this.getHeadPos().x, this.getHeadPos().y);
            ctx.lineTo(this.getHeadPos().x + headDistanceDelta.x, this.getHeadPos().y + headDistanceDelta.y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    steer(radiants: number) {
        // Use % PI*2 to simplify the direction number
        this.direction = (this.direction + radiants) % (Math.PI * 2);
        this.segments[0].setDirection(this.direction);
        this.segments[0].rotate(this.direction);

        const sPos = this.segments[0].getPosition()
        const pivot: Pivot = { position: { x: sPos.x, y: sPos.y }, direction: this.direction };
        this.segments.forEach((s) => {
            s.pushPivot(pivot);
        })
    }

    steerTo(point: Vec2<number>): void {
        this.targetPoint = point
        this.calcHeadTargetAngle(point)
    }

    setTurbo(turbo: boolean) {
        this.turbonOn = turbo
    }

    getHeadPos(): Vec2<number> {
        return this.segments[0].getPosition();
    }
    getDirection(): number {
        return this.segments[0].getDirection()
    }

    getSpeed(): number {
        return this.turbonOn ? this.turboSpeed : this.speed
    }

    private calculateTailFromPreviousBit(previousBit: Segment, tailDirection: number): Vec2<number> {
        return {
            x: previousBit.getPosition().x + this.getSpeed() * Math.cos(tailDirection) * this.BIT_DISTANCE,
            y: previousBit.getPosition().y + this.getSpeed() * Math.sin(tailDirection) * this.BIT_DISTANCE
        }
    }

    private calcHeadTargetAngle(point: Vec2<number>) {
        const headPos = this.getHeadPos()
        const currVector = createVector(this.getDirection(), this.getSpeed());
        const mouseVector = { x: headPos.x - point.x, y: headPos.y - point.y };

        this.angleToTargetPoint = angleBetween(currVector, mouseVector, 0.001);
    }

    private printPositionLog(position: Vec2<number>): string {
        return `x:${position.x} - y:${position.y}`
    }
}