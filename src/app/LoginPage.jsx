import { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { SimpleLoadingScreen } from '../components/screens/SimpleLoadingScreen';

export function LoginPage() {
  const { firstLogin, initTelegramAuth, error, loading, clearError } = useAuthStore();

  useEffect(() => {
    // Автоматически инициализируем Telegram авторизацию при загрузке страницы
    initTelegramAuth();
  }, [initTelegramAuth]);

  const handleTelegramLogin = async () => {
    clearError();
    await firstLogin();
  };

  // Show loading screen during authentication
  if (loading) {
    return <SimpleLoadingScreen message="Signing in..." />;
  }

  return (
    <Container 
      maxWidth="sm" 
      sx={styles.container}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={styles.title}
        >
          Merits and Demerits
        </Typography>

        {/* Mini App indicator */}
        <Typography 
          variant="h5" 
          sx={styles.subtitle}
        >
          Telegram Mini App
        </Typography>

        {/* Telegram Login */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={styles.error}>
              {error}
            </Alert>
          )}

          <Button
            onClick={handleTelegramLogin}
            variant="contained"
            size="large"
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #9266FF 0%, #6932EB 100%)',
              color: '#F4F4FF',
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #6932EB 0%, #5A2980 100%)'
              }
            }}
          >
            Login with Telegram
          </Button>
        </Box>
      </Box>
    </Container>
  );
}


const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: 4
  },
  title: {
    color: '#ffffff',
    fontWeight: 400,
    textAlign: 'center',
    background: 'linear-gradient(135deg, #F4F4FF 0%, #9266FF 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    color: '#5A5984',
    textAlign: 'center',
    mb: 4
  },
  error: {
    backgroundColor: 'rgba(235, 43, 75, 0.1)',
    border: '1px solid rgba(235, 43, 75, 0.3)',
    color: '#F4F4FF'
  },
}