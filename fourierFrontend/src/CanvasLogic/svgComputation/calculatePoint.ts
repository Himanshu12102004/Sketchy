import { svgPathProperties } from 'svg-path-properties';
import Point from '../wrorldComponents/Point';
import GlobalVariables from '../GlobalVariable';
interface SampledPoint {
  t: number;
  x: number;
  y: number;
}
class SVG {
  svgPath: string;
  properties: any;
  totalLength: number;
  sampledPoints: SampledPoint[];
  constructor(svgPath: string) {
    this.svgPath = svgPath;
    this.properties = new svgPathProperties(this.svgPath);
    this.totalLength = this.properties.getTotalLength();
    this.sampledPoints = [];
  }
  calculatePoint(t: number) {
    const point = this.properties.getPointAtLength(t * this.totalLength);
    return new Point(point.x, point.y);
  }

  samplePath() {
    let numPoints = Math.max(
      this.totalLength / GlobalVariables.samplePerUnitLength,
      100
    );
    const incInT = 1 / numPoints;
    const points: SampledPoint[] = [];
    // for (let k = 0; k <= numPoints; k++) {
    //   let i = k / numPoints;
    //   let pt = this.calculatePoint(i);
    //   points.push({ t: i, x: pt.x, y: pt.y });
    // }
    for (let i = 0; i <= 1; i += incInT) {
      let pt = this.calculatePoint(i);
      points.push({
        t: i,
        x: pt.x,
        y: pt.y,
      });
    }
    // points.push({x:pt.x,y:pt.y,t:1});
    // let pt = this.calculatePoint(1);
    // points.push({
    //   t: 1,
    //   x: pt.x,
    //   y: pt.y,
    // });
    // pt = this.calculatePoint(0);
    // points.push({
    //   t: 0,
    //   x: pt.x,
    //   y: pt.y,
    // });
    this.sampledPoints = points;
  }
}

export default SVG;
