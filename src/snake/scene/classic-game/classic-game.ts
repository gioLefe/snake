import { Rat } from "snake/models/pickup/food/rat";
import { Food, Pickup, Snake } from "../../models";
import { initSnake } from "./classic-game-init";
import { registerKeyboardEvents, registerMouseEvents } from "./classic-game-inputs";
import { CanvasScene2D, Vec2 } from "@octo/models";

const canvasBgColor = "#afd7db"
export const CLASSIC_GAME_SCENE_ID = 'classic-game-scene';

export class ClassicGameScene implements CanvasScene2D {
    id: string = CLASSIC_GAME_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;

    playerSnake: Snake | undefined = undefined;
    pickups: Pickup[] = []

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, initialPlayerPosition: Vec2<number>) {
        this.ctx = ctx
        this.canvas = canvas
        this.playerSnake = initSnake(ctx, { worldCoordinates: { x: initialPlayerPosition.x, y: initialPlayerPosition.y } });
    }
    init(): void {
        if (this.playerSnake === undefined) {
            throw Error('player snake is not defined')
        }
        registerKeyboardEvents(this.playerSnake);
        registerMouseEvents(this.playerSnake)
    }

    //
    update(deltaTime: number): void {
        this.playerSnake?.update(deltaTime);

        if (this.pickups.length === 0) {
            const rat = new Rat('alberto')
            this.pickups.push(rat);
            if (this.ctx !== undefined) {
                rat.init(this.ctx)
            }
        }
    }

    render(): void {
        if (this.canvas === undefined || this.canvas === null) {
            throw Error('canvas is undefined')
        }
        if (!this.ctx) {
            throw Error('ctx (CanvasRenderingContext2D) is not defined')
        }

        // Apply background color
        this.ctx.fillStyle = canvasBgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // TODO: Render food
        this.pickups.forEach((p) =>
            p.render())

        // TODO: Reender Powerups

        // Player snake
        this.playerSnake?.render(this.ctx);
    }
    clean(...args: any) {
        console.warn("Method not implemented.");
    }
}