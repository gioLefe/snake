
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

/**
 * A mixin function that adds event handling capabilities to a class.
 *
 * @template T
 * @param {T} obj - The class to extend with event handling capabilities.
 * @returns {T & WithEvents} A new class that extends the original class with event handling capabilities.
 */
export function withEvents<T extends new (...args: any[]) => {}>(obj: T) {
    return class extends obj implements WithEvents {
        /**
         * A map to store event callbacks by their ID.
         * @type {Map<string, { eType: EventType, ev: Function, triggerCondition?: TriggerCondition<UIEvent> }>}
         */
        events = new Map();

        /**
         * A list of AbortController instances to manage event listeners.
         * @type {AbortController[]}
         */
        abortControllers: AbortController[] = [];

        /**
         * Adds a callback for a specific event type and ID.
         *
         * @template T
         * @template K
         * @param {T} eventType - The type of the event.
         * @param {string} id - The ID of the event callback.
         * @param {Function} ev - The callback function for the event.
         * @param {TriggerCondition<K>} [triggerCondition] - An optional condition that must be met for the event to trigger the callback.
         * @returns {void}
         */
        addCallback<T extends EventType, K extends UIEvent>(eventType: T, id: string, ev: Function, triggerCondition?: TriggerCondition<K>): void {
            if (this.events?.has(id)) {
                console.warn(`event with id ${id} already exists!`);
                return;
            }
            this.events?.set(id, { eType: eventType, ev, triggerCondition });
        }

        /**
         * Removes a callback by its ID.
         *
         * @param {string} id - The ID of the event callback to remove.
         * @returns {void}
         */
        removeCallback(id: string): void {
            if (this.events?.has(id) === false) {
                console.warn(`cannot remove ${id}, event not found!`);
                return;
            }
            this.events?.delete(id);
        }

        /**
         * Deregisters all events by aborting their associated AbortControllers.
         *
         * @returns {void}
         */
        deregisterEvents(): void {
            this.abortControllers.forEach((ac) => ac.abort());
        }

        /**
         * Enables an event of a specific type on a given event target.
         *
         * @template T
         * @param {T} eventType - The type of the event to enable.
         * @returns {(eventTarget: EventTarget) => void} A function that takes an event target and adds the event listeners to it.
         */
        enableEvent<T extends EventType>(eventType: T): (eventTarget: EventTarget) => void {
            return (eventTarget: EventTarget) => {
                if (eventTarget === undefined) {
                    throw new Error('eventTarget is undefined!');
                }
                const controller = this.abortControllers[this.abortControllers.push(new AbortController()) - 1];
                eventTarget.addEventListener(eventType, (ev: Event) => {
                    this.events?.forEach((event) => {
                        if (event.eType !== eventType || event.triggerCondition === undefined || event.triggerCondition(ev) === false) {
                            return;
                        }
                        if (ev === undefined) {
                            console.warn(`empty event cannot be run!`);
                            return;
                        }
                        event.ev(ev);
                    });
                }, { signal: controller.signal });
            };
        }
    };
}
