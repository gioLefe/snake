import { GameObject, Vec2 } from "@octo/models";

export class UIButton extends GameObject<CanvasRenderingContext2D> {
    id: string | undefined;
    text: string | undefined;
    size: TextMetrics | undefined

    constructor(id: string, text?: string) {
        super()
        this.id = id;
        this.text = text;
    }

    init(ctx: CanvasRenderingContext2D, ...args: any) {
        super.init(ctx, args);
    }
    update(deltaTime: number, ...args: any) {
        super.update(deltaTime, args);
        if (this.text !== undefined) {
            this.size = this.ctx?.measureText(this.text);
        }
    }
    render(...args: any) {
        super.render(args)
        if (this.ctx === undefined) {
            throw Error('ctx is not defined')
        }
        this.ctx.measureText
        this.ctx.beginPath()
    }
    clean(...args: any) {
        super.clean(args);
        throw new Error("Method not implemented.");
    }

    setText(text: string) {
        this.text = text;
    }

}