// App.js
import React, { useState, useCallback, useEffect } from 'react';
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
  const [generateClicked, setGenerateClicked] = useState(false);

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setMainPromptData(data.main || []);
          setAntiPromptData(data.anti || []);
          setSettingsData({
            resolution: data.resolution || '512x768',
            count: data.count || 21,
            seed: data.seed || 104,
            guidance: data.guidance || 7
          });
          console.log("Updated state:", data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Callback functions for updating main and anti prompts
  const handleMainPromptDataChange = useCallback((data) => {
    setMainPromptData(data);
  }, []);

  const handleAntiPromptDataChange = useCallback((data) => {
    setAntiPromptData(data);
  }, []);

  // Callback function for updating settings
  const handleSettingsChange = useCallback((data) => {
    setSettingsData(data);
  }, []);

  // Define a global function and attach it to the window object
  const getOutput = (final) => {
    // if (!generateClicked) {
    //   // Call the imageGen function only if "Generate" button has been clicked
    //   return imageGen(final);
    // }
    // // You can return something else or handle it as needed when the button hasn't been clicked
    return "";
  };

  const handleGenerateClick = () => {
    update();
    setGenerateClicked(true);
  };

  useEffect(() => {
    // Attach the function to the window object
    window.getOutput = getOutput;
    window.generateClicked = () => generateClicked;
  }, [getOutput, generateClicked]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        handleDownload={handleDownload}
        handleFileUpload={handleFileUpload}
        handleGenerateClick={handleGenerateClick}
      />
      <Drawer drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
        <Prompt
          promptType="main"
          onPromptDataChange={handleMainPromptDataChange}
          initialPrompts={mainPromptData}
          count={settingsData.count}
        />
        <Prompt
          promptType="anti"
          onPromptDataChange={handleAntiPromptDataChange}
          initialPrompts={antiPromptData}
          count={settingsData.count}
        />
        <Settings onSettingsChange={handleSettingsChange} initialSettings={settingsData} />



      </Drawer>
      // In App.jsx, where you render MainComponent
      <MainComponent
        drawerWidth={drawerWidth}
        count={settingsData.count}
        mainPromptData={mainPromptData}
        antiPromptData={antiPromptData}
        seed={settingsData.seed}
        guidanceScale={settingsData.guidance}
        resolution={settingsData.resolution}
      />

    </Box>
  );
}
