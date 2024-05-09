import { createPolygon, createVector, diffVectors, rotatePolygon } from "@octo/helpers";
import { LinkedListNode, Polygon, Vec2 } from "@octo/models";
import { Pivot, Snake } from "./";

export class Segment {
    polygon: Polygon = {
        sideLength: 0,
        position: { x: 0, y: 0 },
        numSides: 0,
        points: []
    };
    private direction: number = 0;
    private nextPivot: LinkedListNode<Pivot> | undefined;
    private snake: Snake;
    private isTail = false;

    constructor(direction: number, isTail = false, snake: Snake, polygonOptions?: Partial<Polygon>) {
        this.snake = snake
        this.isTail = isTail
        this.direction = direction;
        this.polygon = createPolygon({
            sideLength: polygonOptions?.sideLength,
            numSides: polygonOptions?.numSides,
            color: polygonOptions?.color,
            position: polygonOptions?.position ?? { x: 0, y: 0 },
            outline: polygonOptions?.outline
        })
        this.rotate(this.direction)
    }

    update(deltaTime: number, distance: number): void {
        this.moveToNextPosition(distance);
    }

    getPosition(): Vec2<number> {
        return this.polygon.position
    }
    setPosition(value: Vec2<number>): void {
        this.polygon.position = value
    }

    getDirection(): number {
        return this.direction
    }
    setDirection(value: number): void {
        this.direction = value;
    }

    IsTail(): boolean {
        return this.isTail
    }
    setTail(value: boolean): void {
        this.isTail = value;
    }

    popPivot(): Pivot | undefined {
        return this.snake.popPivot()
    }
    setNextPivot(pivot: LinkedListNode<Pivot> | undefined) {
        this.nextPivot = pivot
    }
    getNextPivot(): LinkedListNode<Pivot> | undefined {
        return this.nextPivot
    }

    steer(radiants: number): void {
        this.direction = (this.direction + radiants) % (Math.PI * 2);
    }
    rotate(radiants: number): void {
        this.polygon = rotatePolygon(this.polygon, radiants)
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
            }
            const distanceProjection = createVector(currDirection, distance);
            const difference = diffVectors(distanceProjection, distanceToPivotVec);

            // If difference is longer than distance to pivot, move to pivot and set next pivot
            if (difference > 0) {
                this.setDirection(this.nextPivot.data.direction);
                this.rotate(this.nextPivot.data.direction);
                this.setPosition({
                    x: pivotPosition.x,
                    y: pivotPosition.y
                })
                distance = Math.abs(difference);
                this.setNextPivot(this.nextPivot.next ?? undefined)

                // Tail segment is responsible to pop elements from the pivots list in the snake
                if (this.IsTail()) {
                    this.popPivot();
                }
            } else {
                this.setPosition({
                    x: this.getPosition().x + distanceProjection.x,
                    y: this.getPosition().y + distanceProjection.y
                })
                distance = 0
            }
        }
        if (this.getNextPivot() === undefined && distance > 0) {
            let nextPositionVec = createVector(this.getDirection(), distance);
            this.setPosition({
                x: this.getPosition().x + nextPositionVec.x,
                y: this.getPosition().y + nextPositionVec.y
            })
        }
    }
}