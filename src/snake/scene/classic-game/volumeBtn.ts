import { AudioController, DIContainer } from "@octo/core";
import { isPointInAlignedBBox } from "@octo/helpers";
import { GameObject } from "@octo/models";
import { withEvents } from "@octo/ui";
import { SpriteImage } from "snake/models";

const MOUSE_CLICK = "volumneBtnClick";

export class VolumneBtn extends withEvents(class extends GameObject {}) {
  private audioController = DIContainer.getInstance().resolve<AudioController>(
    AudioController.AUDIO_CONTROLLER_DI,
  );
  enabledImage: SpriteImage;
  disabledImage: SpriteImage;

  private enabled: boolean = true;

  constructor(
    ctx: CanvasRenderingContext2D,
    enabledImageId: string,
    disabledImageId: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) {
    super(ctx);
    this.position = { x, y };
    this.width = width;
    this.height = height;

    this.enabledImage = new SpriteImage(ctx, enabledImageId, width, height);
    this.disabledImage = new SpriteImage(ctx, disabledImageId, width, height);

    this.updateBBox();
  }

  override init(canvas: HTMLCanvasElement): void {
    super.init(canvas);
    this.enabled = this.audioController.getMainVolume() > 0;

    this.addCallback(
      "click",
      MOUSE_CLICK,
      this.volumneLblClick,
      false,
      (ev) => {
        if (this.bbox === undefined) {
          console.warn(`bbox is undefined`);
          return false;
        }
        return isPointInAlignedBBox(
          { x: ev.offsetX, y: ev.offsetY },
          this.bbox,
        );
      },
    );
    this.enableEvent("click")(canvas);
  }

  override render(..._args: any): void {
    super.render();
    if (this.enabled) {
      this.enabledImage.render(this.position);
    } else {
      this.disabledImage.render(this.position);
    }
  }

  private volumneLblClick = () => {
    this.enabled = !this.enabled;
    this.audioController.setMainVolume(this.enabled ? 1 : 0);
  };

  private updateBBox() {
    this.bbox = {
      nw: {
        x: this.position.x - this.width / 2,
        y: this.position.y - this.height / 2,
      },
      se: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height / 2,
      },
    };
  }
}
