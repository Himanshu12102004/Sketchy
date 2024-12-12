import CanvasEvents from './utils/CanvasEvents';
import GlobalVariables from './utils/GlobalVariable';
import { createProgram } from './helpers/createProgram';
import Master from './utils/Master';
import { fragmentShader, vertexShader } from './utils/shaders';
import { compileShader } from './utils/compileShader';
import { setCenterTo, setUniforms } from './canvasUtils/canvasUtils';
import {
  fetchDefaultSVG,
  finalizeProcessing,
  processSvg,
} from './canvasUtils/imageProcessing';
import Point from './wrorldComponents/Point';
function calculateNewCenter(start: Point, t: number, destination: Point) {
  return new Point(
    (1 - t) * start.x + t * destination.x,
    (1 - t) * start.x + t * destination.y
  );
}
function trackingValueChanged() {
  GlobalVariables.trackingData.lastCenter = new Point(
    (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2,
    (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2
  );
  GlobalVariables.trackingData.t += 0.007;
  if (GlobalVariables.graphScale.scale >= 100) {
    GlobalVariables.trackingData.isZoomInDone = true;
    GlobalVariables.graphScale.scale = 100;
  }
  if (GlobalVariables.trackingData.t > 1) GlobalVariables.trackingData.t = 1;
  let lines =
    GlobalVariables.master.vectorCollection[GlobalVariables.trackingData.index]
      .lines;
  let point = calculateNewCenter(
    GlobalVariables.trackingData.lastCenter,
    GlobalVariables.trackingData.t,
    new Point(lines[lines.length - 3], lines[lines.length - 2])
  );
  setCenterTo(point);
  if (
    GlobalVariables.graphScale.scale < 4 &&
    !GlobalVariables.trackingData.isZoomOutDone
  ) {
    GlobalVariables.trackingData.isZoomInDone = false;
    GlobalVariables.trackingData.isZoomOutDone = true;
  }
  if (!GlobalVariables.trackingData.isZoomOutDone) {
    GlobalVariables.animationParams.speed =
      0.0001 / GlobalVariables.graphScale.scale;
    if (GlobalVariables.animationParams.speed > 0.0001) {
      GlobalVariables.animationParams.speed = 0.0001;
    }
    if (GlobalVariables.animationParams.speed < 0.000005) {
      GlobalVariables.animationParams.speed = 0.000005;
    }
    let wheelEvent = new WheelEvent('wheel', { deltaX: 0, deltaY: 100 });
    CanvasEvents.onZoom(wheelEvent);
  }
  if (
    GlobalVariables.trackingData.isZoomOutDone &&
    !GlobalVariables.trackingData.isZoomInDone
  ) {
    GlobalVariables.animationParams.speed =
      0.0001 / GlobalVariables.graphScale.scale;
    if (GlobalVariables.animationParams.speed > 0.0001) {
      GlobalVariables.animationParams.speed = 0.0001;
    }
    if (GlobalVariables.animationParams.speed < 0.000005) {
      GlobalVariables.animationParams.speed = 0.000005;
    }
    let wheelEvent = new WheelEvent('wheel', { deltaX: 0, deltaY: -100 });

    CanvasEvents.onZoom(wheelEvent);
  }
}
function retract() {
  if (GlobalVariables.graphScale.scale <= 1) {
    GlobalVariables.trackingData.isRetractingDone = true;
  }
  if (!GlobalVariables.trackingData.isRetractingDone) {
    GlobalVariables.animationParams.speed =
      0.0001 / GlobalVariables.graphScale.scale;
    if (GlobalVariables.animationParams.speed > 0.0001) {
      GlobalVariables.animationParams.speed = 0.0001;
    }
    if (GlobalVariables.animationParams.speed < 0.000005) {
      GlobalVariables.animationParams.speed = 0.000005;
    }
    let wheelEvent = new WheelEvent('wheel', { deltaX: 0, deltaY: 100 });
    CanvasEvents.onZoom(wheelEvent);
  }
}
function animate() {
  let lastTime = 0;
  function loop(timestamp: number) {
    let gl = GlobalVariables.gl;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    GlobalVariables.animationParams.t +=
      GlobalVariables.animationParams.speed * delta;
    if (GlobalVariables.animationParams.t > 1)
      GlobalVariables.animationParams.t = 0;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (GlobalVariables.trackingData.isTrackingValueChanged) {
      trackingValueChanged();
    }
    if (
      !GlobalVariables.trackingData.isRetractingDone &&
      GlobalVariables.trackingData.index == -1
    ) {
      retract();
    }
    GlobalVariables.master.generateAndDrawVectorCollections();

    let timeElapseLoc = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'timeElapse'
    );
    GlobalVariables.gl.uniform1f(
      timeElapseLoc,
      1 / GlobalVariables.animationParams.speed
    );
    let loc = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'currTime'
    );
    GlobalVariables.gl.uniform1f(loc, performance.now());
    GlobalVariables.animationHandler = requestAnimationFrame(loop);
  }
  loop(0);
}
async function imageReceiver(file: File) {
  stopAnimation();
  GlobalVariables.imageChangeInit();
  setUniforms();
  GlobalVariables.master = new Master();
  GlobalVariables.imageNumber++;
  clearInterval(GlobalVariables.grabageClearingHandle);
  const isSvg = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      resolve(
        content.trim().startsWith('<svg') ||
          content.includes('xmlns="http://www.w3.org/2000/svg"')
      );
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

  if (isSvg) {
    await processSvg(file);
    finalizeProcessing();
    startAnimation();
  } else {
    let errorEvent = new CustomEvent('svgError');
    window.dispatchEvent(errorEvent);
    // let svgFile = await convertAndProcessImage(file);
    // if (svgFile) {
    //   await processSvg(svgFile);
    //   finalizeProcessing();
    //   startAnimation();
    // }
  }
}

