import { GameObject, Vec2 } from "@octo/models";

export class UIButton extends GameObject<CanvasRenderingContext2D> {
    id: string | undefined;
    text: string | undefined;
    size: TextMetrics | undefined
    position: Vec2<number> | undefined;
    textStyle: CanvasTextDrawingStyles | undefined;

    constructor(id: string, x: number, y: number, textStyle: CanvasTextDrawingStyles, text?: string) {
        super()
        this.id = id;
        this.text = text;
        this.position = { x, y }
        this.textStyle = textStyle
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
            throw Error('ctx is not defined');
        }
        if (this.position === undefined) {
            return;
        }

        this.ctx.beginPath()
        this.ctx.moveTo(this.position?.x, this.position.y);

        this.ctx.closePath()
    }
    clean(...args: any) {
        super.clean(args);
        throw new Error("Method not implemented.");
    }

    setText(text: string) {
        this.text = text;
    }
    setPosition(x: number, y: number) {
        this.position = { x, y }
    }

}