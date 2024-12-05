import GlobalVariables from '../GlobalVariable';
import Point from './Point';
class Vector {
  magnitude: number;
  phi: number;
  n: number;
  tnp: number;
  width: number;
  triangleWidth: number;
  constructor(magnitude: number, phi: number, n: number) {
    this.magnitude = magnitude;
    this.phi = phi;
    this.n = n;
    this.tnp = 2 * this.n * Math.PI;
    this.width = Math.min(0.05 * magnitude,GlobalVariables.maxVectorWidth);
    this.triangleWidth = GlobalVariables.triangleToRectWidthRatio * this.width;
  }
  calcPointsOfRect(pt1: Point, pt2: Point, pt3: Point, vertexArray: number[]) {
    let dy = pt2.y - pt1.y;
    let perpM = (pt1.x - pt2.x) / dy;
    let lsinThetha = (Math.sin(Math.atan(perpM)) * this.width) / 2;
    let lcosThetha = (Math.cos(Math.atan(perpM)) * this.width) / 2;
    let lTrisinThetha = (Math.sin(Math.atan(perpM)) * this.triangleWidth) / 2;
    let lTricosThetha = (Math.cos(Math.atan(perpM)) * this.triangleWidth) / 2;
    let rectPt1 = new Point(pt1.x + lcosThetha, pt1.y + lsinThetha);
    let rectPt2 = new Point(pt1.x - lcosThetha, pt1.y - lsinThetha);
    let rectPt3 = new Point(pt2.x + lcosThetha, pt2.y + lsinThetha);
    let rectPt4 = new Point(pt2.x - lcosThetha, pt2.y - lsinThetha);
    let triPt1 = new Point(pt2.x + lTricosThetha, pt2.y + lTrisinThetha);
    let triPt2 = new Point(pt2.x - lTricosThetha, pt2.y - lTrisinThetha);
    vertexArray.push(
      ...rectPt1.getPoint(),
      ...rectPt2.getPoint(),
      ...rectPt3.getPoint(),
      ...rectPt3.getPoint(),
      ...rectPt4.getPoint(),
      ...rectPt2.getPoint(),
      ...triPt1.getPoint(),
      ...triPt2.getPoint(),
      ...pt3.getPoint()
    );
    return vertexArray;
  }
  calculateDisplayRectEndPoint() {
    let theta = this.phi + this.tnp * GlobalVariables.animationParams.t;
    let magnitude =
      this.magnitude -
      this.triangleWidth *
        Math.tan((Math.PI / 180) * GlobalVariables.triangleAngle);
    let pt = new Point(
      magnitude * Math.cos(theta),
      magnitude * Math.sin(theta)
    );
    return pt;
  }
  calculateEndPoint() {
    let theta = this.phi + this.tnp * GlobalVariables.animationParams.t;
    let pt = new Point(
      this.magnitude * Math.cos(theta),
      this.magnitude * Math.sin(theta)
    );
    return pt;
  }
}
export default Vector;
