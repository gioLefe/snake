import { DIContainer } from "@octo/core";
import { SceneHandler } from "@octo/helpers";
import { SCENE_MANAGER_DI } from "@octo/models";
import { CLASSIC_GAME_SCENE_ID } from "snake/scene/classic-game/classic-game";

export function playLblClick(x: number, y: number) {
    const sceneManager = DIContainer.getInstance().resolve<SceneHandler>(SCENE_MANAGER_DI);
    sceneManager.changeScene(CLASSIC_GAME_SCENE_ID, true)
}