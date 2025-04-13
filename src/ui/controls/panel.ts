import { FillStrokeStyle } from "@octo/ui/canvas";
import { GameObject } from "models/game-object";
import { Vec2 } from "models/vec";

const MENUNODES_FONT_SIZE = 48
const MENUNODES_GAP = 8;
const MENUNODES_STYLE : CanvasTextDrawingStyles = {
    direction: "inherit",
    font: `${MENUNODES_FONT_SIZE} sans-serif`,
    fontKerning: "auto",
    fontStretch: "normal",
    fontVariantCaps: "normal",
    letterSpacing: "normal",
    textAlign: "start",
    textBaseline: "alphabetic",
    textRendering: "auto",
    wordSpacing: "normal",
};
const MENUNODES_STROKE_COLOR = "#00FFad"
const MENUNODES_FILL_COLOR = "#204Fa1"
const MENUNODES_MOUSE_ENETER_FILL_COLOR = "#a22"

export type TreeItem = {
    id: string,
    text: string,
    nodes?: TreeItem[]
}

export class UIPanel extends GameObject<CanvasRenderingContext2D> {
    private items: GameObject[] = [];
    private allItemsHeight = 0;

    private width: number = 0;
    private height: number = 0;
    private heightGap: number = MENUNODES_GAP;
    pos: Vec2<number> = { x: 0, y: 0 };
    fillStyle: FillStrokeStyle | undefined;
    strokeStyle: FillStrokeStyle | undefined;
    textStyle: CanvasTextDrawingStyles | undefined = MENUNODES_STYLE;

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    init(...args: any): void {
        super.init(args);
    }
    update(deltaTime: number, ...args: any): void {
        super.update(deltaTime, args);
        this.items.forEach((i) => i.update(deltaTime, args));
    }
    clean(...args: any): void {
        super.clean(args)
        this.items.forEach((i) => i.clean(args));
    }

    render(...args: any): void {
        if (this.fillStyle !== undefined) {
            this.ctx.fillStyle = this.fillStyle;
        }
        if (this.strokeStyle !== undefined) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        this.items.forEach((i) => i.render(args));
    }

    addPanelItem(gameObject: GameObject): void {
        if (gameObject === undefined) {
            return;
        }
        this.items.push(gameObject);

        // Reposition items 
        let currentHeightPosition = this.getPosition().y;
        let currentWidthPosition = this.getPosition().y;

        this.items.forEach((go) => {
            go.setPosition({ x: currentWidthPosition, y: currentHeightPosition });
            currentHeightPosition += this.heightGap + (go.getSize()?.y ?? 0)
        })
    }
    getPanelItem(id: string): GameObject | undefined {
        return this.items.find((i) => i.id === id)
    }

    setHeightGap(value: number) {
        this.heightGap = value;
    }
    setWidth(value: number) {
        this.width = value
    }
    setHeight(value: number) {
        this.height = value
    }
    setFillStyle(value: FillStrokeStyle) {
        this.fillStyle = value
    }
    setStrokeStyle(value: FillStrokeStyle) {
        this.strokeStyle = value
    }

    private calcContentHeight() {
        this.items.forEach((i) => {
            this.allItemsHeight += i.getSize()?.y ?? 0
        })
    }
}