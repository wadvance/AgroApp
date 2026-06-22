import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  CssBaseline,
  Button,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  LocalFlorist as LocalFloristIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Cloud as CloudIcon,
  Calculate as CalculateIcon,
  Chat as ChatIcon,
  Map as MapIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Outlet, NavLink } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" className="u-font-weight-semibold u-text-green-primary">
          AgroApp
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {/* Dashboard */}
        <ListItemButton 
          component={NavLink} 
          to="/" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        
        {/* Identificador de Semillas */}
        <ListItemButton 
          component={NavLink} 
          to="/seeds" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <LocalFloristIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Semillas" />
        </ListItemButton>
        
        {/* Diagnóstico de Cultivos */}
        <ListItemButton 
          component={NavLink} 
          to="/diagnosis" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <AnalyticsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Diagnóstico" />
        </ListItemButton>
        
        {/* Recomendaciones */}
        <ListItemButton 
          component={NavLink} 
          to="/recommendations" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <LocalPharmacyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Recomendaciones" />
        </ListItemButton>
        
        {/* Monitor Climático */}
        <ListItemButton 
          component={NavLink} 
          to="/weather" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <CloudIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Clima" />
        </ListItemButton>
        
        {/* Mapas y Navegación */}
        <ListItemButton 
          component={NavLink} 
          to="/map" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <MapIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mapas" />
        </ListItemButton>
        
        {/* Calculadora de Cosecha */}
        <ListItemButton 
          component={NavLink} 
          to="/calculator" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <CalculateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Calculadora" />
        </ListItemButton>
        
        {/* Chat IA Agrónomo */}
        <ListItemButton 
          component={NavLink} 
          to="/chat" 
          endPadding={false}
          className={({ isActive }) => 
            isActive 
              ? 'u-bg-green-primary-light u-rounded-md' 
              : 'u-transition-normal'
          }
          onClick={handleDrawerToggle}
        >
          <ListItemIcon>
            <ChatIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Chat IA" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" top={0} elevation={0} className="u-bg-header">
        <Toolbar>
          <Button 
            color="inherit" 
            edge="start" 
            onClick={handleDrawerToggle}
            sx={{ 
              display: { xs: 'block', sm: 'none' }, 
              marginRight: 2 
            }}
          >
            <MenuIcon />
          </Button>
          <Typography variant="h6" className="u-flex-1 u-font-weight-semibold u-text-green-primary">
            AgroApp
          </Typography>
          {/* Optional: Add user profile or settings here */}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-primary)',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-primary)',
          },
        }}
        open={!mobileOpen}
      >
        {drawer}
      </Drawer>
      
      <Box 
        component="main" 
        sx={{
          marginTop: 64, // AppBar height
          marginLeft: mobileOpen ? 0 : 240, // Adjust for drawer
          width: '100%',
          padding: 3,
          minHeight: 'calc(100vh - 64px)', // Account for AppBar
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;