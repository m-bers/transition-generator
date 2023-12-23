import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

const Settings = ({ onSettingsChange, initialSettings }) => {
  const [resolution, setResolution] = useState(initialSettings.resolution);
  const [count, setCount] = useState(initialSettings.count);
  const [seed, setSeed] = useState(initialSettings.seed);
  const [guidance, setGuidance] = useState(initialSettings.guidance);

  useEffect(() => {
    onSettingsChange({ resolution, count, seed, guidance });
  }, [resolution, count, seed, guidance, onSettingsChange]);

  useEffect(() => {
    if (initialSettings) {
      setResolution(initialSettings.resolution);
      setCount(initialSettings.count);
      setSeed(initialSettings.seed);
      setGuidance(initialSettings.guidance);
    }
  }, [initialSettings]);
  
  useEffect(() => {
    window.getSeed = () => seed;
    window.getResolution = () => resolution;
    window.getGuidanceScale = () => guidance;
  }, [seed, resolution, guidance]);

  return (
    <div>
      <Card>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
          noValidate
          autoComplete="off"
        >
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">Resolution</InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{ name: 'resolution', id: 'uncontrolled-native' }}
              onChange={e => setResolution(e.target.value)}
            >
              <option value="768x512">768x512 (Landscape)</option>
              <option value="512x512">512x512 (Square)</option>
              <option value="512x768">512x768 (Portrait)</option>
            </NativeSelect>
          </FormControl>
          <TextField id="count" label="Count" placeholder="21" variant="filled" onChange={e => setCount(parseInt(e.target.value, 10) || 0)} />
          <TextField id="seed" label="Seed" placeholder="104" variant="filled" onChange={e => setSeed(parseInt(e.target.value, 10) || 0)} />
          <TextField id="guidance" label="Guidance" placeholder="7" variant="filled" onChange={e => setGuidance(parseFloat(e.target.value) || 0)} />
        </Box>
      </Card>
    </div>
  );
};

export default Settings;
