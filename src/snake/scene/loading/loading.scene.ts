import { AssetsHandler, DIContainer } from "@octo/core";
import { ASSETS_MANAGER_DI, CanvasScene2D } from "@octo/models";

export const LOADING_SCENE_SCENE_ID = 'loading';

export class LoadingScene implements CanvasScene2D {
    id: string = LOADING_SCENE_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;

    assetsManager = DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    init(ctx: CanvasRenderingContext2D, ...args: any) {
    }
    update(deltaTime: number, ...args: any) {
    }
    render(...args: any) {
        if (this.ctx === undefined) {
            throw new Error('ctx is undefined!')
        }
        if (this.canvas === undefined) {
            throw new Error('ctx is undefined!')
        }
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = '#FaF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
    }
    clean(...args: any) {
    }
}