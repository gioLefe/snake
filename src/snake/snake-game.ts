/**
 * USE CASE: 
 * Game engine that draws polygons that move following a TBD behavior
 * and collisions between polygons is determined using the SAT(Separated Axis Theorem)
 */

import { Game } from "@octo/models";
import { Snake } from "./models";
import { initSnake } from "./snake-init";
import { registerKeyboardEvents, registerMouseEvents } from "./snake-inputs";

const canvasBgColor = "#afd7db"
const canvas = document.querySelector("canvas");

let playerSnake: Snake | undefined = undefined;

class SnakeGame extends Game {
    init(): void {
        super.init();
        playerSnake = initSnake({ position: { x: this.canvas!.width / 2, y: this.canvas!.height / 2 } });
        registerKeyboardEvents(playerSnake);
        registerMouseEvents(playerSnake)
    }

    //
    update(deltaTime: number): void {
        super.update(deltaTime);
        playerSnake?.update(deltaTime);
    }

    render(): void {
        super.render();
        // Apply background color
        this.ctx!.fillStyle = canvasBgColor;
        this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height)


        // TODO: Render all snakes
        // Player snake
        playerSnake?.render(this.ctx!);

        // TODO: Render food

        // TODO: Reender Powerups
    }
}

const game_collisions = new SnakeGame(canvas, 1024, 768, 60);
game_collisions.start(); 