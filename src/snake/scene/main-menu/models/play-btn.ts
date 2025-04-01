import { DIContainer, SceneHandler } from "@octo/core";
import { isPointInAlignedBBox as isPointInBBox } from "@octo/helpers";
import { SCENE_MANAGER_DI } from "@octo/models";
import { UILabel } from "@octo/ui/controls";
import { CLASSIC_GAME_SCENE_ID } from "../../classic-game/classic-game.scene";
import { LOADING_SCENE_SCENE_ID } from "snake/scene/loading/loading.scene";
import { withEvents } from "ui/with-events";

const MOUSE_CLICK = "playBtnClick";
const MOUSE_ENTER_ID = "playBtnMouseMove-enter";
const MOUSE_LEAVE_ID = "playBtnMouseMove-leave";

export class PlayBtn extends withEvents(UILabel) {
  private mouseOver = false;

  init(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    ...args: any
  ): void {
    super.init(ctx, canvas);
    this.addCallback(
      "click",
      MOUSE_CLICK,
      this.playLblClick,
      (ev: MouseEvent) => isPointInBBox({ x: ev.x, y: ev.y }, this.getBBox()),
    );
    this.enableEvent("click")(canvas);

    this.addCallback(
      "mousemove",
      MOUSE_ENTER_ID,
      () => this.playBtnMouseEnter(),
      (ev: MouseEvent) =>
        isPointInBBox({ x: ev.x, y: ev.y }, this.getBBox()) &&
        this.mouseOver === false,
    );
    this.enableEvent("mousemove")(canvas);
  }
  clean(...args: any[]): void {
    super.clean(...args);
    this.deregisterEvents();
  }
  update(deltaTime: number, ...args: any): void {
    super.update(deltaTime, ...args);
  }

  private playBtnMouseEnter() {
    this.setFillStyle("#a22");
    this.mouseOver = true;
    this.addCallback(
      "mousemove",
      MOUSE_LEAVE_ID,
      () => this.playBtnMouseLeave(),
      (ev: MouseEvent) => !isPointInBBox({ x: ev.x, y: ev.y }, this.getBBox()),
    );
  }
  private playBtnMouseLeave() {
    this.setFillStyle("#204Fa1");
    this.mouseOver = false;
    this.removeCallback(MOUSE_LEAVE_ID);
  }

  private playLblClick(x: number, y: number) {
    const sceneManager =
      DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);
    sceneManager.changeScene(
      CLASSIC_GAME_SCENE_ID,
      true,
      LOADING_SCENE_SCENE_ID,
    );
  }
}
