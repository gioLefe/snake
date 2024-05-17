import { CanvasScene2D } from "@octo/models";

export interface SceneHandler {
    getCurrentScene(): CanvasScene2D | undefined;
    changeScene(scene: CanvasScene2D, cleanPreviousState: boolean): void
}

export class SceneManager implements SceneHandler {
    private scene: CanvasScene2D | undefined;
    private ctx: CanvasRenderingContext2D | undefined
    constructor(ctx: CanvasRenderingContext2D) { this.ctx = ctx }

    getCurrentScene(): CanvasScene2D | undefined { return this.scene }
    changeScene(scene: CanvasScene2D, cleanPreviousState: boolean = true): void {
        if (cleanPreviousState) {
            scene.clean();
        }
        this.scene = scene;
        scene.init(this.ctx!);
    }
}