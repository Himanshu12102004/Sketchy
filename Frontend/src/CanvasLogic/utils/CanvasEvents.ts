import GlobalVariables from './GlobalVariable';
import { setUniforms } from '../main';
class CanvasEvents {
  static isDragging: boolean;
  static dragStartX: number;
  static dragStartY: number;
  static isZooming: boolean = false;
  static setIntervalController: number;
  static addEvents() {
    window.addEventListener('resize', () => {
      CanvasEvents.onResize();
    });
    window.addEventListener('sidebar', () => {
      CanvasEvents.setIntervalController = setInterval(() => {
        CanvasEvents.onResize();
      }, 2);
    });
    GlobalVariables.canvasParent.addEventListener('transitionend', () => {
      clearInterval(CanvasEvents.setIntervalController);
    });

    GlobalVariables.canvas.addEventListener('wheel', (e) => {
      CanvasEvents.isZooming = true; // Set zooming flag
      CanvasEvents.onZoom(e);
      setTimeout(() => {
        CanvasEvents.isZooming = false; // Reset zooming flag after a delay
      }, 50); // Adjust delay as needed for responsiveness
    });

    // Mouse Events
    GlobalVariables.canvas.addEventListener('mousemove', (e) => {
      if (!CanvasEvents.isZooming) {
        CanvasEvents.onPan(e);
      }
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
      CanvasEvents.isDragging = distance >= 5;
    });

    // Touch Events
    GlobalVariables.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        CanvasEvents.isDragging = false;
        CanvasEvents.dragStartX = touch.clientX;
        CanvasEvents.dragStartY = touch.clientY;
      }
    });

    GlobalVariables.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && !CanvasEvents.isZooming) {
        const touch = e.touches[0];
        const movementX = touch.clientX - CanvasEvents.dragStartX;
        const movementY = touch.clientY - CanvasEvents.dragStartY;
        const mockMouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          movementX,
          movementY,
          bubbles: true,
          buttons: 1,
        });
        CanvasEvents.onPan(mockMouseEvent);
        CanvasEvents.dragStartX = touch.clientX;
        CanvasEvents.dragStartY = touch.clientY;
      }
    });
    GlobalVariables.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        CanvasEvents.isDragging = false;
      }
    });

    GlobalVariables.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        CanvasEvents.isZooming = true; // Set zooming flag
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        GlobalVariables.touchZoomData = {
          initialDistance: Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          ),
        };
      }
    });

    GlobalVariables.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const scaleChange =
          currentDistance / GlobalVariables.touchZoomData.initialDistance;
        const mockWheelEvent = new WheelEvent('wheel', {
          deltaY: scaleChange > 1 ? -1 : 1, // Simulate zoom in or out
          bubbles: true,
        });
        CanvasEvents.onZoom(mockWheelEvent);

        GlobalVariables.touchZoomData.initialDistance = currentDistance;
      }
    });

    GlobalVariables.canvas.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        CanvasEvents.isZooming = false; // Reset zooming flag
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
