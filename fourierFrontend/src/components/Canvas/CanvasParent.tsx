import { useEffect } from 'react';
import { main } from '../../CanvasLogic/main';
import Canvas from './Canvas';

const CanvasParent: React.FC = () => {
  let canva: HTMLCanvasElement;
  function getCanvas(canvas: HTMLCanvasElement) {
    canva = canvas;
  }
  useEffect(() => {
    main(canva);
  });
  return <Canvas onCanvasReady={getCanvas} />;
};

export default CanvasParent;
