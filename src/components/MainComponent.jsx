// MainComponent.js
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import HeroImage from '../hero-image.jpg'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';


const MainComponent = ({ drawerWidth, count, mainPromptData, antiPromptData, setMainPromptData, setAntiPromptData, seed, guidanceScale, resolution, shouldGenerate, startSelectedIndex, setStartSelectedIndex, endSelectedIndex, setEndSelectedIndex, children }) => {
  const [cards, setCards] = useState([]); // State to store generated cards

  useEffect(() => {
    if (shouldGenerate) {
      setCards(generateCards()); // Generate new cards
    } else {
      setCards([]); // Clear cards if shouldGenerate is false
    }
  }, [shouldGenerate, mainPromptData, antiPromptData, count, seed, guidanceScale, resolution]); // Dependencies

  const handleStartClick = (cardIndex) => {
    setStartSelectedIndex(cardIndex);
    setMainPromptData(currentData => {
      const updatedData = currentData.map((prompt) => {
        if (prompt.type === 'transition') {
          const rValue = 100 - (interpolateRValue(prompt.before.value, prompt.after.value, cardIndex, count) * 100);
          return {
            ...prompt,
            after: {
              ...prompt.after,
              value: rValue
            }
          };
        }
        return prompt;
      });
      return updatedData;
    });
    setAntiPromptData(currentData => {
      return currentData.map((prompt) => {
        if (prompt.type === 'transition') {
          const rValue = 100 - (interpolateRValue(prompt.before.value, prompt.after.value, cardIndex, count) * 100);
          return {
            ...prompt,
            after: {
              ...prompt.after,
              value: rValue
            }
          };
        }
        return prompt;
      });
    });
  };

  const handleEndClick = (cardIndex) => {
    setEndSelectedIndex(cardIndex);
    // Update mainPromptData for 'after' values
    setMainPromptData(currentData => {
      return currentData.map((prompt) => {
        if (prompt.type === 'transition') {
          const rValue = 100 - (interpolateRValue(prompt.before.value, prompt.after.value, cardIndex, count) * 100);
          return {
            ...prompt,
            before: {
              ...prompt.before,
              value: rValue
            }
          };
        }
        return prompt;
      });
    });

    // Update antiPromptData for 'after' values
    setAntiPromptData(currentData => {
      return currentData.map((prompt) => {
        if (prompt.type === 'transition') {
          const rValue = 100 - (interpolateRValue(prompt.before.value, prompt.after.value, cardIndex, count) * 100);
          return {
            ...prompt,
            before: {
              ...prompt.before,
              value: rValue
            }
          };
        }
        return prompt;
      });
    });
  };

  const generateCards = () => {
    if (!shouldGenerate || !mainPromptData || !antiPromptData) {
      return null;
    }
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
            value: interpolateRValue(prompt.before.value, prompt.after.value, i, count),
            before: prompt.before.tag,
            after: prompt.after.tag
          }
          : prompt
      );

      const transformedAntiPromptData = antiPromptData.map(prompt =>
        prompt.type === 'transition'
          ? {
            ...prompt,
            value: interpolateRValue(prompt.before.value, prompt.after.value, i, count),
            before: prompt.before.tag,
            after: prompt.after.tag
          }
          : prompt
      );

      const finalData = {
        prompt: transformedMainPromptData,
        negativePrompt: transformedAntiPromptData,
        seed: seed,
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
          />
          {startSelectedIndex === i &&
              <Alert variant="outlined" icon={<HourglassTopIcon fontSize="inherit" />} color="primary"><Typography variant="button" color="primary">Start image</Typography></Alert>}
          {endSelectedIndex === i &&
              <Alert variant="outlined" icon={<HourglassBottomIcon fontSize="inherit" />} color="primary"><Typography variant="button" color="primary">End image</Typography></Alert>}
          {(startSelectedIndex !== i && endSelectedIndex !== i) && // Check if neither Start nor End is selected
            <CardActions>
              <Button size="small" onClick={() => handleStartClick(i)} startIcon={<HourglassTopIcon />}>Set Start</Button>
              <Button size="small" onClick={() => handleEndClick(i)} startIcon={<HourglassBottomIcon />}>Set End</Button>
            </CardActions>}
        </Card>);
    }
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
      <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
        {shouldGenerate ? cards : children}
      </Stack>


    </Box>
  );
};

export default MainComponent;
