import GlobalVariables from '../utils/GlobalVariable';
import Point from '../wrorldComponents/Point';

function setCenterTo(point: Point) {
  let centerX = point.x;
  let centerY = point.y;
  GlobalVariables.animationParams.speed =
    0.0001 / GlobalVariables.graphScale.scale;
  if (GlobalVariables.animationParams.speed > 0.0001) {
    GlobalVariables.animationParams.speed = 0.0001;
  }
  if (GlobalVariables.animationParams.speed < 0.000005) {
    GlobalVariables.animationParams.speed = 0.000005;
  }
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
export { setCenterTo, setUniforms };
