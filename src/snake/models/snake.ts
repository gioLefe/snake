import { createVector as createVec, drawPolygon, toPrecisionNumber } from "@octo/helpers";
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

    constructor(id: string, options?: SnakeInitParam) {
        if (options?.initialDirection) {
            this.direction = options.initialDirection
        }
        this.id = id;
        this.segments[0] = new Segment(this.direction, {
            sideLength: 18,
            numSides: 10,
            color: "#86a04e",
            position: options?.position ?? { x: 0, y: 0 },
            outline: true
        });

        for (let i = 1; i < (options?.length ?? this.length); i++) {
            this.segments[i] =
                new Segment(this.direction, {
                    sideLength: 18,
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
        const headDistanceDelta: Vec2<number> = createVec(this.direction, speed)

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
            drawPolygon(this.segments[i].polygon, ctx)
        }
        if (DEBUG) {
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
        const pivot: Pivot = { position: { x: sPos.x, y: sPos.y }, direction: this.direction };
        this.segments.forEach((s) => {
            s.pushPivot(pivot);
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
            x: previousBit.getPosition().x + this.getSpeed() * Math.cos(tailDirection) * this.BIT_DISTANCE,
            y: previousBit.getPosition().y + this.getSpeed() * Math.sin(tailDirection) * this.BIT_DISTANCE
        }
    }

    private printPositionLog(position: Vec2<number>): string {
        return `x:${position.x} - y:${position.y}`
    }
}