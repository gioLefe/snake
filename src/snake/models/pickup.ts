import { GameObject } from "@octo/models";

export abstract class Pickup extends GameObject<CanvasRenderingContext2D> {
    onPickup(...args: any): any { }
}

export abstract class PickupItem extends Pickup {
    id: string = '';

    constructor() {
        super()
    }
    init(ctx: CanvasRenderingContext2D, ...args: any) {
        super.init(ctx, args)
    }
    update(deltaTime: number, ...args: any) {
        super.update(args)
    }
    render(...args: any) {
        super.render(args)
    }
    clean(...args: any) {
        super.clean(args)
    }

    onPickup(...args: any) {
        super.onPickup(args);
    }
}