function startAnimation() {
  stopAnimation();
  animate();
}
function stopAnimation() {
  GlobalVariables.gl.clear(GlobalVariables.gl.COLOR_BUFFER_BIT);
  cancelAnimationFrame(GlobalVariables.animationHandler);
}

function main(canvas: HTMLCanvasElement) {
  GlobalVariables.init(canvas);
  CanvasEvents.addEvents();
  let gl = GlobalVariables.gl;
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  GlobalVariables.shaders = compileShader(vertexShader, fragmentShader);
  GlobalVariables.program = createProgram(
    GlobalVariables.shaders.vertexShader!,
    GlobalVariables.shaders.fragmentShader!,
    GlobalVariables.gl
  );
  setUniforms();
  GlobalVariables.master = new Master();
  fetchDefaultSVG().then((file) => {
    GlobalVariables.master.fromFile(file).then(() => {
      GlobalVariables.master.samplePath();
      const vectorsCreatedEvent = new CustomEvent('vectorsCreated', {
        detail: { vectors: GlobalVariables.master.getVectorColor() },
      });
      window.dispatchEvent(vectorsCreatedEvent);
      const readyToGoEvent = new CustomEvent('readyToGo', {
        detail: { vectors: GlobalVariables.master.getVectorColor() },
      });
      window.dispatchEvent(readyToGoEvent);
      GlobalVariables.grabageClearingHandle = setInterval(() => {
        GlobalVariables.master.disposeGarbage();
      }, GlobalVariables.grabageClearingTime);
      animate();
    });
  });
}
function setTracking(index: number) {
  if (index == -1) {
    GlobalVariables.trackingData.isTrackingValueChanged = false;
  } else {
    GlobalVariables.trackingData.isTrackingValueChanged = true;
    GlobalVariables.trackingData.isRetractingDone = false;
  }
  GlobalVariables.trackingData.index = index;
  GlobalVariables.trackingData.isZoomOutDone = false;
  GlobalVariables.trackingData.lastCenter = new Point(
    (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2,
    (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2
  );
  GlobalVariables.trackingData.t = 0;
}
export { main, imageReceiver, stopAnimation, setUniforms, setTracking };
