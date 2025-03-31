import { BoundingBox, GameObject, Vec2 } from "@octo/models";
import { FillStrokeStyle, getTextBBox } from "@octo/ui/canvas";

export class UILabel extends GameObject<CanvasRenderingContext2D> {
    id: string | undefined;
    private position: Vec2<number> | undefined;
    private text: string | undefined;

    private textMetric: TextMetrics | undefined
    private textStyle: CanvasTextDrawingStyles = this.defaultTextStyle();
    private fill: boolean = true;
    private outline: boolean = true;
    private fillStyle: FillStrokeStyle = "#000";
    private strokeStyle: FillStrokeStyle = "#000"

    constructor(ctx: CanvasRenderingContext2D, id: string, posX: number, posY: number, textStyle?: Partial<CanvasTextDrawingStyles>, text?: string) {
        super(ctx);
        this.id = id;
        this.position = { x: posX, y: posY }
        if (textStyle !== undefined) {
            this.textStyle = { ...this.textStyle, ...textStyle }
        }
        this.text = text
    }

    init(ctx: CanvasRenderingContext2D, ...args: any) {
        super.init(ctx, ...args);
    }
    update(deltaTime: number, ...args: any) {
        super.update(deltaTime, args);
    }
    render(...args: any) {
        super.render(args)
        if (this.ctx === undefined) {
            throw Error('ctx is not defined');
        }
        if (this.position === undefined || this.text === undefined) {
            return;
        }

        //TODO add direction
        this.ctx.font = this.textStyle?.font ?? "20px Verdana";
        //TODO addfontKerning
        //TODO addfontStretch
        //TODO addfontVariantCaps
        //TODO addletterSpacing
        this.ctx.textAlign = this.textStyle?.textAlign ?? "left"
        this.ctx.textBaseline = this.textStyle?.textBaseline ?? 'alphabetic';
        //TODO add textRendering
        //TODO add wordSpacing

        this.ctx.moveTo(this.position?.x, this.position.y);
        if (this.outline) {
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.strokeText(this.text, this.position.x, this.position.y);
        }
        if (this.fill) {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillText(this.text, this.position.x, this.position.y);
        }

        this.bbox = getTextBBox(this.ctx, this.text, this.position);
    }
    clean(...args: any) {
        super.clean(args);
    }

    setText(text: string) {
        this.text = text;
    }
    setPosition(x: number, y: number) {
        this.position = { x, y }
    }
    getPosition(): Vec2<number> | undefined {
        return this.position;
    }
    getSize(): TextMetrics | undefined {
        return this.textMetric
    }
    getBBox(): BoundingBox<number> {
        return this.bbox
    }

    setFillStyle(style: FillStrokeStyle) {
        this.fillStyle = style
    }
    setStrokeStyle(style: FillStrokeStyle) {
        this.strokeStyle = style
    }
    setFont(font: string) {
        this.textStyle.font = font
    }
    setTextAlign(align: CanvasTextAlign) {
        this.textStyle.textAlign = align
    }
    setTextBaseline(baseline: CanvasTextBaseline) {
        this.textStyle.textBaseline = baseline
    }

    private defaultTextStyle(): CanvasTextDrawingStyles {
        return {
            direction: "inherit",
            font: "10px sans-serif",
            fontKerning: "auto",
            fontStretch: "normal",
            fontVariantCaps: "normal",
            letterSpacing: "normal",
            textAlign: "start",
            textBaseline: "alphabetic",
            textRendering: "auto",
            wordSpacing: "normal"
        };
    }
} 