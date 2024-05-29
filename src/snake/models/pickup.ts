import { GameObject, Vec2 } from "@octo/models";

export abstract class Pickup extends GameObject<CanvasRenderingContext2D> {
    protected width: number = 64
    protected height: number = 64
    protected position: Vec2<number> | undefined;

    getWidth(): number {
        return this.width
    }
    setWidth(width: number) {
        this.width = width;
    }
    getHeight(): number {
        return this.height
    }
    setHeight(height: number) {
        this.height = height;
    }

    onPickup(...args: any): any { }
    getPosition(): Vec2<number> | undefined {
        return this.position;
    };
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