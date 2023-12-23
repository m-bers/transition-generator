import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

const Settings = ({ onSettingsChange }) => {
  const [resolution, setResolution] = useState('512x768');
  const [count, setCount] = useState(21);
  const [seed, setSeed] = useState(104);
  const [guidance, setGuidance] = useState(7);

  useEffect(() => {
    // Call the callback prop whenever any setting changes
    onSettingsChange({ resolution, count, seed, guidance });
  }, [resolution, count, seed, guidance, onSettingsChange]);

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
