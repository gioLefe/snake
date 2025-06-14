import { DIContainer } from "../../../core";
import { AssetsHandler } from "../../../core/models/assets-handler";
import { GameAsset } from "../../../core/models/game-asset";
import { ASSETS_MANAGER_DI, CanvasScene2D, GameObject } from "../../../models";
import { Spinner } from "./models/";

export const LOADING_SCENE_SCENE_ID = "loading";
export const LOADING_IMAGE_ASSETS: GameAsset[] = [
  { id: "spinner", path: "/assets/images/spinner.gif", type: "IMAGE" },
];

export class LoadingScene implements CanvasScene2D {
  id: string = LOADING_SCENE_SCENE_ID;
  canvas: HTMLCanvasElement | undefined;
  ctx: CanvasRenderingContext2D;

  assetsManager =
    DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

  // UI components
  spinner: GameObject;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.spinner = new Spinner(this.ctx);
    this.canvas = canvas;
  }

  async init(..._args: any) {
    return await Promise.all(this.assetsManager.add(LOADING_IMAGE_ASSETS)).then(
      (_results) => {
        // Init all components
        this.spinner.init(this.ctx);
      },
    );
  }
  update(deltaTime: number, ..._args: any) {
    this.spinner.update(deltaTime);
  }
  render(..._args: any) {
    if (this.ctx === undefined) {
      throw new Error("ctx is undefined!");
    }
    if (this.canvas === undefined) {
      throw new Error("ctx is undefined!");
    }

    this.ctx.globalAlpha = 0.2;
    this.ctx.fillStyle = "#FaF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.spinner.render();
  }
  clean(..._args: any) {}
}
