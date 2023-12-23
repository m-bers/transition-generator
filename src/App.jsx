// App.js
import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './components/AppBar';  // Ensure this is the correct path
import Drawer from './components/Drawer';
import MainComponent from './components/MainComponent';
import Settings from './components/Settings';
import Prompt from './components/Prompt';

const drawerWidth = 240;

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mainPromptData, setMainPromptData] = useState([]);
  const [antiPromptData, setAntiPromptData] = useState([]);
  const [settingsData, setSettingsData] = useState({ resolution: '512x768', count: 21, seed: 104, guidance: 7 });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDownload = () => {
    const data = {
      resolution: settingsData.resolution,
      count: settingsData.count,
      seed: settingsData.seed,
      guidance: settingsData.guidance,
      main: mainPromptData,
      anti: antiPromptData
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Callback function for updating main prompts
  const handleMainPromptDataChange = useCallback((data) => {
    setMainPromptData(data);
  }, []);

  // Callback function for updating anti prompts
  const handleAntiPromptDataChange = useCallback((data) => {
    setAntiPromptData(data);
  }, []);

  // Callback function for updating settings
  const handleSettingsChange = useCallback((data) => {
    setSettingsData(data);
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} handleDownload={handleDownload} />
      <Drawer drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
        <Prompt promptType="main" onPromptDataChange={handleMainPromptDataChange} />
        <Prompt promptType="anti" onPromptDataChange={handleAntiPromptDataChange} />
        <Settings onSettingsChange={handleSettingsChange} />
      </Drawer>
      <MainComponent drawerWidth={drawerWidth} />
    </Box>
  );
}
