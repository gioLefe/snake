import { BoundingBox } from "./bbox";
import { GameCycle } from "./game-cycle";

export abstract class GameObject<T> implements GameCycle<T> {
    id?: string;
    ctx!: T | undefined;
    protected bbox: BoundingBox<number> = { nw: { x: 0, y: 0 }, se: { x: 0, y: 0 } };

    init(ctx: T, ...args: any) {
        this.ctx = ctx;
    }
    update(deltaTime: number, ...args: any) {
        if (this.ctx === undefined) {
            throw Error('ctx is undefined')
        }
    }
    render(...args: any) {
        if (this.ctx === undefined) {
            throw Error('ctx is undefined')
        }
    }
    clean(...args: any) {
    }
}