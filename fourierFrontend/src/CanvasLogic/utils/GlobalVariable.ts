import Master from './Master';
import SVG from '../svgComputation/calculatePoint';
import VectorCollection from '../wrorldComponents/VectorCollection';

class GlobalVariables {
  static bounds = { maxX: 0, minX: 0, maxY: 0, minY: 0 };
  static graphScale = { scale: 1 };
  static screenDimensions = { height: 600, width: 800 };
  static gl: WebGL2RenderingContext;
  static shaders = {
    fragmentShader: null as WebGLShader | null,
    vertexShader: null as WebGLShader | null,
  };
  static program: WebGLProgram;
  static vao: WebGLVertexArrayObject;
  static canvas: HTMLCanvasElement = null as any;
  static numberOfVectors: number;
  static canvasParent: HTMLDivElement;
  static maxVectorWidth: number;
  static widthDampingFactor: number;
  static vectorCollection: VectorCollection;
  static triangleToRectWidthRatio: number;
  static triangleAngle: number;
  static svgObj: SVG;
  static animationHandler: number;
  static samplePerUnitLength: number;
  static master: Master;
  static grabageClearingTime: number;
  static grabageClearingHandle: number;
  static imageNumber: number;
  static trackingData = {
    index: -1,
    isTrackingValueChanged: false,
    isZoomOutDone: false,
  };
  static animationParams = {
    speed: 0.0001,
    t: 0,
  };
  static init(canvas: HTMLCanvasElement) {
    GlobalVariables.canvasParent = document.querySelector('#canvas_parent')!;
    GlobalVariables.screenDimensions.height =
      GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.screenDimensions.width =
      GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.maxVectorWidth = 3;
    GlobalVariables.numberOfVectors = 100;
    GlobalVariables.widthDampingFactor = 0.8;
    GlobalVariables.triangleToRectWidthRatio = 4;
    GlobalVariables.triangleAngle = 40;
    GlobalVariables.samplePerUnitLength = 1;
    GlobalVariables.grabageClearingHandle = 0;
    GlobalVariables.trackingData = {
      index: -1,
      isTrackingValueChanged: false,
      isZoomOutDone: false,
    };
    GlobalVariables.grabageClearingTime =
      1 / GlobalVariables.animationParams.speed;
    GlobalVariables.imageNumber = 0;
    GlobalVariables.bounds = {
      maxX:
        GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale),
      minX:
        -GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale),
      maxY:
        GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale),
      minY:
        -GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale),
    };
    GlobalVariables.canvas = canvas;
    const renderingContext = canvas.getContext('webgl2', { antialias: true });
    if (!renderingContext) {
      alert('Webgl2 not supported');
      return;
    } else {
      GlobalVariables.gl = renderingContext;
    }
    canvas.height = GlobalVariables.screenDimensions.height;
    canvas.width = GlobalVariables.screenDimensions.width;
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.screenDimensions.width,
      GlobalVariables.screenDimensions.height
    );
  }
}
export default GlobalVariables;
