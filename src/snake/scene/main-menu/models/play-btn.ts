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
  ): void {
    super.init(canvas);
    this.addCallback(
      "click",
      MOUSE_CLICK,
      this.playLblClick,
      (ev) => isPointInAlignedBBox({ x: ev.offsetX, y: ev.offsetY }, this.getBBox())
    );
    this.enableEvent("click")(canvas);
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
