import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Volver">
      <IconButton onClick={() => navigate(-1)} color="primary" size="small" sx={{ mb: 1 }}>
        <ArrowBack />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton;
