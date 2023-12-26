// AppBar.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import PermMediaIcon from '@mui/icons-material/PermMedia';

const MyAppBar = ({ drawerWidth, handleDrawerToggle, handleSave, handleLoad, handleDownload, handleGenerate, handleRandomize }) => {

    return (
        <AppBar

            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  id="file-upload"
                  onChange={handleLoad}
                />
                <label htmlFor="file-upload">
                    <IconButton color="inherit" component="span"><UploadFileIcon/></IconButton>
                </label>
                <IconButton color="inherit" onClick={handleSave}><SaveIcon/></IconButton>
                <IconButton color="inherit" onClick={handleGenerate}><RestartAltIcon/></IconButton>
                <IconButton color="inherit" onClick={handleRandomize}><ShuffleIcon/></IconButton>
                <IconButton color="inherit" onClick={handleDownload}><PermMediaIcon/></IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;