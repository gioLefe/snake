import { DIContainer, SceneHandler } from "@octo/core";
import { isPointInAlignedBBox as isPointInBBox } from "@octo/helpers";
import { SCENE_MANAGER_DI } from "@octo/models";
import { UILabel } from "@octo/ui/controls";
import { CLASSIC_GAME_SCENE_ID } from "../../classic-game/classic-game";

export class PlayBtn extends UILabel {
    private mouseOver = false;

    init(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ...args: any): void {
        super.init(ctx, canvas);
        this.addMouseCallback("click", 'playBtnClick', this.playLblClick, (ev) =>
            isPointInBBox({ x: ev.x, y: ev.y }, this.getBBox()));
        this.enableMouseEvent('click');

        this.addMouseCallback("mousemove", 'playBtnMouseMove-enter', () => this.playBtnMouseEnter(), (ev) =>
            isPointInBBox({ x: ev.x, y: ev.y }, this.getBBox()) && this.mouseOver === false);
        this.enableMouseEvent('mousemove');
    }
    clean(...args: any[]): void {
        super.clean(...args);
    }
    update(deltaTime: number, ...args: any): void {
        super.update(deltaTime, ...args);
    }

    private playBtnMouseEnter() {
        this.setFillStyle("#a22");
        this.mouseOver = true;
        this.addMouseCallback("mousemove", 'playBtnMouseMove-leave', () => this.playBtnMouseLeave(), (ev) =>
            !isPointInBBox({ x: ev.x, y: ev.y }, this.getBBox()));

    }
    private playBtnMouseLeave() {
        this.setFillStyle("#204Fa1");
        this.mouseOver = false;
        this.removeMouseCallback('playBtnMouseMove-leave');
    }

    private playLblClick(x: number, y: number) {
        const sceneManager = DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);
        sceneManager.changeScene(CLASSIC_GAME_SCENE_ID, true)
    }
}

