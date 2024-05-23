import { GameCycle } from "models/game-cycle";

export interface CanvasScene2D extends GameCycle<CanvasRenderingContext2D> {
    id: string;
    canvas: HTMLCanvasElement | undefined;
    ctx: CanvasRenderingContext2D | undefined;
    allImagesPromises: Promise<void>[];
}
