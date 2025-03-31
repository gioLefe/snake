import { AssetsHandler, DIContainer } from "@octo/core";
import { ASSETS_MANAGER_DI, CanvasScene2D, GameObject } from "@octo/models";
import { Spinner } from "./models/";

export const LOADING_SCENE_SCENE_ID = 'loading';
export const LOADING_IMAGE_ASSETS: { id: string, path: string }[] = [
    { id: 'spinner', path: '/images/spritesheets/spinner.gif' }
]

export class LoadingScene implements CanvasScene2D {
    id: string = LOADING_SCENE_SCENE_ID;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D;

    assetsManager = DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

    // UI components
    spinner: GameObject;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.spinner = new Spinner(this.ctx)
        this.canvas = canvas;
    }
    allImagesPromises: Promise<void>[] = [];

    init(...args: any) {
        LOADING_IMAGE_ASSETS.forEach((i) => {
            this.allImagesPromises.push(
                new Promise(
                    async (resolve, reject) => {
                        await this.assetsManager.addImage(i.id, i.path);

                        // Init all components
                        this.spinner.init(this.ctx!);
                        resolve();
                    }
                ))
        })

        return Promise.all(this.allImagesPromises);
    }
    update(deltaTime: number, ...args: any) {
        this.spinner.update(deltaTime)
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
        this.spinner.render();
    }
    clean(...args: any) {
    }
}