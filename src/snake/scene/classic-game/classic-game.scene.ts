import { AssetsHandler, DIContainer } from "@octo/core";
import { ASSETS_MANAGER_DI, CanvasScene2D, MinMax, Vec2 } from "@octo/models";
import { Rat } from "snake/models/pickup/food/rat";
import { withEvents } from "ui/with-events";
import { Pickup, Snake } from "../../models";
import { CLASSIC_GAME_IMAGE_ASSETS, initSnake } from "./classic-game-init.scene";
import { createVector, randomIntFromInterval } from "@octo/helpers";

export const CLASSIC_GAME_SCENE_ID = 'classic-game';
const CANVAS_BG_COLOR = "#afd7db"
const MOUSE_MOVE_EVENT_ID = 'ClassicGameScene-mousemove';
const KEY_DOWN_EVENT_ID = 'ClassicGameScene-keydown';
const KEY_UP_EVENT_ID = 'ClassicGameScene-keyup';

const FOOD_SIZE = 24;

export class ClassicGameScene extends withEvents(class { }) implements CanvasScene2D {
    id: string = CLASSIC_GAME_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;
    assetsManager = DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

    playerSnake: Snake | undefined = undefined;
    pickups: Pickup[] = [];
    allImagesPromises: Promise<void>[] = [];

    // Stats
    score = 0;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, initialWorldCoordinates: Vec2<number>) {
        super()
        this.ctx = ctx
        this.canvas = canvas
        this.playerSnake = initSnake(ctx, { worldCoordinates: { x: initialWorldCoordinates.x, y: initialWorldCoordinates.y }, length: 4 });
    }

    init(): Promise<any> {
        if (this.playerSnake === undefined) {
            throw Error('player snake is not defined')
        }

        this.addCallback("mousemove", MOUSE_MOVE_EVENT_ID, (ev: MouseEvent) => this.mouseMove(ev)(this.playerSnake!), () => true)
        this.enableEvent('mousemove')(this.canvas!);
        this.addCallback("keydown", KEY_DOWN_EVENT_ID, (ev: KeyboardEvent) => this.keyDown(ev)(this.playerSnake!), () => true)
        this.enableEvent('keydown')(window);
        this.addCallback("keyup", KEY_UP_EVENT_ID, (ev: KeyboardEvent) => this.keyUp(ev)(this.playerSnake!), () => true)
        this.enableEvent('keyup')(window);

        CLASSIC_GAME_IMAGE_ASSETS.forEach((i) => {
            this.allImagesPromises.push(
                new Promise(
                    async (resolve, reject) => {
                        await this.assetsManager.addImage(i.id, i.path);
                        // TODO: move resolve outside the timeout and remove timeout, it is just for test purposes
                        // setTimeout(() => resolve(), 3000);
                        resolve()
                    }
                ))
        })
        return Promise.all(this.allImagesPromises).then((r) => r).catch((reason) => {
            console.error(reason)
        });
    }

    update(deltaTime: number): void {
        if (this.playerSnake === undefined) {
            throw new Error('Player snake is undefined!')
        }

        // Spawn rats
        while (this.pickups.length < 5) {
            const rat = new Rat('rat', FOOD_SIZE, FOOD_SIZE, this.calcRandomPosition(1024, 768, { min: FOOD_SIZE, max: FOOD_SIZE }, { min: FOOD_SIZE, max: FOOD_SIZE }))
            this.pickups.push(rat);
            if (this.ctx !== undefined) {
                rat.init(this.ctx)
            }
        }

        // Collision detection
        const headSideLength = this.playerSnake.getHeadSize();
        const headDistanceDelta: Vec2<number> = createVector(this.playerSnake.getDirection(), this.playerSnake.getSpeed());
        const snakeNextPos = {
            x: this.playerSnake.getHeadPos().x + headDistanceDelta.x,
            y: this.playerSnake.getHeadPos().y + headDistanceDelta.y
        };

        // - Food
        this.pickups.forEach((pickup, i) => {
            const pos = pickup.getPosition();
            if (pos === undefined) {
                return;
            }

            if ((snakeNextPos.x >= pos.x - headSideLength && snakeNextPos.x <= pos.x + pickup.getWidth() + headSideLength) &&
                (snakeNextPos.y >= pos.y - headSideLength && snakeNextPos.y <= pos.y + pickup.getHeight() + headSideLength)) {

                pickup.onPickup(this.playerSnake);
                this.pickups[i].clean();
                this.pickups.splice(i, 1);
                this.score += 1;
            }
        });

        this.playerSnake.update(deltaTime);
    }

    render(): void {
        if (this.canvas === undefined) {
            throw Error('canvas is undefined')
        }
        if (!this.ctx) {
            throw Error('ctx (CanvasRenderingContext2D) is not defined')
        }

        // Apply background color
        this.ctx.fillStyle = CANVAS_BG_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        // Render food
        this.pickups.forEach((p) => p.render())

        // TODO: Reender Powerups

        // Player snake
        this.playerSnake?.render(this.ctx);

        // Render UI
        this.ctx.font = `12px Verdana`
        this.ctx.strokeStyle = "#000";
        this.ctx.strokeText('Score: ' + this.score, 10, 20)
    }

    clean(...args: any) {
        this.abortControllers.forEach((ac) => ac.abort());
    }

    private mouseMove = (ev: MouseEvent) => {
        return (snake: Snake) => {
            snake.steerTo({ x: ev.x, y: ev.y });
        }
    }

    private keyDown = (ev: KeyboardEvent) => {
        return (snake: Snake) => {
            switch (ev.key) {
                case 'a':
                    snake.steer(- 0.25) // TODO: send SteerDirection
                    break;
                case 'd':
                    snake.steer(+ 0.25) // TODO: send SteerDirection
                    break;
                case ' ':
                    snake.setTurbo(true);
                    break;
            }
        }
    }

    private keyUp = (ev: KeyboardEvent) => {
        return (snake: Snake) => {
            switch (ev.key) {
                case ' ':
                    snake.setTurbo(false);
                    break;
            }
        }
    }

    private calcRandomPosition(containerW: number, containerH: number, minMaxW: MinMax, minMaxH: MinMax): Vec2<number> {
        return {
            x: randomIntFromInterval(minMaxW.min / 2, Math.random() * (containerW - minMaxW.max / 2)),
            y: randomIntFromInterval(minMaxH.min / 2, Math.random() * (containerH - minMaxH.max / 2))
        }
    }
}