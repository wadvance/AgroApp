import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Create a minimal theme that works with our CSS variables
const themeOptions: ThemeOptions = {
  // Override the palette to work with our CSS variables
  palette: {
    mode: 'light',
    primary: {
      main: 'var(--green-primary)',
      light: 'var(--green-primary-light)',
      dark: 'var(--green-primary-dark)',
      contrastText: 'var(--white)',
    },
    secondary: {
      main: 'var(--brown-primary)',
      light: 'var(--brown-primary-light)',
      dark: 'var(--brown-primary-dark)',
      contrastText: 'var(--white)',
    },
    background: {
      default: 'var(--bg-primary)',
      paper: 'var(--bg-card)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      disabled: 'var(--text-disabled)',
    },
    divider: 'var(--border-primary)',
  },
  // Override typography to use our CSS variables
  typography: {
    fontFamily: 'var(--font-family-sans)',
    h1: {
      fontSize: 'var(--font-size-5xl)',
      fontWeight: 600, // semibold
    },
    h2: {
      fontSize: 'var(--font-size-4xl)',
      fontWeight: 600, // semibold
    },
    h3: {
      fontSize: 'var(--font-size-3xl)',
      fontWeight: 600, // semibold
    },
    h4: {
      fontSize: 'var(--font-size-2xl)',
      fontWeight: 600, // semibold
    },
    h5: {
      fontSize: 'var(--font-size-xl)',
      fontWeight: 600, // semibold
    },
    h6: {
      fontSize: 'var(--font-size-lg)',
      fontWeight: 600, // semibold
    },
    body1: {
      fontSize: 'var(--font-size-base)',
    },
    body2: {
      fontSize: 'var(--font-size-sm)',
    },
    button: {
      fontWeight: 500, // medium
      textTransform: 'none',
    },
  },
  // Override shape for border radius
  shape: {
    borderRadius: 8, // Will be overridden by our CSS vars in components
  },
  // Override transitions
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  // Custom component overrides to work better with our CSS approach
  components: {
    // Override MUI Button to use our CSS variables more effectively
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-md)',
          fontWeight: 500,
          textTransform: 'none',
          padding: '0.5rem 1rem',
        },
      },
    },
    // Override MUI TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-md)',
          },
        },
      },
    },
    // Override MUI Card
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        },
      },
    },
    // Override MUI AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--bg-header)',
          borderBottom: '1px solid var(--border-primary)',
        },
      },
    },
    // Override MUI Drawer (for sidebar)
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-primary)',
        },
      },
    },
    // Override MUI ListItemButton (for sidebar nav)
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--radius-md)',
          margin: '0.25rem',
          '&.Mui-selected': {
            backgroundColor: 'var(--green-primary-light)',
            '& .MuiListItemIcon-root, & .MuiListItemText-root': {
              color: 'var(--green-primary-dark)',
            },
          },
        },
      },
    },
    // Override MUI Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'var(--gray-800)',
          color: 'var(--white)',
          fontSize: 'var(--font-size-sm)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem 0.75rem',
        },
      },
    },
  },
};

// Create the theme
const theme = createTheme(themeOptions);

export default theme;