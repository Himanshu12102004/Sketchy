import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { FaEye, FaRegEyeSlash } from 'react-icons/fa';
interface props {
  heading: string;
  setValueOfSlider: (value: number) => void;
  currentValue: number;
}
export default function ContinuousSlider(prop: props) {
  const [value, setValue] = React.useState<number>(prop.currentValue);

  const handleChange = (event: Event, newValue: number | number[]) => {
    event;
    setValue(newValue as number);
    prop.setValueOfSlider(newValue as number);
  };
  return (
    <div>
      <div className="text-sm">{prop.heading}</div>
      <Box sx={{ width: 200 }}>
        <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
          <FaRegEyeSlash size={25} color="rgb(150,150,150)"></FaRegEyeSlash>
          <Slider aria-label="Volume" value={value} onChange={handleChange} />
          <FaEye size={25} color="rgb(150,150,150)"></FaEye>
        </Stack>
      </Box>
    </div>
  );
}
