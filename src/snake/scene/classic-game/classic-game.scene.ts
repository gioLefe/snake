import { AssetsHandler, DIContainer } from "@octo/core";
import { ASSETS_MANAGER_DI, CanvasScene2D, Vec2 } from "@octo/models";
import { Rat } from "snake/models/pickup/food/rat";
import { withEvents } from "ui/with-events";
import { Pickup, Snake } from "../../models";
import { CLASSIC_GAME_IMAGE_ASSETS, initSnake } from "./classic-game-init.scene";

const canvasBgColor = "#afd7db"
export const CLASSIC_GAME_SCENE_ID = 'classic-game';
const MOUSE_MOVE_EVENT_ID = 'ClassicGameScene-mousemove';
const KEY_DOWN_EVENT_ID = 'ClassicGameScene-keydown';
const KEY_UP_EVENT_ID = 'ClassicGameScene-keyup';

export class ClassicGameScene extends withEvents(class { }) implements CanvasScene2D {
    id: string = CLASSIC_GAME_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;
    assetsManager = DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

    playerSnake: Snake | undefined = undefined;
    pickups: Pickup[] = [];
    allImagesPromises: Promise<void>[] = [];

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, initialWorldCoordinates: Vec2<number>) {
        super()
        this.ctx = ctx
        this.canvas = canvas
        this.playerSnake = initSnake(ctx, { worldCoordinates: { x: initialWorldCoordinates.x, y: initialWorldCoordinates.y } });
    }
    init(): Promise<any> {
        if (this.playerSnake === undefined) {
            throw Error('player snake is not defined')
        }
        if (this.playerSnake === undefined) {
            throw Error('snake is not initialized!')
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
                        setTimeout(() => resolve(), 3000);
                    }
                ))
        })
        return Promise.all(this.allImagesPromises).then((r) => r).catch((reason) => {
            console.error(reason)
        });
    }

    update(deltaTime: number): void {
        this.playerSnake?.update(deltaTime);

        if (this.pickups.length === 0) {
            const rat = new Rat('rat')
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

        // Render food
        this.pickups.forEach((p) => p.render())

        // TODO: Reender Powerups

        // Player snake
        this.playerSnake?.render(this.ctx);
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
}