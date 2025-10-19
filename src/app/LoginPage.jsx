import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { SimpleLoadingScreen } from '../components/screens/SimpleLoadingScreen';

export function LoginPage() {
  const { firstLogin, checkAuth, error, loading, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    // Очищаем предыдущие ошибки
    clearError();
    
    const result = await firstLogin(username, password);
    
    // Если логин успешен, проверяем авторизацию для обновления user в store
    if (result?.success) {
      await checkAuth();
    }
  };

  // Dev-only quick login helper
  const quickLoginDev = async (u, p) => {
    setUsername(u);
    setPassword(p);
    clearError();
    
    const result = await firstLogin(u, p);
    if (result?.success) {
      await checkAuth();
    }
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
          mini app
        </Typography>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#373758' },
                  '&:hover fieldset': { borderColor: '#8483AE' },
                  '&.Mui-focused fieldset': { borderColor: '#9266FF' }
                },
                '& .MuiInputLabel-root': {
                  color: '#5A5984',
                  '&.Mui-focused': { color: '#9266FF' }
                }
              }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#373758' },
                  '&:hover fieldset': { borderColor: '#8483AE' },
                  '&.Mui-focused fieldset': { borderColor: '#9266FF' }
                },
                '& .MuiInputLabel-root': {
                  color: '#5A5984',
                  '&.Mui-focused': { color: '#9266FF' }
                }
              }}
            />

            {error && (
              <Alert 
                severity="error" 
                sx={styles.error}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!username || !password}
              sx={{
                background: 'linear-gradient(135deg, #9266FF 0%, #6932EB 100%)',
                color: '#F4F4FF',
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #6932EB 0%, #5A2980 100%)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #626290 0%, #373758 100%)',
                  color: '#5A5984'
                }
              }}
            >
              Login
            </Button>
          </Box>
        </form>

        {/* Development Mode: Hidden quick login buttons */}
        {import.meta.env.DEV && (
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="caption" 
              sx={styles.developmentMode}
            >
              Development Mode
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button size="small" variant="text" sx={{ color: '#5A5984' }} onClick={() => quickLoginDev('testAdmin', '885522yy')}>
                Admin
              </Button>
              <Button size="small" variant="text" sx={{ color: '#5A5984' }} onClick={() => quickLoginDev('testTeacher', '774411yy')}>
                Teacher
              </Button>
              <Button size="small" variant="text" sx={{ color: '#5A5984' }} onClick={() => quickLoginDev('testStudent', '996633yy')}>
                Student
              </Button>
            </Box>
          </Box>
        )}
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
  developmentMode: {
    display: 'block',
    textAlign: 'center',
    color: '#5A5984',
    fontSize: '0.75rem',
    mb: 1
  }
}