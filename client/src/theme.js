import { createTheme } from '@mui/material/styles';

// Создаём кастомную тему MUI
const theme = createTheme({
  palette: {
    mode: 'light', // или 'dark'
    primary: {
      main: '#1976d2', // синий по умолчанию
    },
    secondary: {
      main: '#9c27b0', // фиолетовый
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
