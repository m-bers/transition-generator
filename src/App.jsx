// App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from './components/AppBar';  // Ensure this is the correct path
import Drawer from './components/Drawer';
import MainComponent from './components/MainComponent';
import Settings from './components/Settings';
import Prompt from './components/Prompt';
import Stack from '@mui/material/Stack';

const drawerWidth = 240;

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mainPromptData, setMainPromptData] = useState([]);
  const [antiPromptData, setAntiPromptData] = useState([]);
  const [settingsData, setSettingsData] = useState({ resolution: '512x768', count: 21, seed: 104, guidance: 7 });
  const [shouldGenerate, setShouldGenerate] = useState(false); // New state for triggering generation
  const [hasStarted, setHasStarted] = useState(false);
  const [startSelectedIndex, setStartSelectedIndex] = useState(null);
  const [endSelectedIndex, setEndSelectedIndex] = useState(null);
  const [localMainPromptData, setLocalMainPromptData] = useState(mainPromptData);
  const [localAntiPromptData, setLocalAntiPromptData] = useState(antiPromptData);
  const [randomSeeds, setRandomSeeds] = useState([]);
  const [isRandomGeneration, setIsRandomGeneration] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSave = () => {
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

  const handleLoad = (event) => {
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
    console.log('Updating mainPromptData:', JSON.stringify(data)); // Add this line
    setMainPromptData(data);
  }, []);


  const handleAntiPromptDataChange = useCallback((data) => {
    setAntiPromptData(data);
  }, []);

  // Callback function for updating settings
  const handleSettingsChange = useCallback((data) => {
    setSettingsData(data);
  }, []);

  const handleGenerate = () => {
    setIsRandomGeneration(false); 
    setMainPromptData(localMainPromptData);
    setAntiPromptData(localAntiPromptData);
    setShouldGenerate(true); // Always set to true to trigger generation
    setHasStarted(true);
    setStartSelectedIndex(null);
    setEndSelectedIndex(null);
    Generate();
  };

  const handleRandomize = () => {
    const newRandomSeeds = Array.from({ length: settingsData.count }, () => Math.floor(Math.random() * 10000000));
    setRandomSeeds(newRandomSeeds);
    setIsRandomGeneration(true); 
    setMainPromptData(localMainPromptData);
    setAntiPromptData(localAntiPromptData);
    setShouldGenerate(true);
    setHasStarted(true);
    setStartSelectedIndex(null);
    setEndSelectedIndex(null);
    Generate(); 
  };

  const handleDownload = () => {
    DownloadImages();
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        handleSave={handleSave}
        handleLoad={handleLoad}
        handleDownload={handleDownload}
        handleGenerate={handleGenerate}
        handleRandomize={handleRandomize}
      />
      <Drawer drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
        <Prompt
          promptType="main"
          onPromptDataChange={handleMainPromptDataChange}
          initialPrompts={mainPromptData}
          count={settingsData.count}
          setMainPromptData={setMainPromptData}
          mainPromptData={mainPromptData} // Pass mainPromptData as a prop
        />

        <Prompt
          promptType="anti"
          onPromptDataChange={handleAntiPromptDataChange}
          initialPrompts={antiPromptData}
          count={settingsData.count}
          setAntiPromptData={setAntiPromptData} // Pass the function as a prop
          antiPromptData={antiPromptData} // Pass mainPromptData as a prop
        />
        <Settings onSettingsChange={handleSettingsChange} initialSettings={settingsData} />



      </Drawer>
      <MainComponent
        drawerWidth={drawerWidth}
        count={settingsData.count}
        mainPromptData={mainPromptData}
        antiPromptData={antiPromptData}
        localMainPromptData={localMainPromptData}
        localAntiPromptData={localAntiPromptData}
        setLocalMainPromptData={setLocalMainPromptData}
        setLocalAntiPromptData={setLocalAntiPromptData}
        seed={settingsData.seed}
        guidanceScale={settingsData.guidance}
        resolution={settingsData.resolution}
        shouldGenerate={shouldGenerate}
        setShouldGenerate={setShouldGenerate}
        hasStarted={hasStarted}
        startSelectedIndex={startSelectedIndex}
        setStartSelectedIndex={setStartSelectedIndex}
        endSelectedIndex={endSelectedIndex}
        setEndSelectedIndex={setEndSelectedIndex}
        isRandomGeneration={isRandomGeneration}
        randomSeeds={randomSeeds}

      >
        <Stack spacing={2} direction="column" sx={{ mb: 1, maxWidth: 240 }} alignItems="center">
          <Typography variant="h6" noWrap component="div">
            Transition Generator
          </Typography>
          <Typography>
            This perchance generator can be used to make relatively seamless transitions between a <b>before</b> image and an <b>after</b> image, by building a prompt which you can construct using <b>tags</b>.
          </Typography>
          <Typography>
            First, set the <b>resolution</b> of the sequence you want to generate. There are three available resolutions.
          </Typography>
          {/* INSERT RESOLUTION COMPONENT HERE */}
          <Typography>
            Then, set the <b>count</b>, i.e. the number of images you want in your sequence.
          </Typography>
          {/* INSERT COUNT COMPONENT HERE */}
          <Typography>
            Then, optionally set the seed if you don't want to change your tags but you want a different image.
          </Typography>
          {/* INSERT SEED COMPONENT HERE */}
          <Typography>
            Finally, optionally set the guidance. Guidance is the amount of conformity to your prompt--higher guidance means fewer tags are likely to be ignored or underemphasized, but also results in a lower quality image. Lower guidance means compromises might be made in favor of quality. The default value is 7, and this is usually what you want to keep it at.
          </Typography>
          <Settings onSettingsChange={handleSettingsChange} initialSettings={settingsData} />
        </Stack>
        <Stack spacing={2} direction="column" sx={{ mb: 1, maxWidth: 240 }} alignItems="center">
          <Typography>
            Next, add some tags to describe the image.
          </Typography>
          <Prompt
            promptType="main"
            onPromptDataChange={handleMainPromptDataChange}
            initialPrompts={mainPromptData}
            count={settingsData.count}
            setMainPromptData={setMainPromptData}
            mainPromptData={mainPromptData} // Pass mainPromptData as a prop
          />
          <Typography>
            There are two types of tags: <b>global</b>, and <b>transition</b>. Global tags are applied to ALL images in the sequence equally. Transition tags have a <b>before</b> and an <b>after</b> component, each of which contain a <b>value</b> that you can control via the slider to the left. The top value in the slider is where the transition starts (e.g. 0% of the way through, 10% of the way through, etc.) and the bottom of the slider is where the transition ends.
          </Typography>

        </Stack>
        <Stack spacing={2} direction="column" sx={{ mb: 1, maxWidth: 240 }} alignItems="center">
          <Typography>
            You can also <b>remove</b> tags from the image, i.e. describe things you do NOT want the text-to-image-plugin to generate.
          </Typography>
          <Prompt
            promptType="anti"
            onPromptDataChange={handleAntiPromptDataChange}
            initialPrompts={antiPromptData}
            count={settingsData.count}
            setAntiPromptData={setAntiPromptData} // Pass the function as a prop
            antiPromptData={antiPromptData} // Pass mainPromptData as a prop
          />
        </Stack>


      </MainComponent>

    </Box>
  );
}
