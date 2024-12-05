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
    let acc = new Point(0, 0);
    let cnt = 0;
    for (let i = 0; i <= 1; i += incInT) {
      points.push({
        t: i,
        x: this.calculatePoint(i).x,
        y: this.calculatePoint(i).y,
      });
      acc.add(new Point(points[cnt].x, points[cnt].y));
      cnt++;
    }
    // acc.divide(numPoints);
    // for (let i = 0; i < cnt; i++) {
    //   points[i].x = points[i].x - acc.x;
    //   points[i].y = acc.y - points[i].y;
    // }
    this.sampledPoints = points;
  }
}

export default SVG;
