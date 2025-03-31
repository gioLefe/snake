import { Game, Vec2 } from "@octo/models";
import { ClassicGameScene } from "snake/scene/classic-game/classic-game.scene";
import { LoadingScene } from "snake/scene/loading/loading.scene";
import { MAIN_MENU_SCENE_ID, MainMenuScene } from "./scene/main-menu/main-menu.scene";

const cnv: HTMLCanvasElement | null = document.querySelector("canvas");

const CANVAS_SIZE: Vec2<number> = { x: 1024, y: 768 }
const FPS = 60

export class SnakeGame extends Game {
    init(): void {
        if (this.ctx === undefined || this.ctx === null) {
            throw Error('ctx is undefined')
        }
        super.init(this.ctx);

        this.sceneManager?.addScene(new LoadingScene(this.ctx, this.canvas));
        this.sceneManager?.addScene(new ClassicGameScene(this.ctx, this.canvas, { x: this.canvas.width / 2, y: this.canvas.height / 2 }));
        this.sceneManager?.addScene(new MainMenuScene(this.ctx, this.canvas));

        this.sceneManager?.changeScene(MAIN_MENU_SCENE_ID, false);
    }
}

if (cnv === undefined || cnv === null) {
    throw Error('canvas is undefined')
}

const SNAKE_GAME = new SnakeGame(cnv, CANVAS_SIZE.x, CANVAS_SIZE.y, FPS);
SNAKE_GAME.start(); 