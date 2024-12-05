import CanvasEvents from './CanvasEvents';
import GlobalVariables from './GlobalVariable';
import { shaderCompiler } from './helpers/compileShaders';
import { createProgram } from './helpers/createProgram';
import Master from './Master';
import { fragmentShader, vertexShader } from './shaders';
function compileShader(
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  let vertexShader = shaderCompiler(
    vertexShaderSource,
    GlobalVariables.gl.VERTEX_SHADER,
    GlobalVariables.gl
  );
  let fragmentShader = shaderCompiler(
    fragmentShaderSource,
    GlobalVariables.gl.FRAGMENT_SHADER,
    GlobalVariables.gl
  );
  return { vertexShader, fragmentShader };
}
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
    GlobalVariables.master.generateAndDrawVectorCollections();
    let loc = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'currTime'
    );
    GlobalVariables.gl.uniform1f(loc, performance.now());
    GlobalVariables.animationHandler = requestAnimationFrame(loop);
  }
  loop(0);
}
function imageReceiver(file: File) {
  stopAnimation();
  GlobalVariables.master = new Master();
  GlobalVariables.master.fromFile(file).then(() => {
    GlobalVariables.master.samplePath();
    startAnimation();
  });
}
function startAnimation() {
  stopAnimation();
  animate();
}
function stopAnimation() {
  cancelAnimationFrame(GlobalVariables.animationHandler);
}
function setUniforms() {
  let maxXLoc = GlobalVariables.gl.getUniformLocation(
    GlobalVariables.program,
    'maxX'
  );
  let maxYLoc = GlobalVariables.gl.getUniformLocation(
    GlobalVariables.program,
    'maxY'
  );
  let minXLoc = GlobalVariables.gl.getUniformLocation(
    GlobalVariables.program,
    'minX'
  );
  let minYLoc = GlobalVariables.gl.getUniformLocation(
    GlobalVariables.program,
    'minY'
  );
  GlobalVariables.gl.uniform1f(maxXLoc, GlobalVariables.bounds.maxX);
  GlobalVariables.gl.uniform1f(maxYLoc, GlobalVariables.bounds.maxY);
  GlobalVariables.gl.uniform1f(minXLoc, GlobalVariables.bounds.minX);
  GlobalVariables.gl.uniform1f(minYLoc, GlobalVariables.bounds.minY);
}
async function fetchDefaultSVG(): Promise<File> {
  const response = await fetch('react.svg');
  const svgContent = await response.text();
  const file = new File([svgContent], 'default.svg', { type: 'image/svg+xml' });
  return file;
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
      animate();
    });
  });
}
// const img = new Image();
// img.src = '../public/1.png';
// img.onload = () => {
//   console.log(img);
//   const svgString = ImageTracer.imageToSVG(img, {});
//   console.log(svgString); // The SVG output
//   document.body.insertAdjacentElement('afterbegin', img); // Append the SVG to the document
// };

export { main, imageReceiver, stopAnimation, setUniforms };
