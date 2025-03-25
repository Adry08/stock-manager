// theme.ts

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
});