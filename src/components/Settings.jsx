import * as React from 'react';
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

export default function BasicAccordion() {
  return (
    <div>
      <Card>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Resolution
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: 'resolution',
                id: 'uncontrolled-native',
              }}
            >
              <option value={10}>768x512 (Landscape)</option>
              <option value={20}>512x512 (Square)</option>
              <option value={30}>512x768 (Portrait)</option>
            </NativeSelect>
          </FormControl>
          <TextField id="filled-basic" label="Count" placeholder="21" variant="filled" />
          <TextField id="filled-basic" label="Seed" placeholder="104" variant="filled" />
          <TextField id="filled-basic" label="Guidance" placeholder="7" variant="filled" />

        </Box>
      </Card>
    </div>
  );
}
