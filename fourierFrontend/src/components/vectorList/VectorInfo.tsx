import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import OptionComponent from './OptionComponent';
import { FaBan, FaBeer, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AiOutlineAim } from 'react-icons/ai';
import { FiTarget } from 'react-icons/fi';
import { MdBlurOn, MdZoomIn } from 'react-icons/md';
import GlobalVariables from '../../CanvasLogic/utils/GlobalVariable';
import { CgTrack } from 'react-icons/cg';
import { setTracking } from '../../CanvasLogic/main';
import Slider from '../slider/Slider';

interface VectorInfoProps {
  color: number[]; // RGB values as a tuple
  index: number; // Vector number
  onFocusingThis: (index: number) => void;
  isFocused: boolean;
}
const VectorInfo: React.FC<VectorInfoProps> = ({
  color,
  index,
  isFocused,
  onFocusingThis,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currState, setCurrState] = useState(-1);
  const rgbColor = `rgb(${Math.round(color[0] * 255)}, ${Math.round(
    color[1] * 255
  )}, ${Math.round(color[2] * 255)})`;

  const rgbaColor = `rgba(${Math.round(color[0] * 255)}, ${Math.round(
    color[1] * 255
  )}, ${Math.round(color[2] * 255)}, 0.2)`;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const setSelectedState = (state: number) => {
    if (state == currState) {
      GlobalVariables.master.resetVectorState(index, state);
      setCurrState(-1);
    } else {
      GlobalVariables.master.setVectorState(index, state);
      setCurrState(state);
    }
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: `linear-gradient(45deg, ${rgbaColor}, white)`,
        border: `1px solid ${rgbColor}`,
        padding: '10px',
        margin: '10px',
        borderRadius: '8px',
        color: '#333',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        height: isHovered ? '170px' : '50px',
        cursor: 'pointer',
      }}
    >
      <div className="flex text-gray-600 justify-between">
        <div>Vector Set: {index + 1}</div>
        <div className="flex">
          <OptionComponent
            tip="Hide this vector and drawing"
            index={index}
            name="hide"
            rgbColor={rgbColor}
            content={
              <div>
                <FaEyeSlash
                  onClick={() => {
                    setSelectedState(0);
                  }}
                  color={currState == 0 ? rgbColor : 'rgb(200,200,200)'}
                  size={18}
                ></FaEyeSlash>
              </div>
            }
          ></OptionComponent>
          <OptionComponent
            tip="Show only this vector"
            index={index}
            name="hideOthers"
            rgbColor={rgbColor}
            content={
              <div>
                <FaEye
                  onClick={() => {
                    setSelectedState(1);
                  }}
                  color={currState == 1 ? rgbColor : 'rgb(200,200,200)'}
                  size={18}
                ></FaEye>
              </div>
            }
          ></OptionComponent>

          <OptionComponent
            tip="Focus This blur others"
            index={index}
            name="blurOthers"
            rgbColor={rgbColor}
            content={
              <div>
                <MdBlurOn
                  onClick={() => {
                    setSelectedState(2);
                  }}
                  color={currState == 2 ? rgbColor : 'rgb(200,200,200)'}
                  size={18}
                ></MdBlurOn>
              </div>
            }
          ></OptionComponent>
          <OptionComponent
            tip="Track This vector"
            index={index}
            name="track"
            rgbColor={rgbColor}
            content={
              <div>
                <CgTrack
                  onClick={() => {
                    onFocusingThis(index);
                  }}
                  color={isFocused ? rgbColor : 'rgb(200,200,200)'}
                  size={18}
                ></CgTrack>
              </div>
            }
          ></OptionComponent>
        </div>
      </div>
      {isHovered && (
        <div
          style={{
            marginTop: '10px',
            color: '#666',
          }}
        >
          <Slider
            heading="Vector Opacity"
            setValueOfSlider={(value) => {
              GlobalVariables.master.vectorCollection[index].vectorAlpha =
                value / 100;
            }}
            currentValue={
              GlobalVariables.master.vectorCollection[index].vectorAlpha * 100
            }
          ></Slider>

          <Slider
            heading="Drawing Opacity"
            setValueOfSlider={(value) => {
              GlobalVariables.master.vectorCollection[index].lineAlpha =
                value / 100;
            }}
            currentValue={
              GlobalVariables.master.vectorCollection[index].lineAlpha * 100
            }
          ></Slider>
        </div>
      )}
    </div>
  );
};

export default VectorInfo;
