import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';
import { useAuthStore } from "../store/authStore";
import { routes, defaultRoutes } from "../routes/routes.jsx";
import BottomNavbar from "../components/BottomNavbar";
import AuthWrapper from "../components/AuthWrapper";
import { TelegramOnly } from "../components/screens/TelegramOnly.jsx";
import { canRunApp, getEnvironmentInfo } from "../utils/telegramCheck";

export function App() {
  const { user } = useAuthStore();

  // Check if the app can run in the current environment
  const canRun = canRunApp();
  
  // Debug information (only in development)
  if (import.meta.env.DEV) {
    console.log('App environment check:', getEnvironmentInfo());
  }

  if (!canRun) {
    return <TelegramOnly />;
  }

  return (
    <>
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <Box
          sx={styles.container}
        >
        <AuthWrapper>
          <Box
            component="main"
            sx={styles.main}
          >
            <Routes>
                {/* Main Routes */}
                {routes.map((route, index) => (
                  <Route 
                    key={index}
                    path={route.path} 
                    element={route.element} 
                  />
                ))}
                
                {/* Default Routes */}
                {defaultRoutes.map((route, index) => (
                  <Route 
                    key={`default-${index}`}
                    path={route.path} 
                    element={route.element} 
                  />
                ))}
              </Routes>
          </Box>
        </AuthWrapper>
        
        {/* Bottom Navigation - only show when authenticated */}
        {user && <BottomNavbar />}
        </Box>
      </Router>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flexGrow: 1,
    pt: 10, // Fixed top margin to avoid Telegram app controls
    pb: 8, // Account for bottom navbar height
    minHeight: '100vh',
  }
}