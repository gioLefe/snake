import { BoundingBox, GameObject, Vec2 } from "@octo/models";

export type MouseEventType = 'click' | 'mousemove';

export type Callback = (...args: any) => void

export type TriggerCondition = (ev: MouseEvent) => boolean

export type MouseCallbacks = {
    eType: MouseEventType;
    ev: Callback,
    triggerCondition: TriggerCondition
}

export class GameObjectWithEvents<T> extends GameObject<T> {
    private abortControllers: AbortController[] = [];
    private mouseEvents?: Map<string, MouseCallbacks> = new Map();
    canvas: HTMLCanvasElement | undefined

    /**
     * args[0] : CanvasScene2d
     */
    init(ctx: T, ...args: any[]): void {
        super.init(ctx, args);
        this.canvas = args[0];
    }

    enableMouseEvent(mouseEventType: MouseEventType) {
        if (this.canvas === undefined) {
            throw new Error('canvas is undefined!');
        }

        const controller = this.abortControllers[this.abortControllers.push(new AbortController()) - 1];
        this.canvas.addEventListener<MouseEventType>(mouseEventType, (ev: MouseEvent) => {
            this.mouseEvents?.forEach((e) => {
                if (e.eType !== mouseEventType || !e.triggerCondition(ev)) {
                    return;
                };
                if (ev === undefined) {
                    console.warn(`empty mouse event cannot be run!`);
                    return;
                }
                e.ev(ev.x, ev.y);
            })
        }, { signal: controller.signal })
    };
    addMouseCallback(eType: MouseEventType, id: string, ev: Callback, triggerCondition: TriggerCondition): void {
        if (this.mouseEvents?.has(id)) {
            console.warn(`Mouse event with id ${id} already exists!`)
            return;
        }
        this.mouseEvents?.set(id, { eType, ev, triggerCondition });
    }
    removeMouseCallback(id: string) {
        if (this.mouseEvents?.has(id) === false) {
            console.warn(`cannot remove, mouse event with id ${id} not found!`);
            return;
        }
        this.mouseEvents?.delete(id)
    }
    clean(...args: any): void {
        this.abortControllers.forEach((ac) => ac.abort());
    }
}