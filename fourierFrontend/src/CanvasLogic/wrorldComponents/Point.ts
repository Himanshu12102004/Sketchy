import GlobalVariables from '../utils/GlobalVariable';

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.y = y;
    this.x = x;
  }
  subt(point2: Point) {
    this.x = this.x - point2.x;
    this.y = this.y - point2.y;
  }
  add(point2: Point) {
    this.x = this.x + point2.x;
    this.y = this.y + point2.y;
  }
  copy(point2: Point) {
    this.x = point2.x;
    this.y = point2.y;
  }
  getPoint(): [number, number] {
    return [this.x, this.y];
  }
  multiply(point2: Point) {
    let x = this.x * point2.x - this.y * point2.y;
    let y = this.x * point2.y + this.y * point2.x;
    this.x = x;
    this.y = y;
  }
  divide(n: number) {
    this.x /= n;
    this.y /= n;
  }
  calcMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  calcPhi() {
    return Math.atan2(this.y, this.x);
  }
}
export default Point;
