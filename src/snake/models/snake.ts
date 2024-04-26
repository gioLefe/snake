import { Polygon } from "@octo/models";
import { createPolygon, drawPolygon } from "helpers/polygon";
import { GameObject } from "models/game-object";
import { Vec2 } from "models/vec";

export type SnakeInitParam = Partial<Snake> & {
    position: Vec2<number>
}

export class Snake implements GameObject {
    id: string;
    length: number = 4;
    direction: number = (Math.PI * 2) * Math.random();
    tailDirection = this.direction + Math.PI

    polygons: (Polygon | undefined)[] = []
    speed: number = 0.1
    polygonsDistance = 8;

    constructor(id: string, options?: SnakeInitParam) {
        this.id = id;

        this.polygons[0] = createPolygon(10, 10, "#FFFFa1", { position: options?.position ?? { x: 0, y: 0 } });

        for (let i = 1; i < this.length; i++) {
            this.polygons[i] = createPolygon(10, 5, "#0FFFa1",
                {
                    position: this.calculateTailFromPreviousBit(i === 1 ? this.polygons[0]! : this.polygons[i - 1]!, this.tailDirection)
                });
            console.log(`%c *** create bit number ${i}`, `background:#222; color: #bada55`, this.polygons[i]!.position)
        }
    }

    update(deltaTime: number) {
        const headPolygon = this.polygons[0];
        if (headPolygon === undefined) {
            console.error('Snake has no head :) ');
            return;
        }
        const previousHeadPositions: Vec2<number>[] = Object.assign(this.polygons.map((p) => p?.position!), {});

        headPolygon.position.x = headPolygon.position.x + this.speed * Math.cos(this.direction)
        headPolygon.position.y = headPolygon.position.y + this.speed * Math.sin(this.direction)
        for (let i = 1; i < this.length; i++) {
            // this.polygons[i]!.position.x = i === 1 ? previousHeadPosition.x : this.polygons[i - 1]!.position.x
            // this.polygons[i]!.position.y = i === 1 ? previousHeadPosition.y : this.polygons[i - 1]!.position.y
            this.polygons[i]!.position = i === 1 ? previousHeadPositions[0] : this.calculateTailFromPreviousBit(this.polygons[i - 1]!, this.tailDirection)
            // this.polygons[i]!.position = previousHeadPositions[i]
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        drawPolygon(this.polygons[0]!, ctx)
        for (let i = 1; i < this.polygons.length; i++) {
            drawPolygon(this.polygons[i]!, ctx)
        }
    }

    updateDirection(newValue: number) {
        this.direction = newValue;
        this.tailDirection = newValue + Math.PI
    }

    private calculateTailFromPreviousBit(previousBit: Polygon, tailDirection: number): Vec2<number> {
        return {
            x: previousBit.position.x + this.polygonsDistance * Math.cos(tailDirection),
            y: previousBit.position.y + this.polygonsDistance * Math.sin(tailDirection)
        }
    }
}