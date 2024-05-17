import { isPointInAlignedBBox } from "@octo/helpers";
import { CanvasScene2D, Vec2 } from "@octo/models";
import { UILabel } from "@octo/ui/controls";
import { playLblClick } from "./main-menu-inputs";

export const MAIN_MENU_SCENE_ID = 'main-menu';

export class MainMenu implements CanvasScene2D {
    id: string = MAIN_MENU_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;

    // UI
    title: UILabel | undefined
    play: UILabel | undefined

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.title = new UILabel('', this.canvas?.width / 2 - 100, 60, { font: "48px Verdana" }, 'SeRPeNT');
        this.title.setFillStyle("#FFF");
        this.title.setStrokeStyle("#32FFaF");

        this.play = new UILabel('', this.canvas?.width / 2 - 50, this.canvas?.height / 2, { font: '48px Verdana' }, 'PLAY');
        this.play.setFillStyle("#204Fa1");
        this.play.setStrokeStyle("#00FFad");
    }

    init(ctx: CanvasRenderingContext2D): void {
        this.title?.init(ctx);
        this.play?.init(ctx);

        this.play?.addEvent("click", playLblClick);

        this.canvas?.addEventListener("click", (ev) => {
            const point: Vec2<number> = { x: ev.x, y: ev.y };
            const bbox = this.play?.getBBox()
            if (bbox && isPointInAlignedBBox(point, bbox)) {
                this.play?.events?.filter((e) => e.eType === "click").forEach((e) => {
                    e.event(point.x, point.y);
                })
            }
        })

        // TODO Fix the repositioning of the title
        // const titleMetrics = this.title.getSize();
        // if (titleMetrics) {
        //     console.log(`%c *** `, `background:#222; color: #bada55`)
        //     this.title.setPosition(this.canvas?.width / 2 - (titleMetrics?.width / 2), this.canvas?.height / 2)
        // }
    }
    update(deltaTime: number, ...args: any) {
        this.title?.update(deltaTime)
        this.play?.update(deltaTime)
    }
    render(...args: any) {
        if (this.canvas === undefined || this.canvas === null) {
            throw Error('canvas is undefined')
        }
        if (!this.ctx) {
            throw Error('ctx (CanvasRenderingContext2D) is not defined')
        }

        // Apply background color
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // UI elements
        this.title?.render();
        this.play?.render();
    }
    clean(...args: any) {
        console.warn("Method not implemented.");
    }
}