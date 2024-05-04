import { createPolygon, createVector, diffVectors, rotatePolygon } from "@octo/helpers";
import { Polygon, Vec2 } from "@octo/models";
import { Pivot } from "snake/models/snake";

export class Segment {
    polygon: Polygon = {
        sideLength: 0,
        position: { x: 0, y: 0 },
        numSides: 0,
        points: []
    };
    private direction: number = 0;
    private pivots: Pivot[] = [];

    constructor(direction: number, polygonOptions?: Partial<Polygon>) {
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
    setPosition(value: Vec2<number>) {
        this.polygon.position = value
    }

    getDirection(): number {
        return this.direction
    }
    setDirection(value: number): void {
        this.direction = value;
    }

    getPivots(index?: number): Pivot[] {
        return index ? [this.pivots[index]] : this.pivots;
    }
    pushPivot(value: Pivot): void {
        this.pivots.push(value);
    }
    popPivot(): Pivot | undefined {
        if (this.pivots.length) {
            const pivot = this.pivots[0];
            this.pivots = this.pivots.slice(1, this.pivots.length);
            return pivot
        }
        return undefined
    }

    steer(radiants: number) {
        this.direction = (this.direction + radiants) % (Math.PI * 2);
        // TODO: Rotate the polygon
    }
    rotate(radiants: number) {
        this.polygon = rotatePolygon(this.polygon, radiants)
    }

    private moveToNextPosition(distance: number) {
        while (distance > 0) {
            const pivot = this.getPivots()[0];
            if (pivot === undefined) { break; }

            let currDirection = this.getDirection();
            let currPosition = this.getPosition();
            const pivotPosition = pivot.position;

            const distanceToPivotVec: Vec2<number> = {
                x: currPosition.x - pivotPosition.x,
                y: currPosition.y - pivotPosition.y,
            }

            const distanceProjection = createVector(currDirection, distance);

            // Calculate difference between vectors and react to it. If fullDistanceProjection is longer than distance to pivot, move to pivot
            const difference = diffVectors(distanceProjection, distanceToPivotVec);
            if (difference > 0) {
                this.setDirection(pivot.direction);
                this.rotate(pivot.direction);
                this.setPosition({
                    x: pivotPosition.x,
                    y: pivotPosition.y
                })
                distance = Math.abs(difference);
                this.popPivot()
            } else {
                this.setPosition({
                    x: this.getPosition().x + distanceProjection.x,
                    y: this.getPosition().y + distanceProjection.y
                })
                distance = 0
            }
        }
        if (this.getPivots().length === 0 && distance > 0) {
            let nextPositionVec = createVector(this.getDirection(), distance);
            this.setPosition({
                x: this.getPosition().x + nextPositionVec.x,
                y: this.getPosition().y + nextPositionVec.y
            })
        }
    }
}