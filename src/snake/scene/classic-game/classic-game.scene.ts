import {
  AssetsHandler,
  AudioController,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DIContainer,
  SceneHandler,
  Settings,
} from "@octo/core";
import {
  checkSATCollision,
  createVector,
  randomIntFromInterval,
} from "@octo/helpers";
import {
  ASSETS_MANAGER_DI,
  CanvasScene2D,
  MinMax,
  SCENE_MANAGER_DI,
  Vec2,
} from "@octo/models";
import { withEvents } from "@octo/ui";
import { Cookie, Pickup, Snake } from "../../models";
import { GAME_OVER_SCENE_ID } from "../game-over/game-over.scene";
import { CLASSIC_GAME_ASSETS, initSnake } from "./classic-game-init.scene";
import { VolumneBtn } from "./volumeBtn";

export const CLASSIC_GAME_SCENE_ID = "classic-game";
const CANVAS_BG_COLOR = "#afd7db";
const MOUSE_MOVE_EVENT_ID = "ClassicGameScene-mousemove";
const KEY_DOWN_EVENT_ID = "ClassicGameScene-keydown";
const KEY_UP_EVENT_ID = "ClassicGameScene-keyup";

const FOOD_SIZE = 64;

export class ClassicGameScene
  extends withEvents(class {})
  implements CanvasScene2D
{
  id: string = CLASSIC_GAME_SCENE_ID;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  assetsManager =
    DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);
  sceneManager =
    DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);
  audioController = DIContainer.getInstance().resolve<AudioController>(
    AudioController.AUDIO_CONTROLLER_DI,
  );
  settingsManager = DIContainer.getInstance().resolve<Settings>(
    Settings.SETTINGS_DI,
  );

  volumeBtn: VolumneBtn | undefined;
  playerSnake: Snake | undefined;
  pickups: Pickup[] = [];
  initialWorldCoordinates: Vec2<number> | undefined;
  sceneReady: boolean = false;

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
    this.initialWorldCoordinates = initialWorldCoordinates;
  }

  async init(): Promise<any> {
    this.gameOver = false;
    this.score = 0;
    this.pickups = [];

    if (this.initialWorldCoordinates === undefined) {
      console.warn("initial world coordinates are not found");
    }

    this.addCallback(
      "mousemove",
      MOUSE_MOVE_EVENT_ID,
      (ev: MouseEvent) => this.mouseMove(ev)(this.playerSnake!),
      false,
      () => true,
    );
    this.enableEvent("mousemove")(this.canvas);
    this.addCallback(
      "keydown",
      KEY_DOWN_EVENT_ID,
      (ev: KeyboardEvent) => this.keyDown(ev)(this.playerSnake!),
      false,
      () => true,
    );
    this.enableEvent("keydown")(window);
    this.addCallback(
      "keyup",
      KEY_UP_EVENT_ID,
      (ev: KeyboardEvent) => this.keyUp(ev)(this.playerSnake!),
      false,
      () => true,
    );
    this.enableEvent("keyup")(window);

    return Promise.allSettled(this.assetsManager.add(CLASSIC_GAME_ASSETS)).then(
      () => {
        this.audioController.playAsset("snake-start", {
          force: true,
          loop: false,
        });
        this.audioController.playAsset("background-music", {
          force: false,
          loop: true,
        });

        this.playerSnake = initSnake(this.ctx, {
          worldCoordinates: {
            x: this.initialWorldCoordinates?.x ?? 0,
            y: this.initialWorldCoordinates?.y ?? 0,
          },
          length: 5,
        });

        this.volumeBtn = new VolumneBtn(
          this.ctx,
          "speaker-up",
          "speaker-mute",
          32,
          32,
          10,
          40,
        );
        this.volumeBtn.init(this.canvas);
        this.sceneReady = true;
      },
    );
  }

  update(deltaTime: number): void {
    if (
      this.gameOver === true ||
      this.playerSnake === undefined ||
      this.sceneReady === false
    ) {
      return;
    }

    // Collision detection
    const headSideLength = this.playerSnake.getHeadSideLength();
    const headDistanceDelta: Vec2<number> = createVector(
      this.playerSnake.getDirection(),
      this.playerSnake.getSpeed(),
    );
    const headPosition = this.playerSnake.getHeadPosition();

    const snakeNextPos = {
      x: headPosition.x + headDistanceDelta.x * deltaTime,
      y: headPosition.y + headDistanceDelta.y * deltaTime,
    };

    // - Snake colliding with itself
    if (this.collidesWithItself()) {
      this.playerLose();
    }

    // - Snake colliding with screen borders
    if (
      headPosition.x < 0 ||
      headPosition.x > this.canvas.width ||
      headPosition.y < 0 ||
      headPosition.y > this.canvas.height
    ) {
      this.playerLose();
      return;
    }

    // Spawn cookies
    while (this.pickups.length < 5) {
      const w = this.settingsManager.get<number>(CANVAS_WIDTH);
      const h = this.settingsManager.get<number>(CANVAS_HEIGHT);
      const cookie = new Cookie(
        this.ctx,
        "cookie",
        FOOD_SIZE + 12,
        FOOD_SIZE,
        this.calcRandomPosition(
          w ?? 1024,
          h ?? 768,
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
        this.audioController.playAsset("snake-eat", {
          force: true,
          loop: false,
        });

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
    this.volumeBtn?.render();
    this.ctx.font = `18px Verdana`;
    this.ctx.strokeStyle = "#000";
    this.ctx.strokeText("Score: " + this.score, 10, 20);
  }

  clean(...args: any) {
    this.sceneReady = false;
    this.removeCallback(KEY_DOWN_EVENT_ID);
    this.removeCallback(KEY_UP_EVENT_ID);
    this.removeCallback(MOUSE_MOVE_EVENT_ID);
    this.abortControllers.forEach((ac) => ac.abort());
  }

  async restart(): Promise<void> {
    console.log("restarting classic game scene");
    this.clean();
    return await this.init();
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

  private collidesWithItself(): boolean {
    const headSegment = this.playerSnake?.getHeadSegment();
    if (headSegment === undefined) {
      console.error("Snake has no head segment");
      return false;
    }
    const length = this.playerSnake?.getLength();
    if (length === undefined) {
      throw new Error("Snake has no length");
    }
    const segments = this.playerSnake?.getSegments();
    if (segments === undefined) {
      throw new Error("Snake has no segments");
    }
    // Snake colliding with itself ( give for granted is impossible head collides with the first 3 polygons)
    for (let i = 4; i < length; i++) {
      if (
        checkSATCollision(
          headSegment.getBBoxPolygon(),
          segments[i].getBBoxPolygon(),
        )
      ) {
        return true;
      }
    }
    return false;
  }

  private playerLose() {
    this.audioController.playAsset("snake-death", {
      force: false,
      loop: false,
    });
    this.gameOver = true;
    // TODO Disable current scene events before changing to game_over

    this.sceneManager.changeScene(GAME_OVER_SCENE_ID, false);
  }
}
