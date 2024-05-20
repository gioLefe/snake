import { GameCycle } from "./game-cycle";

export type GameObjectEvent = 'show' | 'hide' | 'destroy' | 'collision' | 'move' | 'stop'

export abstract class GameObject<T> implements GameCycle<T> {
    id?: string;
    ctx!: T | undefined;
    events: Map<GameObjectEvent, (...args: any) => any> | undefined

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