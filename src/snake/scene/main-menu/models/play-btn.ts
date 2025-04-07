import { DIContainer, SceneHandler } from "@octo/core";
import { isPointInAlignedBBox } from "@octo/helpers";
import { SCENE_MANAGER_DI } from "@octo/models";
import { LOADING_SCENE_SCENE_ID } from "snake/scene/loading/loading.scene";
import { UIButton } from "ui/controls/button";
import { CLASSIC_GAME_SCENE_ID } from "../../classic-game/classic-game.scene";

const MOUSE_CLICK = "playBtnClick";

export class PlayBtn extends UIButton {
  init(
    canvas: HTMLCanvasElement,
    ...args: any
  ): void {
    super.init(canvas);
    this.addCallback(
      "click",
      MOUSE_CLICK,
      this.playLblClick,
      (ev) => isPointInAlignedBBox({ x: ev.offsetX, y: ev.offsetY }, this.getBBox())
    );
    this.enableEvent("click")(canvas);

    this.mouseEnterCallbacks.push(() => {
      this.setTextFillStyle("#a22");
    })
    this.mouseLeaveCallbacks.push(() => {
      this.setTextFillStyle("#204Fa1");
    })
  }
  clean(...args: any[]): void {
    super.clean(...args);
    this.deregisterEvents();
  }
  update(deltaTime: number, ...args: any): void {
    super.update(deltaTime, ...args);
  }

  private playLblClick() {
    const sceneManager =
      DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);
    sceneManager.changeScene(
      CLASSIC_GAME_SCENE_ID,
      true,
      LOADING_SCENE_SCENE_ID,
    );
  }
}
