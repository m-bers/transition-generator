// Prompt.jsx
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Stack,
  Slider,
  Button,
  Divider,
  ButtonGroup,
  Grid,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublicIcon from '@mui/icons-material/Public';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DeleteIcon from '@mui/icons-material/Delete';

function valuetext(value) {
  return `${value}%`;
}

export default function Prompt({ 
  promptType, 
  onPromptDataChange, 
  initialPrompts, 
  setMainPromptData, 
  mainPromptData, 
  setAntiPromptData, 
  antiPromptData }) {

  const [prompts, setPrompts] = useState(initialPrompts.map(prompt => {
    if (prompt.type === 'transition') {
      return {
        ...prompt,
        before: { ...prompt.before, value: Number(prompt.before.value) || 0 },
        after: { ...prompt.after, value: Number(prompt.after.value) || 0 }
      };
    }
    return prompt;
  }) || []);

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (Array.isArray(initialPrompts)) {
      setPrompts(initialPrompts);
    }
  }, [initialPrompts]);

  useEffect(() => {
    if (isUpdated && Array.isArray(prompts)) {
      onPromptDataChange(prompts);
      setIsUpdated(false);
    }
  }, [prompts, onPromptDataChange, isUpdated]);


  const addGlobal = () => {
    const newPrompt = { type: 'global', tag: '' };
    setPrompts([...prompts, newPrompt]);
  };


  const addTransition = () => {
    setPrompts([...prompts, {
      type: 'transition', 
      before: { tag: '', value: 0 }, 
      after: { tag: '', value: 100 }  // Set initial values to 0 and 100
    }]);
  };
  

  const updatePrompt = (index, key, value) => {
    const newPrompts = prompts.map((prompt, idx) => {
      if (idx === index) {
        if (key === 'before' || key === 'after') {
          return { ...prompt, [key]: { ...prompt[key], tag: value } };
        }
        return { ...prompt, [key]: value };
      }
      return prompt;
    });
    setPrompts(newPrompts);
    setIsUpdated(true);
  };

  const updateSlider = (index, value) => {
    const newPrompts = prompts.map((prompt, idx) => {
      if (idx === index && prompt.type === 'transition') {
        return {
          ...prompt,
          before: { ...prompt.before, value: Number(value[0]) || 0 },
          after: { ...prompt.after, value: Number(value[1]) || 100 }  // Use single number value
        };
      }
      return prompt;
    });
    setPrompts(newPrompts);
    setIsUpdated(true);
  };

  const deletePrompt = index => {
    const newPrompts = prompts.filter((_, idx) => idx !== index);
    setPrompts(newPrompts);
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>{promptType === 'main' ? 'Add' : 'Remove'} Tags</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Grid container spacing={1} alignItems="center">
            {Array.isArray(prompts) && prompts.map((prompt, index) => (
              <React.Fragment key={index}>
                {prompt.type === 'global' && (
                  <>
                    <Grid item xs={2}>
                      <PublicIcon />
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        label="Global"
                        placeholder="e.g. woman portrait"
                        variant="filled"
                        value={prompt.tag}
                        onChange={(e) => updatePrompt(index, 'tag', e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                {prompt.type === 'transition' && (
                  <>
                    <Grid item xs={2}>
                      <Stack spacing={2} direction="column" sx={{ mb: 1 }} alignItems="center">
                        <HourglassTopIcon />
                        <Slider
                          sx={{ height: 30 }}
                          getAriaLabel={() => 'Temperature'}
                          orientation="vertical"
                          value={[Number(prompt.before.value) || 0, Number(prompt.after.value) || 0]}
                          onChange={(e, newValue) => updateSlider(index, newValue)}
                          valueLabelDisplay="auto"
                          min={0}
                          max={100}
                        />
                        <HourglassBottomIcon />
                      </Stack>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        label="Before"
                        placeholder="e.g. hippie aesthetic"
                        variant="filled"
                        value={prompt.before.tag}
                        onChange={(e) => updatePrompt(index, 'before', e.target.value)}
                      />
                      <TextField
                        label="After"
                        placeholder="e.g. goth aesthetic"
                        variant="filled"
                        value={prompt.after.tag}
                        onChange={(e) => updatePrompt(index, 'after', e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <IconButton onClick={() => deletePrompt(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={addGlobal}>Global</Button>
                <Button onClick={addTransition}>Transition</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
