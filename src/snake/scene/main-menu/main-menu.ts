import { CanvasScene2D } from "@octo/models";

export class MainMenu implements CanvasScene2D {
    id: string = 'main-menu';
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;


    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    init(): unknown {
        // init resources
        throw new Error("Method not implemented.");
    }
    update(deltaTime: number, ...args: any) {
        throw new Error("Method not implemented.");
    }
    render(...args: any) {
        throw new Error("Method not implemented.");
    }
    clean(...args: any) {
        throw new Error("Method not implemented.");
    }
}