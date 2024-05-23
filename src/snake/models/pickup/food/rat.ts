import { Food } from "../../food";
import { ASSETS_MANAGER_DI } from "models/game";
import { HTMLImageAsset } from "@octo/models";
import { AssetsHandler, DIContainer } from "@octo/core";

export class Rat extends Food {
    value = 1;
    image: HTMLImageAsset | undefined;
    resReady = false
    assetsManager = DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

    logPrinted = false;

    constructor(id: string) {
        super(id);
        this.position = { x: Math.random() * 1024, y: Math.random() * 768 }

        this.image = this.assetsManager.getImage('rat');
    }

    onPickup(...args: any): void {
        // TODO Play sound, disappear animation, etc.
    }

    init(ctx: CanvasRenderingContext2D, ...args: any): void {
        this.ctx = ctx;
    }
    render(...args: any): void {
        if (this.image !== undefined && this.ctx !== undefined && this.position !== undefined) {
            this.ctx.drawImage(this.image?.img, this.position.x, this.position.y, 64, 64);
        }
    }
}