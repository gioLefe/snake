import { Game, Vec2 } from "@octo/models";
import { ClassicGameScene } from "snake/scene/classic-game/classic-game.scene";
import { MAIN_MENU_SCENE_ID, MainMenuScene } from "./scene/main-menu/main-menu.scene";
import { LoadingScene } from "snake/scene/loading/loading.scene";

const canvas = document.querySelector("canvas");

const CANVAS_SIZE: Vec2<number> = { x: 1024, y: 768 }
const FPS = 60

export class SnakeGame extends Game {
    init(): void {
        if (canvas === undefined || canvas === null) {
            throw Error('canvas is undefined')
        }
        if (this.ctx === undefined || this.ctx === null) {
            throw Error('ctx is undefined')
        }
        super.init(this.ctx);

        this.sceneManager?.addScene(new ClassicGameScene(this.ctx, canvas, { x: canvas.width / 2, y: canvas.height / 2 }));
        this.sceneManager?.addScene(new MainMenuScene(this.ctx, canvas));

        const loadingScene = new LoadingScene(this.ctx, canvas)
        this.sceneManager?.addScene(loadingScene);

        loadingScene.init(this.ctx);

        this.sceneManager?.changeScene(MAIN_MENU_SCENE_ID, false);
    }
}

const SNAKE_GAME = new SnakeGame(canvas, CANVAS_SIZE.x, CANVAS_SIZE.y, FPS);
SNAKE_GAME.start(); 