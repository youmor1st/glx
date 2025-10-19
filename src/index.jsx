import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Mock the environment FIRST, before any SDK imports
import "@/utils/mockEnv.js";

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

import { App } from "@/app/App.jsx";
import { init } from "@/init.js";

import { Helmet } from "react-helmet";

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9266FF', // Primary brand color
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6932EB', // Primary deep color
      light: '#9575cd',
      dark: '#512da8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0C0B21', // Background base
      paper: '#0E0D2A', // Background paper
      gradient: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#5A5984',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      color: '#ffffff',
      fontWeight: 400,
    },
    h2: {
      color: '#ffffff',
      fontWeight: 400,
    },
    h3: {
      color: '#ffffff',
      fontWeight: 400,
    },
    h4: {
      color: '#ffffff',
      fontWeight: 400,
    },
    h5: {
      color: '#ffffff',
      fontWeight: 400,
    },
    h6: {
      color: '#ffffff',
      fontWeight: 400,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
    caption: {
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0 4px 14px 0 rgba(146, 102, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(146, 102, 255, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #9266FF 0%, #6932EB 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6932EB 0%, #5A2980 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0C0B21 0%, #1A1932 50%, #0E0D2A 100%)',
          border: '1px solid rgba(146, 102, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(146, 102, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(146, 102, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9266FF',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(146, 102, 255, 0.1)',
          border: '1px solid rgba(146, 102, 255, 0.3)',
          color: '#ffffff',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: 16, // убрать фиксированный 24px от MUI
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || "").includes("platformer_debug") || import.meta.env.DEV;

  await init({
    debug,
    eruda: debug && ["ios", "android"].includes(platform),
    mockForMacOS: platform === "macos",
  }).then(() => {
    root.render(
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Helmet>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, viewport-fit=cover, minimum-scale=1.0, maximum-scale=1.0"
            />
          </Helmet>
          <App />
        </ThemeProvider>
      </StrictMode>
    );
  });
} catch (e) {
  console.error('Error during app initialization:', e);
  
  // В режиме разработки показываем более подробную информацию
  if (import.meta.env.DEV) {
    root.render(
      <StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ 
            padding: '20px', 
            color: '#ffffff', 
            backgroundColor: '#0a0a0a',
            minHeight: '100vh',
            fontFamily: 'monospace'
          }}>
            <h1>Ошибка инициализации в режиме разработки</h1>
            <p>Ошибка: {e.message}</p>
            <pre style={{ 
              backgroundColor: '#1a1a1a', 
              padding: '10px', 
              borderRadius: '5px',
              overflow: 'auto'
            }}>
              {e.stack}
            </pre>
            <p>Попробуйте обновить страницу или проверить консоль браузера.</p>
          </div>
        </ThemeProvider>
      </StrictMode>
    );
  }
}
