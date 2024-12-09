import React from 'react';
import { Tooltip } from 'react-tooltip';
interface optionProps {
  index: number;
  content: any;
  name: string;
  tip: string;
  rgbColor: string;
}
const OptionComponent: React.FC<optionProps> = (props) => {
  let { index, content, name, tip, rgbColor } = props;
  return (
    <div className="pl-3">
      <div
        id={`${name}-tooltip-${index}`}
        className="text-sm cursor-pointer"
        style={{ position: 'relative' }}
      >
        {content}
      </div>
      <Tooltip
        anchorId={`${name}-tooltip-${index}`}
        content={tip}
        place="top"
        style={{
          backgroundColor: rgbColor,
          color: 'white',
          fontSize: '0.8rem',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default OptionComponent;
