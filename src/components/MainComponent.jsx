// MainComponent.js
import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const MainComponent = ({ drawerWidth, count, mainPromptData, antiPromptData, seed, guidanceScale, resolution }) => {


    const outputRef = useRef(null);

    const generateDivs = () => {
        if (!mainPromptData || !antiPromptData) {
            // If data is not available, don't attempt to generate divs
            return null;
        }

        const divs = [];
        for (let i = 0; i < count; i++) {
            // Calculate rValue for each prompt independently
            const mainRValues = mainPromptData.map(prompt =>
                prompt.type === 'transition' ? i / (count - 1) * (prompt.before.value[1] - prompt.before.value[0]) / 100 : null
            );
            const antiRValues = antiPromptData.map(prompt =>
                prompt.type === 'transition' ? i / (count - 1) * (prompt.before.value[1] - prompt.before.value[0]) / 100 : null
            );

            const mainPrompt = parsePrompt(mainPromptData, mainRValues);
            const antiPrompt = parsePrompt(antiPromptData, antiRValues);


            const finalData = {
                prompt: mainPrompt,
                negativePrompt: antiPrompt,
                seed: seed,
                guidanceScale: guidanceScale,
                resolution: resolution
              };
            

            divs.push(<div key={i}><div ref={outputRef} />{JSON.stringify(finalData)}</div>);
        }
        return divs;
    };
    const parsePrompt = (prompts, rValues) => {
        return prompts.map((prompt, index) => {
          if (prompt.type === 'global') {
            return prompt.tag;
          } else if (prompt.type === 'transition') {
            const rValue = rValues[index];
            return `[${prompt.after.tag}:${prompt.before.tag}:${rValue.toFixed(2)}]`;
          }
        }).join(', ');
      };
      


    useEffect(() => {
        // Assuming your backend output is in a div with id 'backend-output'
        const backendOutput = document.getElementById('backend-output');
        if (backendOutput && outputRef.current) {
            outputRef.current.innerHTML = backendOutput.innerHTML;
        }
    }, []);

    return (
        <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
            <Toolbar />
            {generateDivs()}
        </Box>
    );
};

export default MainComponent;
