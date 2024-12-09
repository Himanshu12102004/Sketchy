import { useState, useEffect } from 'react';
import VectorInfo from './VectorInfo';
function VectorList(prop:{imageNumber:number}) {
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
    <div className='pt-2'>
      <div className="text-lg font-medium mb-2 pt-2">Vector Sets Working:</div>
      {vectors.map((color,index) => {
        return <VectorInfo key={`${prop.imageNumber}+${index}`}  color={color} index={index}></VectorInfo>;
      })}
    </div>
  );
}
export default VectorList;
