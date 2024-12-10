import Master from './Master';
import SVG from '../svgComputation/calculatePoint';
import VectorCollection from '../wrorldComponents/VectorCollection';
import Point from '../wrorldComponents/Point';
import { setUniforms } from '../main';
class GlobalVariables {
  static bounds = { maxX: 0, minX: 0, maxY: 0, minY: 0 };
  static graphScale = { scale: 0.8 };
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
  static touchZoomData = {
    initialDistance: 0,
  };
  static alpha = { defaultVectorAlpha: 0.0, defaultLineAlpha: 1 };
  static monochromeColour = {
    r: 255,
    g: 255,
    b: 255,
  };
  static trackingData = {
    index: -1,
    isRetractingDone: false,
    isTrackingValueChanged: false,
    isZoomOutDone: false,
    lastCenter: new Point(0, 0),
    isZoomInDone: false,
    t: 0,
  };
  static animationParams = {
    speed: 0.0001,
    t: 0,
  };
  static imageChangeInit() {
    GlobalVariables.trackingData = {
      isRetractingDone: false,
      index: -1,
      isTrackingValueChanged: false,
      isZoomOutDone: false,
      lastCenter: new Point(0, 0),
      isZoomInDone: false,
      t: 0,
    };
    GlobalVariables.animationParams.speed = 0.0001;
    GlobalVariables.graphScale.scale = 0.8;
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
  }
  static init(canvas: HTMLCanvasElement) {
    GlobalVariables.alpha.defaultLineAlpha = 1.2;
    GlobalVariables.alpha.defaultVectorAlpha = 0.0;
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
    GlobalVariables.grabageClearingTime =
      1 / GlobalVariables.animationParams.speed;
    GlobalVariables.imageNumber = 0;
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
    GlobalVariables.imageChangeInit();
  }
}
export default GlobalVariables;
