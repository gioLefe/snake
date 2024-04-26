/**
 * USE CASE: 
 * Game engine that draws polygons that move following a TBD behavior
 * and collisions between polygons is determined using the SAT(Separated Axis Theorem)
 */

import { Game } from "@octo/models";
import { Snake } from "./models";
import { initSnake } from "./snake-init";
import { registerKeyboardEvents } from "./snake-inputs";

const canvasBgColor = "#afd7db"
const canvas = document.querySelector("canvas");

let snake: Snake | undefined = undefined;

class SnakeGame extends Game {
    init(): void {
        super.init();
        snake = initSnake({ position: { x: this.canvas!.width / 2, y: this.canvas!.height / 2 } });
        registerKeyboardEvents(snake);
    }

    //
    update(deltaTime: number): void {
        super.update(deltaTime);
        snake?.update(deltaTime);
    }

    render(): void {
        super.render();
        // Apply background color
        this.ctx!.fillStyle = canvasBgColor;
        this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height)

        // Player snake
        snake?.render(this.ctx!);
    }
}

const game_collisions = new SnakeGame(canvas, 570, 400, 30);
game_collisions.start(); 