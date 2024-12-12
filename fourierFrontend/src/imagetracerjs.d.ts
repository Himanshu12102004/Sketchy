declare module 'imagetracerjs' {
  const ImageTracer: {
    imageToSVG: (
      image: HTMLImageElement,
      options?: Record<string, any>
    ) => string;
    traceImage: (
      image: HTMLImageElement,
      options?: Record<string, any>
    ) => void;
    getSVGString: (layers: any, options: any) => string;
    // Add other methods as needed
  };
  export default ImageTracer;
}
