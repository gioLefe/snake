export type GraphicContext = CanvasRenderingContext2D | WebGL2RenderingContext

export interface GameCycle<GraphicContext> {
    init(ctx: GraphicContext, ...args: any): any;
    update(deltaTime: number, ...args: any): any;
    render(...args: any): any;
    clean(...args: any): any;
};