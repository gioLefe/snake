import { DIContainer, SceneHandler } from "@octo/core";
import { isPointInAlignedBBox } from "@octo/helpers";
import { SCENE_MANAGER_DI } from "@octo/models";
import { CLASSIC_GAME_SCENE_ID, ClassicGameScene } from "snake/scene/classic-game/classic-game.scene";
import { GAME_OVER_SCENE_ID } from "snake/scene/game-over/game-over.scene";
import { UIClickableLabel } from "ui/controls/clickable-label";

const MOUSE_CLICK = "restartBtnClick";

export class RestartBtn extends UIClickableLabel {
  override init(
    canvas: HTMLCanvasElement,
    ...args: any
  ): void {
    super.init(canvas);
    this.addCallback(
      "click",
      MOUSE_CLICK,
      this.restartBtnClick,
      true,
      (ev) => isPointInAlignedBBox({ x: ev.offsetX, y: ev.offsetY }, this.getBBox())
    );
    this.enableEvent("click")(canvas);
  }

  override clean(...args: any): void {
    super.clean();
    this.removeCallback(MOUSE_CLICK);
    this.deregisterEvents()
  }

  private async restartBtnClick() {
    const sceneManager =
      DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);
    sceneManager.deleteScene(
      GAME_OVER_SCENE_ID,
    );

    const classicGameScene = sceneManager.getCurrentScenes()?.filter((scene) => scene.id === CLASSIC_GAME_SCENE_ID);
    if (classicGameScene === undefined) {
      throw new Error(`Cannot find active ${CLASSIC_GAME_SCENE_ID} scene`);
    }
    return await (classicGameScene[0] as ClassicGameScene).restart();
  }
}
