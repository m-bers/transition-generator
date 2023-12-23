// perchanceIntegration.js

// Assuming global variables for storing data from React components
window.mainPromptData = [];
window.antiPromptData = [];
window.settingsData = { resolution: '512x768', count: 21, seed: 104, guidance: 7 };
window.generateClicked = false;

// Function to get the main or anti prompt data
function getPrompt(isNegative) {
    const promptData = isNegative ? window.antiPromptData : window.mainPromptData;
    return promptData.map((item, index) => {
        if (item.type === 'transition') {
            const phase = window.settingsData.count > 0 ? index / (window.settingsData.count - 1) : 0;
            const rValue = (item.before.value * (1 - phase) + item.after.value * phase).toFixed(2);
            return `\\[${item.after.tag}:${item.before.tag}:\\` + '`r_' + rValue + '\\`]';
        } else {
            return item.tag;
        }
    }).join(', ');
}

// Function to get the seed value
function getSeed() {
    return window.settingsData.seed;
}

// Function to get the resolution
function getResolution() {
    return window.settingsData.resolution;
}

// Function to get the guidance scale
function getGuidanceScale() {
    return window.settingsData.guidance;
}

// Function to check if the Generate button was clicked
function Generate() {
    return window.generateClicked;
}

// Output function for Perchance
function Output(final) {
    if (Generate()) {
        window.generateClicked = false; // Reset the flag
        let x = 0;
        return new Array(window.settingsData.count).fill(0).map(() => {
            ++x;
            return `<div>${final}</div>`; // Replace with actual image generation logic
        }).join("");
    } else {
        return "";
    }
}

// Expose the functions to be called by Perchance
window.getPrompt = getPrompt;
window.getSeed = getSeed;
window.getResolution = getResolution;
window.GetGuidanceScale = getGuidanceScale;
window.Generate = Generate;
window.Output = Output;
