import { CanvasScene2D } from "../../../models";
import { UIClickableLabel, UILabel, UIPanel } from "../../../ui/controls";
import { PlayBtn } from "./models/play-btn";

export const MAIN_MENU_SCENE_ID = "main-menu";

export class MainMenuScene implements CanvasScene2D {
  readonly id: string = MAIN_MENU_SCENE_ID;
  readonly ITEMS_GAP = 8;
  readonly ITEMS_STYLE = { font: "48px Verdana" };
  readonly ITEMS_STROKE_COLOR = "#00FFad";
  readonly ITEMS_FILL_COLOR = "#204Fa1";
  readonly ITEMS_MOUSE_ENETER_FILL_COLOR = "#a22";

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // UI
  title: UILabel;
  playBtn: UIClickableLabel;
  configureBtn: UIClickableLabel;
  panel: UIPanel | undefined;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = canvas;

    const canvasMiddleWidth = this.canvas?.width / 2;

    this.title = new UILabel(
      this.ctx,
      "",
      canvasMiddleWidth - 160,
      60,
      this.ITEMS_STYLE,
      "I'm a snaaaake",
    );
    this.title.setTextFillStyle("#aFF");
    this.title.setTextStrokeStyle("#32FFaF");

    this.playBtn = new PlayBtn(
      this.ctx,
      "",
      undefined,
      undefined,
      this.ITEMS_STYLE,
      "PLAY",
    );
    this.playBtn.addMouseEnterCallback(() => {
      this.playBtn.setTextFillStyle(this.ITEMS_MOUSE_ENETER_FILL_COLOR);
    });
    this.playBtn.addMouseLeaveCallback(() => {
      this.playBtn.setTextFillStyle(this.ITEMS_FILL_COLOR);
    });
    this.playBtn.setTextFillStyle(this.ITEMS_STROKE_COLOR);
    this.playBtn.setTextStrokeStyle(this.ITEMS_FILL_COLOR);

    this.configureBtn = new UIClickableLabel(
      this.ctx,
      "configure",
      undefined,
      undefined,
      this.ITEMS_STYLE,
      "OPTIONS",
    );
    this.configureBtn.setTextFillStyle(this.ITEMS_STROKE_COLOR);
    this.configureBtn.setTextStrokeStyle(this.ITEMS_FILL_COLOR);
  }

  init(): void {
    this.title?.init();
    this.playBtn?.init(this.canvas);
    this.configureBtn?.init(this.canvas);

    const canvasMiddleWidth = this.canvas?.width / 2;

    this.panel = new UIPanel(this.ctx);
    this.panel.setPosition({ x: canvasMiddleWidth - 50, y: 0 + 200 });

    this.panel.addPanelItem(this.playBtn);
    this.panel.addPanelItem(this.configureBtn);

    // TODO Fix the repositioning of the title
    // const titleMetrics = this.title.getSize();
    // if (titleMetrics) {
    //     console.log(`%c *** `, `background:#222; color: #bada55`)
    //     this.title.setPosition(this.canvas?.width / 2 - (titleMetrics?.width / 2), this.canvas?.height / 2)
    // }
  }
  update(deltaTime: number) {
    this.title?.update(deltaTime);
    this.playBtn?.update(deltaTime);
    this.configureBtn?.update(deltaTime);
  }
  render() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // UI elements
    this.title?.render();
    this.panel?.render();
  }
  clean() {
    this.title?.clean();
    this.playBtn?.clean();
    this.configureBtn?.clean();
  }
}
