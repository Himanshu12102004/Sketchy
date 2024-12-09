import React, { useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import Slider from '../slider/Slider';
import GlobalVariables from '../../CanvasLogic/utils/GlobalVariable';
import ColorPicker from './colourPicker';
interface rgb {
  r: number;
  g: number;
  b: number;
}
export default function Settings() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(false);
  function monochromeChanged(e: any) {
    setIsMonochrome(e.target.checked);
    if (e.target.checked) GlobalVariables.master.setMonochromeColor();
    else GlobalVariables.master.restoreColors();
  }
  window.addEventListener("vectorsCreated",()=>{
    setIsMonochrome(false);
  })
  function colorChanged(rgb: rgb) {
    GlobalVariables.monochromeColour = rgb;
    GlobalVariables.master.setMonochromeColor();
  }
  const toggleExpansion = () => setIsExpanded(!isExpanded);


  return (
    <div className="w-80 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
      <div
        className="flex items-center justify-between px-4 py-2 text-gray-600 font-bold cursor-pointer rounded-t-lg border-b-2"
        onClick={toggleExpansion}
      >
        <div>Settings</div>
        <RiArrowDownSLine
          size={20}
          className={`transform transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
          isExpanded ? 'max-h-40' : 'max-h-0'
        }`}
        style={{ maxHeight: isExpanded ? '400px' : '0px' }}
      >
        <div className="px-4 pt-2 bg-white">
          <Slider
            heading="Vector Opacity"
            setValueOfSlider={(value) => {
              GlobalVariables.alpha.defaultVectorAlpha = value / 100;
              GlobalVariables.master.setDefaultVectorAlpha();
            }}
            currentValue={GlobalVariables.alpha.defaultVectorAlpha * 100}
          />
        </div>
        <div className="px-4 bg-white">
          <Slider
            heading="Drawing Opacity"
            setValueOfSlider={(value) => {
              GlobalVariables.alpha.defaultLineAlpha = value / 100;
              GlobalVariables.master.setDefaultLineAlpha();
            }}
            currentValue={GlobalVariables.alpha.defaultLineAlpha * 100}
          />
        </div>
        <div className="px-4 py-2 bg-white">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={isMonochrome}
              onChange={(e) => {
                monochromeChanged(e);
              }}
            />
            <span className="text-gray-700 font-medium">Monochrome</span>
          </label>
          {isMonochrome && (
            <div className="py-3">
              <ColorPicker colorChanged={colorChanged} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
