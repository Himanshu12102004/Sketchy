import { useState, useEffect } from 'react';
import VectorInfo from './VectorInfo';
import { setTracking } from '../../CanvasLogic/main';
function VectorList(prop: { imageNumber: number }) {
  const [focusingOn, setFocusingOn] = useState(-1);
  let onfocus = (index: number) => {
    if (focusingOn == index) {
      setFocusingOn(-1);
      setTracking(-1);
    } else {
      setFocusingOn(index);
      setTracking(index);
    }
  };
  const [vectors, setVectors] = useState<number[][]>([]);
  useEffect(() => {
    const handleVectorsCreated = (e: CustomEvent) => {
      setVectors(e.detail.vectors);
    };
    window.addEventListener(
      'vectorsCreated',
      handleVectorsCreated as EventListener
    );
    return () => {
      window.removeEventListener(
        'vectorsCreated',
        handleVectorsCreated as EventListener
      );
    };
  }, []);
  return (
    <div className="pt-2">
      <div className="text-lg font-medium mb-2 pt-2">Vector Sets Working:</div>
      {vectors.map((color, index) => {
        return (
          <VectorInfo
            key={`${prop.imageNumber}+${index}`}
            color={color}
            index={index}
            isFocused={focusingOn == index}
            onFocusingThis={onfocus}
          ></VectorInfo>
        );
      })}
    </div>
  );
}
export default VectorList;
