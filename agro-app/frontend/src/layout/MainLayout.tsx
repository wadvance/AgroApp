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
  Button,
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
import { Outlet, NavLink, useResolvedPath, useMatch } from 'react-router-dom';

const SidebarNavItem: React.FC<{to: string; icon: React.ReactNode; label: string; onClick?: () => void}> = ({ to, icon, label, onClick }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: to === '/' });
  return (
    <ListItemButton
      component={NavLink}
      to={to}
      onClick={onClick}
      className={match ? 'u-bg-green-primary-light u-rounded-md' : 'u-transition-normal'}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

const MainLayout: React.FC = () => {
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
        <SidebarNavItem to="/" icon={<DashboardIcon fontSize="small" />} label="Dashboard" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/seeds" icon={<LocalFloristIcon fontSize="small" />} label="Semillas" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/diagnosis" icon={<AnalyticsIcon fontSize="small" />} label="Diagnóstico" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/recommendations" icon={<LocalPharmacyIcon fontSize="small" />} label="Recomendaciones" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/weather" icon={<CloudIcon fontSize="small" />} label="Clima" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/map" icon={<MapIcon fontSize="small" />} label="Mapas" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/calculator" icon={<CalculateIcon fontSize="small" />} label="Calculadora" onClick={handleDrawerToggle} />
        
        <SidebarNavItem to="/chat" icon={<ChatIcon fontSize="small" />} label="Chat IA" onClick={handleDrawerToggle} />
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} className="u-bg-header">
        <Toolbar>
          <Button 
            color="inherit" 
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