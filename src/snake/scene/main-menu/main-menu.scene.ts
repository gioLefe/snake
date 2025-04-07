import { CanvasScene2D } from "@octo/models";
import { UILabel } from "@octo/ui/controls";
import { PlayBtn } from "./models/play-btn";
import { UIButton } from "ui/controls/button";

export const MAIN_MENU_SCENE_ID = "main-menu";

export class MainMenuScene implements CanvasScene2D {
  id: string = MAIN_MENU_SCENE_ID;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // UI
  title: UILabel;
  playBtn: UIButton;
  // configureBtn: UIButton;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = canvas;
    
    this.title = new UILabel(
      this.ctx,
      "",
      this.canvas?.width / 2 - 160,
      60,
      { font: "48px Verdana" },
      "I'm a snaaaake",
    );
    this.title.setTextFillStyle("#aFF");
    this.title.setTextStrokeStyle("#32FFaF");

    this.playBtn = new PlayBtn(
      this.ctx,
      "",
      this.canvas?.width / 2 - 50,
      this.canvas?.height / 2,
      { font: "48px Verdana" },
      "PLAY",
    );
    this.playBtn.setTextFillStyle("#204Fa1");
    this.playBtn.setTextStrokeStyle("#00FFad");

    // this.configureBtn = new UIButton(this.ctx,"configure",)
  }

  init(): void {
    this.title?.init();
    this.playBtn?.init(this.canvas);

    // TODO Fix the repositioning of the title
    // const titleMetrics = this.title.getSize();
    // if (titleMetrics) {
    //     console.log(`%c *** `, `background:#222; color: #bada55`)
    //     this.title.setPosition(this.canvas?.width / 2 - (titleMetrics?.width / 2), this.canvas?.height / 2)
    // }
  }
  update(deltaTime: number, ...args: any) {
    this.title?.update(deltaTime);
    this.playBtn?.update(deltaTime);
  }
  render(...args: any) {
    // Apply background color
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // UI elements
    this.title?.render();
    this.playBtn?.render();
  }
  clean(...args: any) {
    this.title?.clean();
    this.playBtn?.clean();
  }
}
