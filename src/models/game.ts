import { SceneHandler, SceneManager, DIContainer } from "@octo/core";
import { GameCycle } from "@octo/models";
import { AssetsHandler, AssetsManager } from "core/assets-manager";
import { AudioController } from "core/audio-controller";

export const SCENE_MANAGER_DI = "SceneManager";
export const ASSETS_MANAGER_DI = "AsetsManager";

export abstract class Game implements GameCycle {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;

  private lastUpdateTime: number = 0;
  private deltaTime: number = 0;
  private frameInterval: number = 0;
  private diContainer = DIContainer.getInstance();

  protected sceneManager: SceneHandler | undefined;
  protected assetsManager: AssetsHandler | undefined;

  private debug: { init: boolean; update: boolean; render: boolean } = {
    init: false,
    update: false,
    render: false,
  };

  constructor(
    canvas: HTMLCanvasElement,
    canvasWidth: number,
    canvasHeight: number,
    fps: number = 30,
  ) {
    if (canvas === null) {
      console.error(
        `%c *** Error, Canvas cannot be null`,
        `background:#222; color: #FFda55`,
      );
      throw Error();
    }
    this.canvas = canvas;
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;

    const context = this.canvas.getContext("2d");
    if (context === null) {
      throw Error("ctx is null");
    }

    this.ctx = context;

    this.lastUpdateTime = 0;
    this.deltaTime = 0;
    this.frameInterval - 1000 / fps;

    this.init(this.ctx);
  }
  clean(...args: any) {
    throw new Error("Method not implemented.");
  }

  init(ctx: CanvasRenderingContext2D): void {
    if (this.debug.init) {
      console.log(`%c *** Init`, `background:#020; color:#adad00`);
    }

    this.sceneManager = new SceneManager();
    this.assetsManager = new AssetsManager();
    this.diContainer.register<SceneHandler>(
      SCENE_MANAGER_DI,
      this.sceneManager,
    );
    this.diContainer.register<AssetsHandler>(
      ASSETS_MANAGER_DI,
      this.assetsManager,
    );
    this.diContainer.register<AudioController>(
      AudioController.AUDIO_CONTROLLER_DI,
      new AudioController(),
    );
  }

  update(deltaTime: number): void {
    if (this.debug.update) {
      console.log(`%c *** Update`, `background:#020; color:#adad00`);
    }

    this.sceneManager
      ?.getCurrentScenes()
      ?.forEach((scene) => scene.update(deltaTime));
  }

  render(...args: any): void {
    if (this.debug.render) {
      console.log(`%c *** Render`, `background:#020; color:#adad00`);
    }
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const currentScenes = this.sceneManager?.getCurrentScenes();
    if (currentScenes === undefined) {
      console.warn("no scene to render");
      return;
    }

    currentScenes.forEach((scene) => scene.render(this.ctx));
  }

  gameLoop(timestamp: number): void {
    const elapsed = timestamp - this.lastUpdateTime;
    if (elapsed > this.frameInterval) {
      this.deltaTime = elapsed / 1000; // Convert to
      this.lastUpdateTime = timestamp;

      this.update(this.deltaTime);
      this.render(this.ctx);
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  start(): void {
    this.lastUpdateTime = performance.now();
    this.gameLoop(this.lastUpdateTime);
  }
}
