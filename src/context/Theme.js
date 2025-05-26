import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
  palette: {
    primary: {
      main: '#2A3F54', // Navy Blue
      light: '#B0C4DE', // Light Steel Blue
      contrastText: '#fff'
    },
    secondary: {
      main: '#2A9D8F', // Teal
      contrastText: '#fff'
    },
    background: {
      default: '#F8F9FB', // Ghost White
      paper: '#FFFFFF' // Surface (Card)
    },
    text: {
      primary: '#2F4F4F', // Dark Slate Gray
      secondary: '#696969' // Dim Gray
    },
    success: {
      main: '#77DD77', // Soft Green
      contrastText: '#fff'
    },
    warning: {
      main: '#FFB703', // Amber
      contrastText: '#fff'
    },
    error: {
      main: '#E63946', // Soft Red
      contrastText: '#fff'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(42,63,84,0.07)',
        },
        containedPrimary: {
          backgroundColor: '#2A3F54',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2A9D8F',
          },
        },
        outlinedPrimary: {
          borderColor: '#2A3F54',
          color: '#2A3F54',
          '&:hover': {
            borderColor: '#2A9D8F',
            color: '#2A9D8F',
            backgroundColor: '#F8F9FB',
          },
        },
      },
    },
  },
});

export default Theme;
