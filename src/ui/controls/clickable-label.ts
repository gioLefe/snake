import { isPointInAlignedBBox } from "@octo/helpers";
import { EventCallback, withEvents } from "@octo/ui";
import { UILabel } from "@octo/ui/controls";

const MOUSE_ENTER_ID = "uiClickableLabel-enter";
const MOUSE_LEAVE_ID = "uiClickableLabel-leave";

export class UIClickableLabel extends withEvents(UILabel) {
  protected mouseOver = false;

  private mouseEnterCallbacks: EventCallback[] = [];
  private mouseLeaveCallbacks: EventCallback[] = [];

  override init(canvas: HTMLCanvasElement, ...args: any): void {
    super.init(canvas);

    this.addCallback<"mousemove">(
      "mousemove",
      MOUSE_ENTER_ID,
      () => {
        this.playBtnMouseEnter();
        this.mouseEnterCallbacks.forEach((callback) => callback());
      },
      false,
      (ev) =>
        isPointInAlignedBBox(
          { x: ev.offsetX, y: ev.offsetY },
          this.getBBox(),
        ) && this.mouseOver === false,
    );
    this.enableEvent("mousemove")(canvas);
  }

  override clean(...args: any): void {
    super.clean();
    this.deregisterEvents();
    this.removeCallback(MOUSE_ENTER_ID);
    this.removeCallback(MOUSE_LEAVE_ID);
  }

  addMouseEnterCallback = (ev: EventCallback) => {
    this.mouseEnterCallbacks.push(ev);
  };
  addMouseLeaveCallback = (ev: EventCallback) => {
    this.mouseLeaveCallbacks.push(ev);
  };

  private playBtnMouseEnter() {
    this.mouseOver = true;
    this.addCallback<"mousemove">(
      "mousemove",
      MOUSE_LEAVE_ID,
      () => {
        this.playBtnMouseLeave();
        this.mouseLeaveCallbacks.forEach((callback) => callback());
      },
      false,
      (ev) =>
        !isPointInAlignedBBox({ x: ev.offsetX, y: ev.offsetY }, this.getBBox()),
    );
  }

  private playBtnMouseLeave() {
    this.mouseOver = false;
    this.removeCallback(MOUSE_LEAVE_ID);
  }
}
