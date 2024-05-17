import { CanvasScene2D } from "@octo/models";

export interface SceneHandler {
    addScene(scene: CanvasScene2D): void
    deleteScene(id: string | undefined): void;
    getCurrentScene(): CanvasScene2D | undefined;
    changeScene(id: string, cleanPreviousState: boolean): void
}

export class SceneManager implements SceneHandler {
    private scene: CanvasScene2D | undefined;
    private ctx: CanvasRenderingContext2D | undefined
    private scenes: CanvasScene2D[] = [];
    constructor(ctx: CanvasRenderingContext2D) { this.ctx = ctx }
    addScene(scene: CanvasScene2D): void {
        if (this.scenes.findIndex((s) => s.id === scene?.id) !== -1) {
            console.warn('Scene with same id already exists, provide a new id');
            return
        }
        this.scenes.push(scene);
    }
    deleteScene(id: string | undefined): void {
        if (id === undefined) { return }
        const i = this.scenes.findIndex((s) => s.id === id)
        this.scenes[i].clean();
        delete this.scenes[this.scenes.findIndex((s) => s.id === id)]
    }

    getCurrentScene(): CanvasScene2D | undefined {
        return this.scene
    }
    changeScene(id: string, cleanPreviousState: boolean = true): void {
        if (cleanPreviousState) {
            this.deleteScene(this.scene?.id)
        }
        const i = this.scenes.findIndex((s) => s.id === id);
        if (i === -1) {
            console.error(`cannot find scene with id ${id}`);
            return
        }
        this.scene = this.scenes[i];
        this.scene.init(this.ctx!);
    }
}