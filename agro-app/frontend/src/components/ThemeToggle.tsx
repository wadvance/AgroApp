import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <Tooltip title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
      <IconButton onClick={toggleDarkMode} color="inherit" size="small">
        {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
