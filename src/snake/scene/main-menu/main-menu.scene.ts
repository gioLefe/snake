import { CanvasScene2D } from "@octo/models";
import { UILabel } from "@octo/ui/controls";
import { PlayBtn } from "./models/play-btn";

export const MAIN_MENU_SCENE_ID = 'main-menu';

export class MainMenuScene implements CanvasScene2D {
    id: string = MAIN_MENU_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;

    // UI
    title: UILabel | undefined
    playBtn: UILabel | undefined
    allImagesPromises: Promise<void>[] = [];

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.title = new UILabel('', this.canvas?.width / 2 - 100, 60, { font: "48px Verdana" }, 'SeRPeNT');
        this.title.setFillStyle("#aFF");
        this.title.setStrokeStyle("#32FFaF");

        this.playBtn = new PlayBtn('', this.canvas?.width / 2 - 50, this.canvas?.height / 2, { font: '48px Verdana' }, 'PLAY');
        this.playBtn.setFillStyle("#204Fa1");
        this.playBtn.setStrokeStyle("#00FFad");
    }

    init(ctx: CanvasRenderingContext2D): void {
        this.title?.init(ctx);
        this.playBtn?.init(ctx, this.canvas);

        // TODO Fix the repositioning of the title
        // const titleMetrics = this.title.getSize();
        // if (titleMetrics) {
        //     console.log(`%c *** `, `background:#222; color: #bada55`)
        //     this.title.setPosition(this.canvas?.width / 2 - (titleMetrics?.width / 2), this.canvas?.height / 2)
        // }
    }
    update(deltaTime: number, ...args: any) {
        this.title?.update(deltaTime)
        this.playBtn?.update(deltaTime)
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
        this.playBtn?.render();
    }
    clean(...args: any) {
        this.title?.clean()
        this.playBtn?.clean()
    }
}