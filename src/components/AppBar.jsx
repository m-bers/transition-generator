// AppBar.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';

const MyAppBar = ({ drawerWidth, handleDrawerToggle, handleDownload, handleFileUpload, handleGenerateClick }) => {

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
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button color="inherit" component="span">
                    Upload
                  </Button>
                </label>
                <Button color="inherit" onClick={handleDownload}>Download</Button>
                <Button color="inherit" onClick={handleGenerateClick}>Generate</Button>
            </Toolbar>
        </AppBar>
    );
};

export default MyAppBar;