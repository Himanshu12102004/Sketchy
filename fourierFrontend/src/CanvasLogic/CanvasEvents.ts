import GlobalVariables from './GlobalVariable';
import { setUniforms } from './main';

class CanvasEvents {
  static isDragging: boolean;
  static dragStartX: number;
  static dragStartY: number;
  static setIntervalController: number;
  static addEvents() {
    window.addEventListener('resize', () => {
      CanvasEvents.onResize();
    });
    window.addEventListener('sidebar', () => {
      this.setIntervalController = setInterval(() => {
        CanvasEvents.onResize();
      }, 5);
    });
    GlobalVariables.canvasParent.addEventListener('transitionend', () => {
      clearInterval(this.setIntervalController);
    });

    GlobalVariables.canvas.addEventListener('wheel', (e) => {
      CanvasEvents.onZoom(e);
    });
    GlobalVariables.canvas.addEventListener('mousemove', (e) => {
      CanvasEvents.onPan(e);
    });
    GlobalVariables.canvas.addEventListener('mousedown', (e) => {
      CanvasEvents.isDragging = false;
      CanvasEvents.dragStartX = e.clientX;
      CanvasEvents.dragStartY = e.clientY;
    });
    GlobalVariables.canvas.addEventListener('mouseup', (e) => {
      const dragEndX = e.clientX;
      const dragEndY = e.clientY;
      const distance = Math.hypot(
        dragEndX - CanvasEvents.dragStartX,
        dragEndY - CanvasEvents.dragStartY
      );
      if (distance < 5) {
      } else {
        CanvasEvents.isDragging = true;
      }
    });
  }
  static onResize(e = undefined) {
    GlobalVariables.screenDimensions.height =
      GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.screenDimensions.width =
      GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.canvas!.height = GlobalVariables.screenDimensions.height;
    GlobalVariables.canvas!.width = GlobalVariables.screenDimensions.width;
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.screenDimensions.width,
      GlobalVariables.screenDimensions.height
    );

    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    GlobalVariables.bounds.maxX =
      centerX +
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minX =
      centerX -
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.maxY =
      centerY +
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minY =
      centerY -
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    setUniforms();
  }
  static onZoom(e: WheelEvent) {
    if (e.deltaY > 0) {
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 0.95;
      //   GlobalVariables.baseVectorWidth *= 1.01;
    } else {
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 1.05;
      //   GlobalVariables.baseVectorWidth *= 0.99;
    }
    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    GlobalVariables.bounds.maxX =
      centerX +
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minX =
      centerX -
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.maxY =
      centerY +
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minY =
      centerY -
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    // GlobalVariables.vectorCollection.reCalculateVectorWidths();
    setUniforms();
  }
  static onPan(e: MouseEvent) {
    if (e.buttons === 1) {
      var iRange = GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY;
      var rRange = GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX;
      var iDelta = (e.movementY / GlobalVariables.canvas.clientHeight) * iRange;
      var rDelta = (e.movementX / GlobalVariables.canvas.clientWidth) * rRange;
      GlobalVariables.bounds.minY += iDelta;
      GlobalVariables.bounds.maxY += iDelta;
      GlobalVariables.bounds.minX -= rDelta;
      GlobalVariables.bounds.maxX -= rDelta;
      GlobalVariables.canvas.style.cursor = 'grabbing';
    } else {
      GlobalVariables.canvas.style.cursor = 'default';
    }
    setUniforms();
  }
}
export default CanvasEvents;
