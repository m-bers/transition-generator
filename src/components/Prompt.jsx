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
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublicIcon from '@mui/icons-material/Public';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicator from '@mui/icons-material/DragIndicator'
export default function Prompt({
  promptType,
  onPromptDataChange,
  initialPrompts
}) {

  const [prompts, setPrompts] = useState(initialPrompts.map(prompt => {
    if (prompt.type === 'transition') {
      return {
        ...prompt,
        after: { ...prompt.after, value: Number(prompt.after.value) || 0 },
        before: { ...prompt.before, value: Number(prompt.before.value) || 0 }
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
      after: { tag: '', value: 0 },
      before: { tag: '', value: 100 }  // Set initial values to 0 and 100
    }]);
  };


  const updatePrompt = (index, key, value) => {
    const newPrompts = prompts.map((prompt, idx) => {
      if (idx === index) {
        if (key === 'after' || key === 'before') {
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
          after: { ...prompt.after, value: Number(value[0]) || 0 },
          before: { ...prompt.before, value: Number(value[1]) || 100 }  // Use single number value
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
                      <PublicIcon sx={{ marginLeft: 0.5 }} />
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        label="Global"
                        placeholder="e.g. woman portrait"
                        multiline
                        variant="filled"
                        value={prompt.tag}
                        onChange={(e) => updatePrompt(index, 'tag', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => deletePrompt(index)}>
                        <DeleteIcon sx={{ marginLeft: -1 }} />
                      </IconButton>
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
                    <Grid item xs={9}>
                      <TextField
                        label="Before"
                        placeholder="e.g. goth aesthetic"
                        multiline
                        variant="filled"
                        value={prompt.before.tag}
                        onChange={(e) => updatePrompt(index, 'before', e.target.value)}
                      />
                      <TextField
                        label="After"
                        placeholder="e.g. hippie aesthetic"
                        multiline
                        variant="filled"
                        value={prompt.after.tag}
                        onChange={(e) => updatePrompt(index, 'after', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton onClick={() => deletePrompt(index)}>
                        <DeleteIcon sx={{ marginLeft: -1 }} />
                      </IconButton>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={0.7}></Grid><Grid item xs={11.3}>
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
