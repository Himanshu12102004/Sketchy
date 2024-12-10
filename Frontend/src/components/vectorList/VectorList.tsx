import { useState, useEffect } from 'react';
import VectorInfo from './VectorInfo';
import { setTracking } from '../../CanvasLogic/main';
import GlobalVariables from '../../CanvasLogic/utils/GlobalVariable';
function VectorList(prop: { imageNumber: number; vectors: number[][] }) {
  let vectors = prop.vectors;
  const [focusingOn, setFocusingOn] = useState(
    GlobalVariables.trackingData.index
  );
  let onfocus = (index: number) => {
    if (focusingOn == index) {
      setFocusingOn(-1);
      setTracking(-1);
    } else {
      setFocusingOn(index);
      setTracking(index);
    }
  };
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
