import { isPointInAlignedBBox } from "@octo/helpers";
import { withEvents } from "@octo/ui";
import { UILabel } from "@octo/ui/controls";

const MOUSE_ENTER_ID = "uiButton-enter";
const MOUSE_LEAVE_ID = "uiButton-leave";

export class UIButton extends withEvents(UILabel) {
    protected mouseOver = false;

    protected mouseEnterCallbacks: Function[] = [];
    protected mouseLeaveCallbacks: Function[] = [];

    init(
        canvas: HTMLCanvasElement,
        ...args: any): void {
        super.init(canvas);

        this.addCallback<"mousemove">(
            "mousemove",
            MOUSE_ENTER_ID,
            () => {
                this.playBtnMouseEnter();
                this.mouseEnterCallbacks.forEach((callback) => callback())
            },
            (ev) =>
                isPointInAlignedBBox({ x: ev.offsetX, y: ev.offsetY }, this.getBBox()) &&
                this.mouseOver === false
        );
        this.enableEvent("mousemove")(canvas);
    }

    clean(...args: any): void {
        super.clean()
        this.removeCallback(MOUSE_ENTER_ID);
        this.removeCallback(MOUSE_LEAVE_ID);
    }

    private playBtnMouseEnter() {
        // this.setFillStyle("#a22");
        this.mouseOver = true;
        this.addCallback<"mousemove">(
            "mousemove",
            MOUSE_LEAVE_ID,
            () => {
                this.playBtnMouseLeave();
                this.mouseLeaveCallbacks.forEach((callback) => callback())
            },
            (ev) => !isPointInAlignedBBox({ x: ev.offsetX, y: ev.offsetY }, this.getBBox()),
        );
    }

    private playBtnMouseLeave() {
        // this.setFillStyle("#204Fa1");
        this.mouseOver = false;
        this.removeCallback(MOUSE_LEAVE_ID);
    }
}