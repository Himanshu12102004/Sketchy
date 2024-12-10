import GlobalVariables from '../utils/GlobalVariable';
import createVao from '../helpers/createVao';
import updateVao from '../helpers/updateVao';
import Point from './Point';
import Vector from './Vector';
interface SampledPoint {
  t: number;
  x: number;
  y: number;
}
class VectorCollection {
  vectors: Vector[];
  vectorVao: WebGLVertexArrayObject | null;
  lines: number[];
  lineVao: WebGLVertexArrayObject | null;
  lineColor: number[];
  vectorColor: number[];
  calledForTheFirstTime: boolean;
  lineColorLocation: WebGLUniformLocation | null;
  vectorAlpha: number;
  lineAlpha: number;
  vectorColorLocation: WebGLUniformLocation | null;
  lineAlphaLocation: WebGLUniformLocation | null;
  vectorAlphaLocation: WebGLUniformLocation | null;
  constructor(defaultLineAlpha: number, defaultVectorAlpha: number) {
    this.vectors = [];
    this.vectorVao = null;
    this.lines = [];
    this.lineVao = null;
    this.vectorColor = [Math.random(), Math.random(), Math.random()];
    this.lineColor = this.vectorColor;
    this.calledForTheFirstTime = true;
    this.vectorAlpha = defaultVectorAlpha;
    this.lineAlpha = defaultLineAlpha;
    this.lineColorLocation = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'lineColor'
    );
    this.vectorColorLocation = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'vectorColor'
    );
    this.lineAlphaLocation = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'lAlpha'
    );
    this.vectorAlphaLocation = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program,
      'vAlpha'
    );
    GlobalVariables.gl.uniform1f(this.vectorAlphaLocation, 0.1);
    GlobalVariables.gl.uniform1f(this.lineAlphaLocation, 1);
  }
  computeCn(n: number, sampledPoints: SampledPoint[]): Point {
    let Cn = new Point(0, 0);
    let tnp = 2 * Math.PI * n;
    for (let i = 0; i < sampledPoints.length; i++) {
      let parameters = sampledPoints[i];
      let outputPoint = new Point(parameters.x, parameters.y);
      let angle = (tnp * parameters.t) % (2 * Math.PI);
      let rotationPoint = new Point(Math.cos(angle), Math.sin(angle));
      outputPoint.multiply(rotationPoint);
      Cn.add(outputPoint);
    }
    Cn.divide(sampledPoints.length);
    return Cn;
  }
  makeVectors(sampledPoints: SampledPoint[]) {
    this.vectors = [];
    let vec = this.computeCn(0, sampledPoints);
    this.vectors.push(new Vector(vec.calcMagnitude(), vec.calcPhi(), 0));
    let vectorNumber = 1;
    for (let i = 1; vectorNumber < GlobalVariables.numberOfVectors; i++) {
      let vec2 = this.computeCn(i, sampledPoints);
      this.vectors.push(new Vector(vec2.calcMagnitude(), vec2.calcPhi(), i));
      vectorNumber++;
      if (vectorNumber < GlobalVariables.numberOfVectors) {
        let vec3 = this.computeCn(-i, sampledPoints);
        this.vectors.push(new Vector(vec3.calcMagnitude(), vec3.calcPhi(), -i));
        vectorNumber++;
      }
    }
  }
  generateVectorPoints() {
    let pointsArray: number[] = [];
    let lastPoint = new Point(0, 0);
    let newPoint = this.vectors[0].calculateEndPoint();
    let displayEndPoint = this.vectors[0].calculateDisplayRectEndPoint();
    this.vectors[0].calcPointsOfRect(
      lastPoint,
      displayEndPoint,
      newPoint,
      pointsArray
    );
    for (let i = 1; i < GlobalVariables.numberOfVectors; i++) {
      lastPoint.copy(newPoint);
      let nextDisplayEndPoint = this.vectors[i].calculateDisplayRectEndPoint();
      nextDisplayEndPoint.add(lastPoint);
      newPoint.add(this.vectors[i].calculateEndPoint());
      this.vectors[i].calcPointsOfRect(
        lastPoint,
        nextDisplayEndPoint,
        newPoint,
        pointsArray
      );
    }
    if (!this.calledForTheFirstTime) {
      this.lines.push(...newPoint.getPoint(), performance.now());
    } else {
      this.calledForTheFirstTime = false;
    }
    return pointsArray;
  }
  reCalculateVectorWidths() {
    this.vectors[0].width = GlobalVariables.maxVectorWidth;
    for (let i = 1; i < GlobalVariables.numberOfVectors; i++) {
      this.vectors[i].width =
        this.vectors[i - 1].width * GlobalVariables.widthDampingFactor;
    }
  }
  setLineVao(pointsArray: number[]) {
    const float32vertex = new Float32Array(pointsArray);
    let vertexLocation = GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program,
      'vertex'
    );
    if (this.lineVao == null) {
      this.lineVao = createVao(
        [
          {
            bufferArray: float32vertex,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 3,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    } else {
      updateVao(
        this.lineVao,
        [
          {
            bufferArray: float32vertex,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 3,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    }
  }

  setVao(pointsArray: number[]) {
    const float32vertex = new Float32Array(pointsArray);
    let vertexLocation = GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program,
      'vertex'
    );
    if (this.vectorVao == null) {
      this.vectorVao = createVao(
        [
          {
            bufferArray: float32vertex,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 2,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    } else {
      updateVao(
        this.vectorVao,
        [
          {
            bufferArray: float32vertex,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 2,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    }
  }
  drawLines() {
    GlobalVariables.gl.useProgram(GlobalVariables.program);
    GlobalVariables.gl.bindVertexArray(this.lineVao);
    GlobalVariables.gl.drawArrays(
      GlobalVariables.gl.LINE_STRIP,
      0,
      this.lines.length / 3
    );
  }
  draw() {
    GlobalVariables.gl.useProgram(GlobalVariables.program);
    GlobalVariables.gl.bindVertexArray(this.vectorVao);
    GlobalVariables.gl.drawArrays(
      GlobalVariables.gl.TRIANGLES,
      0,
      GlobalVariables.numberOfVectors * 9
    );
  }
  generateAndDraw() {
    let vertexPoints = this.generateVectorPoints();
    this.setVao(vertexPoints);
    this.setLineVao(this.lines);
    GlobalVariables.gl.uniform1f(this.vectorAlphaLocation, this.vectorAlpha);
    GlobalVariables.gl.uniform1f(this.lineAlphaLocation, this.lineAlpha);
    GlobalVariables.gl.uniform3fv(
      this.vectorColorLocation,
      new Float32Array(this.vectorColor)
    );
    GlobalVariables.gl.uniform3fv(
      this.lineColorLocation,
      new Float32Array(this.lineColor)
    );
    this.drawLines();
    this.draw();
  }

  dropOpacity() {
    this.vectorColor[3] = 0.0;
    this.lineColor = this.vectorColor;
  }
  restoreOpacity() {
    this.vectorColor[3] = 1;
    this.lineColor = this.vectorColor;
  }
  disposeGarbage() {
    let index = 2;
    for (let i = 2; i < this.lines.length; i += 3) {
      if (
        this.lines[i] + GlobalVariables.grabageClearingTime >=
        performance.now()
      ) {
        index = i;
        break;
      }
    }

    this.lines = this.lines.slice(index + 1);
  }
}
export default VectorCollection;
