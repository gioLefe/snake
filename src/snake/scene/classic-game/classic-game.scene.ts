import { AssetsHandler, DIContainer, SceneHandler } from "@octo/core";
import { ASSETS_MANAGER_DI, CanvasScene2D, SoundAsset, MinMax, SCENE_MANAGER_DI, Vec2 } from "@octo/models";
import { withEvents } from "@octo/ui";
import { Cookie, Pickup, Snake } from "../../models";
import {
  CLASSIC_GAME_ASSETS,
  initSnake,
} from "./classic-game-init.scene";
import { createVector, randomIntFromInterval } from "@octo/helpers";
import { GAME_OVER_SCENE_ID } from "../game-over/game-over.scene";

export const CLASSIC_GAME_SCENE_ID = "classic-game";
const CANVAS_BG_COLOR = "#afd7db";
const MOUSE_MOVE_EVENT_ID = "ClassicGameScene-mousemove";
const KEY_DOWN_EVENT_ID = "ClassicGameScene-keydown";
const KEY_UP_EVENT_ID = "ClassicGameScene-keyup";

const FOOD_SIZE = 24;

export class ClassicGameScene
  extends withEvents(class { })
  implements CanvasScene2D {
  id: string = CLASSIC_GAME_SCENE_ID;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  assetsManager =
    DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);
  sceneManager =
    DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);

  playerSnake: Snake | undefined;
  pickups: Pickup[] = [];
  resourcesPromises: Promise<void>[] = [];
  initialWorldCoordinates: Vec2<number> | undefined;

  // Stats
  score = 0;
  gameOver = false;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    initialWorldCoordinates: Vec2<number>,
  ) {
    super();
    this.ctx = ctx;
    this.canvas = canvas;
    this.initialWorldCoordinates = initialWorldCoordinates
  }

  async init(): Promise<any> {
    this.gameOver = false;
    this.score = 0;
    this.pickups = []

    if (this.initialWorldCoordinates === undefined) {
      console.warn('initial world coordinates are not found');
    }
    this.playerSnake = initSnake(this.ctx, {
      worldCoordinates: {
        x: this.initialWorldCoordinates?.x ?? 0,
        y: this.initialWorldCoordinates?.y ?? 0,
      },
      length: 5,
    });

    this.addCallback(
      "mousemove",
      MOUSE_MOVE_EVENT_ID,
      (ev: MouseEvent) => this.mouseMove(ev)(this.playerSnake!),
      () => true,
    );
    this.enableEvent("mousemove")(this.canvas);
    this.addCallback(
      "keydown",
      KEY_DOWN_EVENT_ID,
      (ev: KeyboardEvent) => this.keyDown(ev)(this.playerSnake!),
      () => true,
    );
    this.enableEvent("keydown")(window);
    this.addCallback(
      "keyup",
      KEY_UP_EVENT_ID,
      (ev: KeyboardEvent) => this.keyUp(ev)(this.playerSnake!),
      () => true,
    );
    this.enableEvent("keyup")(window);

    this.resourcesPromises.push(
      ...this.assetsManager.add(CLASSIC_GAME_ASSETS)
    )

    return Promise.allSettled(this.resourcesPromises).then(() => {
      // play start sound
      this.assetsManager.find<SoundAsset>('snake-eat-01')?.source.play()
    })
  }

  update(deltaTime: number): void {
    if (this.gameOver === true || this.playerSnake === undefined) {
      return;
    }

    // Collision detection
    const headSideLength = this.playerSnake.getHeadSize();
    const headDistanceDelta: Vec2<number> = createVector(
      this.playerSnake.getDirection(),
      this.playerSnake.getSpeed(),
    );
    const headPos = this.playerSnake.getHeadPos();
    const snakeNextPos = {
      x: headPos.x + headDistanceDelta.x * deltaTime,
      y: headPos.y + headDistanceDelta.y * deltaTime,
    };

    // TODO: - Snake colliding with itself

    // - Snake colliding with screen borders
    if (headPos.x < 0 || headPos.x > this.canvas.width || headPos.y < 0 || headPos.y > this.canvas.height) {
      this.die()
      return;
    }

    // Spawn cookies
    while (this.pickups.length < 5) {
      const cookie = new Cookie(
        this.ctx,
        "cookie",
        FOOD_SIZE,
        FOOD_SIZE,
        this.calcRandomPosition(
          1024,
          768,
          { min: FOOD_SIZE, max: FOOD_SIZE },
          { min: FOOD_SIZE, max: FOOD_SIZE },
        ),
      );
      this.pickups.push(cookie);
      cookie.init(this.ctx);
    }

    // - Food
    this.pickups.forEach((pickup, i) => {
      const pickupPos = pickup.getPosition();
      if (pickupPos === undefined) {
        return;
      }

      if (
        snakeNextPos.x >= pickupPos.x - headSideLength &&
        snakeNextPos.x <= pickupPos.x + pickup.getWidth() + headSideLength &&
        snakeNextPos.y >= pickupPos.y - headSideLength &&
        snakeNextPos.y <= pickupPos.y + pickup.getHeight() + headSideLength
      ) {
        pickup.onPickup(this.playerSnake);
        this.assetsManager.find<SoundAsset>('snake-eat')?.source.play();
        this.pickups[i].clean();
        this.pickups.splice(i, 1);
        this.score += 1;
      }
    });

    this.playerSnake.update(deltaTime);
  }

  render(): void {
    // Apply background color
    this.ctx.fillStyle = CANVAS_BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render food
    this.pickups.forEach((p) => p.render());

    // TODO: Reender Powerups

    // Player snake
    this.playerSnake?.render(this.ctx);

    // Render UI
    this.ctx.font = `12px Verdana`;
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeText("Score: " + this.score, 10, 20);
  }

  clean(...args: any) {
    this.removeCallback(KEY_DOWN_EVENT_ID)
    this.removeCallback(KEY_UP_EVENT_ID)
    this.removeCallback(MOUSE_MOVE_EVENT_ID)
    this.abortControllers.forEach((ac) => ac.abort());
  }

  async restart() {
    console.log('restarting classic game scene')
    this.clean()
    await this.init();
  }

  private mouseMove = (ev: MouseEvent) => {
    return (snake: Snake) => {
      snake.steerTo({ x: ev.offsetX, y: ev.offsetY });
    };
  };

  private keyDown = (ev: KeyboardEvent) => {
    return (snake: Snake) => {
      switch (ev.key) {
        case "a":
          snake.steer(-0.25); // TODO: send SteerDirection
          break;
        case "d":
          snake.steer(+0.25); // TODO: send SteerDirection
          break;
        case " ":
          snake.setTurbo(true);
          break;
      }
    };
  };

  private keyUp = (ev: KeyboardEvent) => {
    return (snake: Snake) => {
      switch (ev.key) {
        case " ":
          snake.setTurbo(false);
          break;
      }
    };
  };

  private calcRandomPosition(
    containerW: number,
    containerH: number,
    minMaxW: MinMax,
    minMaxH: MinMax,
  ): Vec2<number> {
    return {
      x: randomIntFromInterval(
        minMaxW.min / 2,
        Math.random() * (containerW - minMaxW.max / 2),
      ),
      y: randomIntFromInterval(
        minMaxH.min / 2,
        Math.random() * (containerH - minMaxH.max / 2),
      ),
    };
  }

  private die() {
    this.assetsManager.find<SoundAsset>('snake-death')?.source.play()
    this.gameOver = true;
    this.sceneManager.changeScene(GAME_OVER_SCENE_ID, false);
  }
}
