import { Food } from "../../food";

export class Rat extends Food {
    value = 1;
    image: HTMLImageElement | undefined;
    resReady = false

    logPrinted = false

    constructor(id: string) {
        super(id);
        this.position = { x: Math.random() * 1024, y: Math.random() * 768 }
        this.image = new Image(65, 95);
        this.image.src = "public/images/spritesheets/rat.png";
        this.image.onload = (ev) => {
            this.resReady = true;
        }
    }

    onPickup(...args: any): void {
        // TODO Play sound, disappear animation, etc.
    }

    init(ctx: CanvasRenderingContext2D, ...args: any): void {
        this.ctx = ctx;
    }
    render(...args: any): void {
        if (this.resReady === true && this.image !== undefined && this.ctx !== undefined && this.position !== undefined) {
            this.ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
        } else if (this.logPrinted === false) {
            console.warn('cannot draw Rat, smth is missing: ', this.resReady,
                this.image,
                this.ctx,
                this.position)
            this.logPrinted = true
        }
    }
}