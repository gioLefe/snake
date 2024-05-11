import { Game } from "@octo/models";
import { ClassicGameScene } from "snake/scene/classic-game/classic-game";

const canvas = document.querySelector("canvas");

export class SnakeGame extends Game {
    init(): void {
        if (canvas === undefined || canvas === null) {
            throw Error('canvas is undefined')
        }
        if (this.ctx === undefined || this.ctx === null) {
            throw Error('ctx is undefined')
        }
        super.init(this.ctx);

        // This is a test, it should load the main menu
        const game = new ClassicGameScene(this.ctx, canvas, { x: canvas.width / 2, y: canvas.height / 2 });
        this.sceneManager?.changeScene(game, false);
    }

    //
    update(deltaTime: number): void {
        super.update(deltaTime);
    }

    render(): void {
        super.render()
    }
}

const SNAKE_GAME = new SnakeGame(canvas, 1024, 768, 60);
SNAKE_GAME.start(); 