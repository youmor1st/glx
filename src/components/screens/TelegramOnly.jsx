import { Box, Typography, Container } from '@mui/material';

export function TelegramOnly() {
  return (
    <Container 
      maxWidth="sm" 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#ffffff'
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 400, p: 3 }}>
        {/* Telegram Logo */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ fontSize: '4rem', color: '#0088cc' }}>
            📱
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(135deg, #0088cc 0%, #9266FF 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Merits and Demerits
        </Typography>

        <Typography
          variant="h6"
          sx={{ mb: 3, color: '#5A5984' }}
        >
          Mini App
        </Typography>

        {/* Message */}
        <Box sx={{ 
          p: 3, 
          borderRadius: 2, 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 3
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
            🔒 Access Restricted
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, color: '#B8B8CC' }}>
            This application only works inside Telegram
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#8483AE' }}>
            Please open this app through Telegram Bot or Mini App
          </Typography>
        </Box>

        {/* Instructions */}
        <Box sx={{ 
          p: 2, 
          borderRadius: 1, 
          background: 'rgba(146, 102, 255, 0.1)',
          border: '1px solid rgba(146, 102, 255, 0.2)'
        }}>
          <Typography variant="body2" sx={{ color: '#B8B8CC' }}>
            💡 <strong>How to open:</strong><br/>
            1. Find the bot in Telegram<br/>
            2. Click "Open Mini App" button<br/>
            3. Or use direct link from Telegram
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
