import CanvasEvents from './utils/CanvasEvents';
import GlobalVariables from './utils/GlobalVariable';
import { createProgram } from './helpers/createProgram';
import Master from './utils/Master';
import { fragmentShader, vertexShader } from './utils/shaders';
import { compileShader } from './utils/compileShader';
import { setCenterTo, setUniforms } from './canvasUtils/canvasUtils';
import { convertAndProcessImage, fetchDefaultSVG, finalizeProcessing, processSvg } from './canvasUtils/imageProcessing';

function trackingValueChanged() {}
function animate() {
  let lastTime = 0;
  function loop(timestamp: number) {
    // console.log("F")
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
      GlobalVariables.trackingData.index != -1 &&
      !GlobalVariables.trackingData.isTrackingValueChanged
    ) {
      setCenterTo(GlobalVariables.trackingData.index);
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
    let svgFile = await convertAndProcessImage(file);
    if (svgFile) {
      await processSvg(svgFile);
      finalizeProcessing();
      startAnimation();
    }
  }
}


function startAnimation() {
  stopAnimation();
  animate();
}
function stopAnimation() {
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
      GlobalVariables.grabageClearingHandle = setInterval(() => {
        GlobalVariables.master.disposeGarbage();
      }, GlobalVariables.grabageClearingTime);

      animate();
    });
  });
}
function setTracking(index: number) {
  GlobalVariables.trackingData.index = index;
  GlobalVariables.trackingData.isTrackingValueChanged = true;
}
export {
  main,
  imageReceiver,
  stopAnimation,
  setUniforms,
  setTracking,
};
