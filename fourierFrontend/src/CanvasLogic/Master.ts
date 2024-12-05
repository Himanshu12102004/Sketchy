import { svgPathProperties } from 'svg-path-properties';
import SVG from './svgComputation/calculatePoint';
import VectorCollection from './wrorldComponents/VectorCollection';
import Point from './wrorldComponents/Point';
import svgPath from 'svgpath';

class Master {
  properties: any;
  componentSVGs: SVG[];
  vectorCollection: VectorCollection[];
  constructor() {
    this.componentSVGs = [];
    this.vectorCollection = [];
  }
  private static readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
  async fromFile(file: File) {
    const fileContent = await Master.readFile(file);
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(fileContent, 'image/svg+xml');
    const pathElements = svgDoc.querySelectorAll('path');
    if (pathElements.length === 0) {
      throw new Error('No path elements found in the provided SVG file.');
    }
    for (let i = 0; i < pathElements.length; i++) {
      const pathData = pathElements[i].getAttribute('d');
      if (!pathData) {
        throw new Error('The path element does not contain a "d" attribute.');
      }
      const svgComponents = Master.splitSubPaths(pathData);
      for (let j = 0; j < svgComponents.length; j++) {
        this.componentSVGs.push(new SVG(svgComponents[j]));
      }
    }
  }

  static convertRelativeToAbsolute(pathData: string) {
    const path = new svgPath(pathData);
    let currentX = 0,
      currentY = 0; // Starting point (assume the first M is absolute)

    // Convert all commands
    const convertedPath = pathData.replace(
      /m(-?\d+\.?\d*)\s*(-?\d+\.?\d*)/g,
      (match, x, y) => {
        // Calculate new absolute coordinates
        const newX = currentX + parseFloat(x);
        const newY = currentY + parseFloat(y);

        // Update current position
        currentX = newX;
        currentY = newY;

        // Return the absolute "M" command
        return `M${newX} ${newY}`;
      }
    );

    return convertedPath;
  }
  static splitSubPaths(svgPath: string): string[] {
    // let convertedPath = Master.convertRelativeToAbsolute(svgPath);
    // console.log(convertedPath);
    const commands = svgPath.match(/([M][^M]*)/g);
    return commands ? commands.map((cmd) => cmd.trim()) : [];
    return [svgPath];
  }
  samplePath() {
    // for (let i = 0; i < this.componentSVGs.length; i++) {
    //   let svg = this.componentSVGs[i];
    //   svg.samplePath();
    //   console.log(svg.svgPath[0]);
    //   if (svg.svgPath[0] == 'm') {
    //     console.log('FDfdf');
    //     let x = '';
    //     let y = '';
    //     let xEnd = 0;
    //     for (let j = 1; j < svg.svgPath.length; j++) {
    //       if (svg.svgPath[j] == ' ') {
    //         xEnd = j;
    //         break;
    //       } else if (x != '' && svg.svgPath[j] == '-') {
    //         y = '-';
    //         xEnd = j;
    //         break;
    //       }
    //       x += svg.svgPath[j];
    //     }
    //     for (let j = xEnd + 1; j < svg.svgPath.length; j++) {
    //       if (svg.svgPath[j].charCodeAt(0) < 58) y += svg.svgPath[j];
    //       else {
    //         break;
    //       }
    //     }
    //     let lastX =
    //       this.componentSVGs[i - 1].sampledPoints[
    //         this.componentSVGs[i - 1].sampledPoints.length - 1
    //       ].x;
    //     let lastY =
    //       this.componentSVGs[i - 1].sampledPoints[
    //         this.componentSVGs[i - 1].sampledPoints.length - 1
    //       ].y;
    //     let translateX = lastX + parseFloat(x);
    //     let translateY = lastY + parseFloat(y);
    //     for (let j = 0; j < svg.sampledPoints.length; j++) {
    //       svg.sampledPoints[j].x += translateX;
    //       svg.sampledPoints[j].y += translateY;
    //     }
    //   }
    // }
    this.componentSVGs.forEach((svg) => {
      svg.samplePath();
    });
    let acc = new Point(0, 0);
    let count = 0;
    for (let i = 0; i < this.componentSVGs.length; i++) {
      for (let j = 0; j < this.componentSVGs[i].sampledPoints.length; j++) {
        acc.add(
          new Point(
            this.componentSVGs[i].sampledPoints[j].x,
            this.componentSVGs[i].sampledPoints[j].y
          )
        );
        count++;
      }
    }
    acc.divide(count);
    console.log(acc);
    for (let i = 0; i < this.componentSVGs.length; i++) {
      for (let j = 0; j < this.componentSVGs[i].sampledPoints.length; j++) {
        this.componentSVGs[i].sampledPoints[j].x =
          this.componentSVGs[i].sampledPoints[j].x - acc.x;
        this.componentSVGs[i].sampledPoints[j].y =
          acc.y - this.componentSVGs[i].sampledPoints[j].y;
      }
    }
    this.componentSVGs.forEach((svg) => {
      let vecColl = new VectorCollection();
      vecColl.makeVectors(svg.sampledPoints);
      this.vectorCollection.push(vecColl);
    });
  }
  generateAndDrawVectorCollections() {
    // console.log("Gg")
    // this.vectorCollection[0].generateAndDraw();
    this.vectorCollection.forEach((elem) => {
      elem.generateAndDraw();
    });
  }
}

export default Master;
