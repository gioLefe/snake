import { GameCycle } from "@octo/models";
import { SceneManager } from "helpers/scene-manager";

export abstract class Game implements GameCycle<CanvasRenderingContext2D> {
    private canvasWidth: number = 0;
    private canvasHeight: number = 0;
    protected canvas: HTMLCanvasElement | undefined;
    protected ctx: CanvasRenderingContext2D | null | undefined;

    private lastUpdateTime: number = 0;
    private deltaTime: number = 0;
    private frameInterval: number = 0

    protected sceneManager: SceneManager | undefined;

    private debug: { init: boolean, update: boolean, render: boolean } = {
        init: false,
        update: false,
        render: false
    }

    constructor(canvas: HTMLCanvasElement | null, canvasWidth: number, canvasHeight: number, fps: number = 30) {
        if (canvas === null) {
            console.error(`%c *** Error, Canvas cannot be null`, `background:#222; color: #FFda55`)
            return;
        }
        this.canvas = canvas
        this.canvas.width = this.canvasWidth = canvasWidth;
        this.canvas.height = this.canvasHeight = canvasHeight;

        this.ctx = this.canvas.getContext('2d');

        this.lastUpdateTime = 0;
        this.deltaTime = 0;

        this.frameInterval - 1000 / fps
        if (this.ctx === null) {
            throw Error('ctx is null');
        }
        this.init(this.ctx);
    }
    clean(...args: any) {
        throw new Error("Method not implemented.");
    }

    init(ctx: CanvasRenderingContext2D): void {
        this.sceneManager = new SceneManager(ctx);

        if (this.debug.init)
            console.log(`%c *** Init`, `background:#020; color:#adad00`)
    }

    update(deltaTime: number): void {
        if (this.debug.update)
            console.log(`%c *** Update`, `background:#020; color:#adad00`)

        this.sceneManager?.getCurrentScene()?.update(deltaTime)
    }

    render(...args: any): void {
        if (this.debug.render)
            console.log(`%c *** Render`, `background:#020; color:#adad00`)

        this.sceneManager?.getCurrentScene()?.render(this.ctx);
    }

    gameLoop(timestamp: number): void {
        const elapsed = timestamp - this.lastUpdateTime;

        if (elapsed > this.frameInterval) {
            // Calculate deltaTime
            this.deltaTime = (timestamp - this.lastUpdateTime) / 1000; // Convert to seconds
            this.lastUpdateTime = timestamp;

            // Update game state
            this.update(this.deltaTime);

            // Clear canvas
            this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

            // Render game
            this.render(this.ctx!);
        }

        // Request next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    start(): void {
        if (this.ctx === undefined || this.ctx === null) {
            console.error(`%c *** Error, 2dContext is null`, `background:#222; color: #FF0a55`)
            throw Error('ctx is undefined');
        }
        console.log(`%c *** GAMELOOP START`, `background:#020; color:#adad00`)

        // Start the game loop
        this.lastUpdateTime = performance.now();
        this.gameLoop(this.lastUpdateTime);
    }
}