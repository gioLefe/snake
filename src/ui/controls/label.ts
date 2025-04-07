import { BoundingBox, GameObject } from "@octo/models";
import { FillStrokeStyle, getTextBBox } from "@octo/ui/canvas";

export class UILabel extends GameObject<CanvasRenderingContext2D> {
  id: string | undefined;

  private text: string;
  private readonly DEFAULT_TEXT_STYLE: CanvasTextDrawingStyles = {
    direction: "inherit",
    font: "10px sans-serif",
    fontKerning: "auto",
    fontStretch: "normal",
    fontVariantCaps: "normal",
    letterSpacing: "normal",
    textAlign: "start",
    textBaseline: "alphabetic",
    textRendering: "auto",
    wordSpacing: "normal",
  };
  private textMetric: TextMetrics | undefined;
  private textStyle: CanvasTextDrawingStyles = this.DEFAULT_TEXT_STYLE;
  private textFillStyle: FillStrokeStyle | undefined = "#000";
  private textStrokeStyle: FillStrokeStyle | undefined = "#000";

  constructor(
    ctx: CanvasRenderingContext2D,
    id: string,
    posX: number,
    posY: number,
    textStyle?: Partial<CanvasTextDrawingStyles>,
    text?: string,
  ) {
    super(ctx);
    this.id = id;
    this.position = { x: posX, y: posY };
    if (textStyle !== undefined) {
      this.textStyle = { ...this.textStyle, ...textStyle };
    }
    this.text = text ?? "";
  }

  init(...args: any) {
    super.init(...args);
  }
  update(deltaTime: number, ...args: any) {
    super.update(deltaTime, args);
    if (this.text === undefined || this.position === undefined) {
      return;
    }
    this.bbox = getTextBBox(this.ctx, this.text, this.position);
  }
  render(...args: any) {
    super.render(args);
    if (this.position === undefined || this.text === undefined) {
      return;
    }

    //TODO add direction
    this.ctx.font = this.textStyle?.font ?? "20px Verdana";
    //TODO addfontKerning
    //TODO addfontStretch
    //TODO addfontVariantCaps
    //TODO addletterSpacing
    this.ctx.textAlign = this.textStyle?.textAlign ?? "left";
    this.ctx.textBaseline = this.textStyle?.textBaseline ?? "alphabetic";
    //TODO add textRendering
    //TODO add wordSpacing

    this.ctx.moveTo(this.position?.x, this.position.y);
    if (this.textStrokeStyle !== undefined) {
      this.ctx.strokeStyle = this.textStrokeStyle;
      this.ctx.strokeText(this.text, this.position.x, this.position.y);
    }
    if (this.textFillStyle !== undefined) {
      this.ctx.fillStyle = this.textFillStyle;
      this.ctx.fillText(this.text, this.position.x, this.position.y);
    }

  }
  clean(...args: any) {
    super.clean(args);
  }

  setText(text: string) {
    this.text = text;
  }

  getSize(): TextMetrics | undefined {
    return this.textMetric;
  }
  getBBox(): BoundingBox<number> {
    return this.bbox;
  }

  setTextFillStyle(style: FillStrokeStyle) {
    this.textFillStyle = style;
  }
  setTextStrokeStyle(style: FillStrokeStyle) {
    this.textStrokeStyle = style;
  }
  setTextStyle(textStyle: CanvasTextDrawingStyles) {
    this.textStyle = textStyle
  }
}
