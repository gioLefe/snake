import { AssetsHandler, DIContainer } from "@octo/core";
import { calculateNormals, getBBoxRect } from "@octo/helpers";
import { ASSETS_MANAGER_DI, ImageAsset, Polygon, Vec2 } from "@octo/models";
import { Food } from "../../food";
import { Snake } from "../../snake";

const DEBUG: boolean = true;

export class Cookie extends Food {
  value = 1;
  image: ImageAsset | undefined;
  resReady = false;
  assetsManager =
    DIContainer.getInstance().resolve<AssetsHandler>(ASSETS_MANAGER_DI);

  private bboxPolygon: Polygon | undefined;

  constructor(
    ctx: CanvasRenderingContext2D,
    id: string,
    width?: number,
    height?: number,
    worldCoordinates?: Vec2<number>,
  ) {
    super(ctx, id);
    this.position = worldCoordinates;
    this.image = this.assetsManager.find("rat") as ImageAsset;
    this.width = width ? width : this.image ? this.image.source.width : 0;
    this.height = height ? height : this.image ? this.image.source.height : 0;
  }

  onPickup(...args: any[]): void {
    const snake = args.find(Snake.isSnake);
    if (snake === undefined) {
      throw new Error("snake is not defined");
    }
    snake.addSegment();

    // TODO trigger side effects: Play sound, graphic effects, etc.
  }

  init(ctx: CanvasRenderingContext2D, ...args: any): void {
    this.ctx = ctx;
    this.updateBbox();
  }
  render(...args: any): void {
    if (this.ctx === undefined) {
      throw new Error("ctx is undefined");
    }
    if (this.image !== undefined && this.position !== undefined) {
      this.ctx.drawImage(
        this.image?.source,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
      );
    }

    if (DEBUG === false) {
      return;
    }
    if (this.bboxPolygon !== undefined) {
      this.ctx.moveTo(
        this.bboxPolygon?.points[0].x,
        this.bboxPolygon?.points[0].y,
      );

      // DEBUG BOUNDING BOX
      // this.ctx.strokeStyle = "#000";
      // this.ctx.beginPath();
      // this.bboxPolygon.points.forEach((p) => {
      //   this.ctx!.lineTo(p.x, p.y);
      // });
      // this.ctx.closePath();
      // this.ctx.stroke();
    }
  }

  setWidth(width: number) {
    super.setWidth(width);
    this.updateBbox();
  }

  setHeight(height: number) {
    super.setHeight(height);
    this.updateBbox();
  }

  private updateBbox() {
    if (this.position) {
      this.bbox = {
        nw: { x: this.position.x, y: this.position.y },
        se: {
          x: this.position.x + this.width,
          y: this.position.y + this.height,
        },
      };
      this.bboxPolygon = getBBoxRect(this.bbox);
      this.bboxPolygon.normals = calculateNormals(this.bboxPolygon.points);
    }
  }
}
