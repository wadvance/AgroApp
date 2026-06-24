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
  IconButton,
  Tooltip,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  LocalFlorist as LocalFloristIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Cloud as CloudIcon,
  Calculate as CalculateIcon,
  Chat as ChatIcon,
  Map as MapIcon,
  CalendarMonth as CalendarMonthIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterDropIcon,
} from '@mui/icons-material';
import { Outlet, NavLink, useResolvedPath, useMatch, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const DRAWER_WIDTH_FULL = 260;
const DRAWER_WIDTH_MINI = 64;
const APPBAR_HEIGHT = 64;
const BOTTOM_NAV_HEIGHT = 56;

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  mini?: boolean;
  onClick?: () => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ to, icon, label, mini, onClick }) => {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: to === '/' });

  const item = (
    <ListItemButton
      component={NavLink}
      to={to}
      onClick={onClick}
      selected={!!match}
      sx={{
        minHeight: 48,
        justifyContent: mini ? 'center' : 'flex-start',
        px: mini ? 1 : 2,
        mx: 0.5,
        borderRadius: 'var(--radius-md)',
        '&.Mui-selected': {
          backgroundColor: 'var(--green-primary-light)',
          '&:hover': {
            backgroundColor: 'var(--green-primary-lighter)',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: mini ? 0 : 40,
          justifyContent: 'center',
          color: match ? 'var(--green-primary-dark)' : 'var(--text-secondary)',
        }}
      >
        {icon}
      </ListItemIcon>
      {!mini && (
        <ListItemText
          primary={label}
          sx={{
            '& .MuiListItemText-primary': {
              color: match ? 'var(--green-primary-dark)' : 'var(--text-primary)',
              fontWeight: match ? 600 : 400,
              fontSize: 'var(--font-size-sm)',
            },
          }}
        />
      )}
    </ListItemButton>
  );

  if (mini) {
    return <Tooltip title={label} placement="right" arrow>{item}</Tooltip>;
  }

  return item;
};

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDesktopCollapse = () => {
    setDesktopCollapsed((prev) => !prev);
  };

  const drawerWidth = isMobile
    ? 'calc(100vw - 56px)'
    : desktopCollapsed
      ? DRAWER_WIDTH_MINI
      : DRAWER_WIDTH_FULL;

  const navItems = [
    { to: '/', icon: <DashboardIcon fontSize="small" />, label: 'Dashboard' },
    { to: '/seeds', icon: <LocalFloristIcon fontSize="small" />, label: 'Semillas' },
    { to: '/diagnosis', icon: <AnalyticsIcon fontSize="small" />, label: 'Diagnóstico' },
    { to: '/recommendations', icon: <LocalPharmacyIcon fontSize="small" />, label: 'Recomendaciones' },
    { to: '/weather', icon: <CloudIcon fontSize="small" />, label: 'Clima' },
    { to: '/map', icon: <MapIcon fontSize="small" />, label: 'Mapas' },
    { to: '/crops', icon: <AgricultureIcon fontSize="small" />, label: 'Cultivos' },
    { to: '/irrigation', icon: <WaterDropIcon fontSize="small" />, label: 'Riego' },
    { to: '/calculator', icon: <CalculateIcon fontSize="small" />, label: 'Calculadora' },
    { to: '/calendar', icon: <CalendarMonthIcon fontSize="small" />, label: 'Calendario' },
    { to: '/profile', icon: <PersonIcon fontSize="small" />, label: 'Perfil' },
    { to: '/chat', icon: <ChatIcon fontSize="small" />, label: 'Chat IA' },
  ];

  const bottomNavItems = [
    { to: '/', icon: <DashboardIcon />, label: 'Dashboard' },
    { to: '/seeds', icon: <LocalFloristIcon />, label: 'Semillas' },
    { to: '/diagnosis', icon: <AnalyticsIcon />, label: 'Diagnóstico' },
    { to: '/weather', icon: <CloudIcon />, label: 'Clima' },
    { to: '/chat', icon: <ChatIcon />, label: 'Chat' },
  ];

  const currentBottomNavIndex = bottomNavItems.findIndex(
    (item) => item.to === location.pathname
  );

  const sidebarContent = (mini: boolean) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ justifyContent: mini ? 'center' : 'flex-start', px: mini ? 0 : 2 }}>
        {mini ? (
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: 'var(--green-primary)', fontSize: '1.25rem' }}
          >
            A
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--green-primary)' }}>
            AgroApp
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 0 }}>
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            mini={mini}
            onClick={isMobile ? handleDrawerToggle : undefined}
          />
        ))}
      </List>
      {!isMobile && (
        <Box sx={{ px: 1, pb: 1 }}>
          <Divider sx={{ mb: 1 }} />
          <ListItemButton
            onClick={handleDesktopCollapse}
            sx={{
              minHeight: 48,
              justifyContent: mini ? 'center' : 'flex-start',
              px: mini ? 1 : 2,
              mx: 0.5,
              borderRadius: 'var(--radius-md)',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: mini ? 0 : 40,
                justifyContent: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              {desktopCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </ListItemIcon>
            {!mini && (
              <ListItemText
                primary="Colapsar"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                  },
                }}
              />
            )}
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'var(--bg-header)',
          borderBottom: '1px solid var(--border-primary)',
          zIndex: theme.zIndex.drawer + 1,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : `${drawerWidth}px`,
          transition: theme.transitions.create(['width', 'margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: 'var(--text-primary)' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{ flex: 1, fontWeight: 600, color: 'var(--green-primary)' }}
          >
            AgroApp
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'var(--bg-sidebar)',
              borderRight: '1px solid var(--border-primary)',
            },
          }}
        >
          {sidebarContent(false)}
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'var(--bg-sidebar)',
              borderRight: '1px solid var(--border-primary)',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
        >
          {sidebarContent(desktopCollapsed)}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isSmallMobile ? 2 : 3,
          pt: `${APPBAR_HEIGHT + (isSmallMobile ? 8 : 16)}px`,
          pb: isSmallMobile ? `${BOTTOM_NAV_HEIGHT + 16}px` : 3,
          width: '100%',
          minHeight: `calc(100vh - ${APPBAR_HEIGHT}px)`,
          bgcolor: 'var(--bg-secondary)',
        }}
      >
        <Outlet />
      </Box>

      {isSmallMobile && (
        <BottomNavigation
          value={currentBottomNavIndex === -1 ? 0 : currentBottomNavIndex}
          onChange={(_, newValue) => {
            navigate(bottomNavItems[newValue].to);
          }}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            bgcolor: 'var(--bg-header)',
            borderTop: '1px solid var(--border-primary)',
            height: BOTTOM_NAV_HEIGHT,
            '& .Mui-selected': {
              color: 'var(--green-primary) !important',
            },
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction
              key={item.to}
              icon={item.icon}
              label={item.label}
              sx={{
                color: 'var(--text-secondary)',
                minWidth: 0,
                py: 0.5,
                '&.Mui-selected': {
                  color: 'var(--green-primary)',
                },
              }}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
};

export default MainLayout;
