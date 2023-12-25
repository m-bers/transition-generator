// MainComponent.js
import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


const MainComponent = ({ drawerWidth, count, mainPromptData, antiPromptData, seed, guidanceScale, resolution }) => {
  const outputRef = useRef(null);
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
        <Card sx={{ }}>
          <CardMedia
            component="div"
            className="prompt-data"
            data={JSON.stringify(finalData)}
            key={i}
            id={divId}
          />
          {/* <CardContent>
          </CardContent> */}
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
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
    return initVal + (finalVal - initVal) * reversedIndex / (total - 1);
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
        {generateCards()}
      </Stack>


    </Box>
  );
};

export default MainComponent;
