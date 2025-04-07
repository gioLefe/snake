import { CanvasScene2D } from "@octo/models";
import { UILabel } from "@octo/ui/controls";
import { RestartBtn } from "./models/restart-btn";

export const GAME_OVER_SCENE_ID = "game-over";

export class GameOverScene implements CanvasScene2D {
  id: string = GAME_OVER_SCENE_ID;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  // UI
  gameOverLabel: UILabel;
  restartBtn: RestartBtn;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.gameOverLabel = new UILabel(
      this.ctx,
      "game-over-label",
      this.canvas?.width / 2 - 100,
      this.canvas.height / 2 - 60,
      { font: "48px Verdana" },
      "GAME OVER",
    );
    this.gameOverLabel.setTextFillStyle("rgba(12, 195, 49, 0.57)");
    this.gameOverLabel.setTextStrokeStyle("rgb(12, 195, 48)");

    this.restartBtn = new RestartBtn(
      this.ctx,
      "restart-button",
      this.canvas?.width / 2 - 50,
      this.canvas?.height / 2,
      { font: "48px Verdana" },
      "Restart",
    );
    this.restartBtn.setTextFillStyle("#204Fa1");
    this.restartBtn.setTextStrokeStyle("#00FFad");
  }

  init(): void {
    this.gameOverLabel?.init();
    this.restartBtn?.init(this.canvas);

  }
  update(deltaTime: number, ...args: any) {
    this.gameOverLabel?.update(deltaTime);
    this.restartBtn?.update(deltaTime);
  }
  render(...args: any) {
    // Apply background color
    this.ctx.fillStyle = "rgba(226, 128, 24, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // UI elements
    this.gameOverLabel?.render();
    this.restartBtn?.render();
  }
  clean(...args: any) {
    this.gameOverLabel?.clean();
    this.restartBtn?.clean();
  }
}
