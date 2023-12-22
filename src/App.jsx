// App.js
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import MainComponent from './components/MainComponent';
import Settings from './components/Settings'
import Prompt from './components/Prompt';

const drawerWidth = 240;

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        drawerWidth={drawerWidth} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      <Drawer 
        drawerWidth={drawerWidth} 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      >
        <Prompt promptType="main"/>
        <Prompt promptType="anti"/>
        <Settings/>
      </Drawer>
      <MainComponent drawerWidth={drawerWidth} />
    </Box>
  );
}
