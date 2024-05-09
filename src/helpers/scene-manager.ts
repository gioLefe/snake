import { CanvasScene2D } from "@octo/models";

export class SceneManager {
    private scene: CanvasScene2D | undefined;
    private ctx: CanvasRenderingContext2D | undefined
    constructor(ctx: CanvasRenderingContext2D) { this.ctx = ctx }

    getCurrentScene() { return this.scene }
    changeScene(scene: CanvasScene2D, cleanPreviousState: boolean = true) {
        if (cleanPreviousState) {
            scene.clean();
        }
        this.scene = scene;
        scene.init(this.ctx!);
    }

}