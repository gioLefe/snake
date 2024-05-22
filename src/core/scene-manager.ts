import { CanvasScene2D } from "@octo/models";

export interface SceneHandler {
    addScene(scene: CanvasScene2D): void
    deleteScene(id: string): void;
    getCurrentScenes(): CanvasScene2D[] | undefined;
    changeScene(id: string, cleanPreviousState: boolean, loadingSceneId?: string): void
}

export class SceneManager implements SceneHandler {
    private currentScenes: CanvasScene2D[] = [];
    private ctx: CanvasRenderingContext2D | undefined
    private scenes: CanvasScene2D[] = [];
    private loading = false

    constructor(ctx: CanvasRenderingContext2D) { this.ctx = ctx }
    addScene(scene: CanvasScene2D): void {
        if (this.scenes.findIndex((s) => s.id === scene?.id) !== -1) {
            console.warn('Scene with same id already exists, provide a new id');
            return;
        }
        this.scenes.push(scene);
    }
    deleteScene(id: string): void {
        const i = this.getSceneIndex(id, this.scenes)
        this.scenes[i].clean();
        delete this.scenes[i]
    }
    getCurrentScenes(): CanvasScene2D[] | undefined {
        return this.currentScenes
    }

    async changeScene(id: string, cleanPreviousState: boolean = true, loadingSceneId?: string): Promise<void> {
        const lastCurrentSceneId = this.currentScenes[this.currentScenes.length - 1]?.id;
        const i = this.getSceneIndex(id, this.scenes);
        const loadPromise = this.scenes[i].init(this.ctx!);

        // Scene can return a promise, indicating it needs to load assets before it can render
        if (loadPromise !== undefined) {
            if (loadingSceneId !== undefined) {
                const loadingSceneIndex = this.getSceneIndex(loadingSceneId, this.scenes);
                this.currentScenes.push(this.scenes[loadingSceneIndex]);
                this.scenes[loadingSceneIndex].init(this.ctx!)
            }
            this.loading = true;
            await loadPromise;
            if (cleanPreviousState && lastCurrentSceneId !== undefined) {
                this.deleteScene(lastCurrentSceneId)
            }
            this.loading = false;
        }
        this.currentScenes.push(this.scenes[i]);
    }

    private getSceneIndex(id: string, scenes: CanvasScene2D[]) {
        const loadingSceneIndex = scenes.findIndex((s) => s.id === id);
        if (loadingSceneIndex === -1) {
            throw new Error(`cannot find scene with id ${id}`);
        }
        return loadingSceneIndex;
    }

    isLoading(): boolean {
        return this.loading
    }
}