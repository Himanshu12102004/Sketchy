import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface CustomSliderProps {
  min: number;
  max: number;
  defaultValue: number;
  onChange: (value: number|number[]) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  min,
  max,
  defaultValue,
  onChange,
}) => {
  return (
    <div
      style={{
        width: '300px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        background: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Slider
        min={min}
        max={max}
        defaultValue={defaultValue}
        onChange={onChange}
        trackStyle={{ backgroundColor: '#007BFF', height: 5 }}
        handleStyle={{
          borderColor: '#007BFF',
          backgroundColor: '#fff',
          height: 14,
          width: 14,
          marginTop: -5,
        }}
        railStyle={{ backgroundColor: '#ddd', height: 5 }}
      />
    </div>
  );
};

export default CustomSlider;
