// pages/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography, Box, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../themes/theme';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    setError('');

    // Simuler une vérification des identifiants
    const allowedCredentials = [
      { email: 'phanolaingo10@gmail.com', password: 'admin123' },
      { email: 'rindraharim@gmail.com', password: 'admin123' },
    ];

    const isValid = allowedCredentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValid) {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/stock');
    } else {
      setError('Email ou mot de passe incorrect');
      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => {
        setError('');
      }, 5000);
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Supprimer l'astérisque du label
              InputLabelProps={{ required: false }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'} // Basculer entre 'text' et 'password'
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ required: false }} // Supprimer l'astérisque du label
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)} // Basculer l'état de showPassword
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                color: 'white',
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Se connecter'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;