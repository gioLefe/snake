
export type EventType = keyof HTMLElementEventMap

export type TriggerCondition<T extends UIEvent> = (ev: T) => boolean;

export type Callback = {
    eType: EventType;
    ev: Function,
    triggerCondition?<T extends UIEvent>(ev: T): boolean;
}

export type WithEvents = {
    events: Map<string, Callback>;
    abortControllers: AbortController[];
    addCallback<T extends EventType, K extends UIEvent>(eventType: T, id: string, ev: Function, triggerCondition?: TriggerCondition<K>): void
    enableEvent<T extends EventType>(eventType: T): (eventTarget: EventTarget) => void
    removeCallback(id: string): void
    deregisterEvents(): void
}

export function withEvents<T extends new (...args: any[]) => {}>(obj: T) {
    return class extends obj implements WithEvents {
        events = new Map();
        abortControllers: AbortController[] = [];
        addCallback<T extends EventType, K extends UIEvent>(eventType: T, id: string, ev: Function, triggerCondition?: TriggerCondition<K>): void {
            if (this.events?.has(id)) {
                console.warn(`event with id ${id} already exists!`)
                return;
            }
            this.events?.set(id, { eType: eventType, ev, triggerCondition });
        }
        removeCallback(id: string): void {
            if (this.events?.has(id) === false) {
                console.warn(`cannot remove ${id}, event not found!`);
                return;
            }
            this.events?.delete(id)
        }
        deregisterEvents(): void {
            this.abortControllers.forEach((ac) => ac.abort());
        }

        enableEvent<T extends EventType>(eventType: T): (eventTarget: EventTarget) => void {
            return (eventTarget: EventTarget) => {
                if (eventTarget === undefined) {
                    throw new Error('eventTarget is undefined!');
                }
                const controller = this.abortControllers[this.abortControllers.push(new AbortController()) - 1];
                eventTarget.addEventListener(eventType, (ev: Event) => {
                    this.events?.forEach((events) => {
                        if (events.eType !== eventType || events.triggerCondition === undefined || events.triggerCondition(ev) === false) {
                            return;
                        };
                        if (ev === undefined) {
                            console.warn(`empty event cannot be run!`);
                            return;
                        }
                        events.ev(ev);
                    })
                }, { signal: controller.signal })
            }
        }
    }
}
