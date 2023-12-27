// MainComponent.js
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';


const MainComponent = ({ drawerWidth, count, mainPromptData, antiPromptData, isRandomGeneration, randomSeeds, localMainPromptData, localAntiPromptData, setLocalMainPromptData, setLocalAntiPromptData, seed, guidanceScale, resolution, shouldGenerate, setShouldGenerate, hasStarted, startSelectedIndex, setStartSelectedIndex, endSelectedIndex, setEndSelectedIndex, children }) => {
  const [cards, setCards] = useState([]); // State to store generated cards
  const [updatePromptTrigger, setUpdatePromptTrigger] = useState({ start: false, end: false });

  useEffect(() => {
    setLocalMainPromptData(mainPromptData);
    setLocalAntiPromptData(antiPromptData);
  }, [mainPromptData, antiPromptData]);

  useEffect(() => {
    if (shouldGenerate) {
      setCards(generateCards()); // Generate new cards
    }
  }, [shouldGenerate, mainPromptData, antiPromptData, count, seed, guidanceScale, resolution]); // Dependencies

  useEffect(() => {
    if (hasStarted) {
      setCards(generateCards()); // Generate new cards
    }
  }, [startSelectedIndex, endSelectedIndex]); // Dependencies

  const handleStartClick = (cardIndex) => {
    setStartSelectedIndex(cardIndex);
    setUpdatePromptTrigger({ start: true, end: false }); // Set trigger for start
  };

  const handleEndClick = (cardIndex) => {
    setEndSelectedIndex(cardIndex);
    setUpdatePromptTrigger({ start: false, end: true }); // Set trigger for end
  };

  useEffect(() => {
    if (updatePromptTrigger.start || updatePromptTrigger.end) {
      const updateData = (currentData, originalData) => {
        return currentData.map((prompt, index) => {
          if (prompt.type === 'transition') {
            const originalPrompt = originalData[index];
            const cardIndex = updatePromptTrigger.start ? startSelectedIndex : endSelectedIndex;
            const rValue = 100 - (interpolateRValue(originalPrompt.after.value, originalPrompt.before.value, cardIndex, count) * 100);
            return {
              ...prompt,
              [updatePromptTrigger.start ? 'before' : 'after']: {
                ...prompt[updatePromptTrigger.start ? 'before' : 'after'],
                value: rValue,
              },
            };
          }
          return prompt;
        });
      };

      setLocalMainPromptData(currentData => updateData(currentData, mainPromptData));
      setLocalAntiPromptData(currentData => updateData(currentData, antiPromptData));
      setUpdatePromptTrigger({ start: false, end: false });
    }
  }, [updatePromptTrigger, startSelectedIndex, endSelectedIndex, mainPromptData, antiPromptData, count]);


  const generateCards = () => {
    if (!mainPromptData || !antiPromptData) {
      return null;
    }
    const divs = [];
    for (let i = 0; i < count; i++) {

      // Transform mainPromptData and antiPromptData
      const transformedMainPromptData = mainPromptData.map(prompt =>
        prompt.type === 'transition'
          ? {
            ...prompt,
            value: interpolateRValue(prompt.after.value, prompt.before.value, i, count),
            after: prompt.after.tag,
            before: prompt.before.tag
          }
          : prompt
      );

      const transformedAntiPromptData = antiPromptData.map(prompt =>
        prompt.type === 'transition'
          ? {
            ...prompt,
            value: interpolateRValue(prompt.after.value, prompt.before.value, i, count),
            after: prompt.after.tag,
            before: prompt.before.tag
          }
          : prompt
      );

      const finalData = {
        prompt: transformedMainPromptData,
        negativePrompt: transformedAntiPromptData,
        seed: isRandomGeneration ? randomSeeds[i] : seed,
        guidanceScale: guidanceScale,
        resolution: resolution
      };
      const divId = `prompt-data-${i}`;

      divs.push(
        <Card sx={{
          // background: startSelectedIndex === i ? (theme) => theme.palette.secondary.main : endSelectedIndex === i ? "#00FF00" : undefined
        }}>
          <CardMedia
            component="div"
            className="prompt-data"
            data={JSON.stringify(finalData)}
            key={i}
            id={divId}
            maxWidth="200"
          />
          {startSelectedIndex === i &&
            <Alert variant="outlined" icon={<HourglassTopIcon fontSize="inherit" />} color="primary"><Typography variant="button" color="primary">Start image</Typography></Alert>}
          {endSelectedIndex === i &&
            <Alert variant="outlined" icon={<HourglassBottomIcon fontSize="inherit" />} color="primary"><Typography variant="button" color="primary">End image</Typography></Alert>}
          {(startSelectedIndex !== i && endSelectedIndex !== i) && // Check if neither Start nor End is selected
            <CardActions>
              <Button size="small" onClick={() => handleStartClick(i)} endIcon={<HourglassTopIcon />}>set</Button>
              <Button size="small" onClick={() => handleEndClick(i)} endIcon={<HourglassBottomIcon />}>set</Button>
            </CardActions>}
            {/* <Typography variant="body2"><pre>{JSON.stringify(finalData,null,2)}</pre></Typography> */}
            
        </Card>);
    }
    setShouldGenerate(false);
    return divs;
  };


  const interpolateRValue = (initialValue, finalValue, index, total) => {
    const initVal = (100 - parseFloat(initialValue)) / 100;
    const finalVal = (100 - parseFloat(finalValue)) / 100;
    if (isNaN(initVal) || isNaN(finalVal)) {
      console.error('Initial or final value is not a number', { initialValue, finalValue });
      return 0;
    }
    const reversedIndex = (total - 1) - index;
    const result = initVal + (finalVal - initVal) * reversedIndex / (total - 1);

    if (Number.isInteger(result)) {
      return result.toFixed(2); // Converts integer to a string with two decimal places
    }
    return result; // Returns the original number with its inherent precision
  };



  const boxId = 'main-box';
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      id={boxId}
      data-count={count}
    >

      <Toolbar />
      <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap justifyContent="center" flexWrap="wrap">
        {hasStarted ? cards : children}
      </Stack>


    </Box>
  );
};

export default MainComponent;
