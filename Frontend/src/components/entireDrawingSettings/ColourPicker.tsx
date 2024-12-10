import { useState } from 'react';
import { HexColorPicker, RgbColorPicker } from 'react-colorful';
import GlobalVariables from '../../CanvasLogic/utils/GlobalVariable';
interface rgb {
  r: number;
  g: number;
  b: number;
}
interface props {
  colorChanged: (rgbColor: rgb) => void;
}
const ColorPicker = (props: props) => {
  const [color, setColor] = useState(GlobalVariables.monochromeColour);
  return (
    <RgbColorPicker
      color={color}
      onChange={(color) => {
        setColor(color);
        props.colorChanged(color);
      }}
    />
  );
};
export default ColorPicker;
