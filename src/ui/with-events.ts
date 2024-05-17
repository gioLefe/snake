import { GameObject } from "@octo/models";

export type EventType = 'click' | 'mousemove' | 'mouseeneter' | 'mouseleave';

export type EventFunc = (x: number, y: number, ...args: any[]) => void

export type Event = {
    eType: EventType;
    event: EventFunc
}

export class GameObjectWithEvents<T> extends GameObject<T> {
    addEvent(eType: EventType, event: EventFunc): void {
        this.events?.push({ eType, event })
    }
    events?: Event[] = [];
}