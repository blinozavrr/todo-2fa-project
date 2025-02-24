import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import axios from '../api/axios';
import NavBar from '../components/NavBar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFAToken, setTwoFAToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password,
        token: twoFAToken,
      });
      const { token } = res.data; // JWT
      localStorage.setItem('jwtToken', token);
      alert('Успешный вход!');
      window.location.href = '/tasks';
    } catch (err) {
      alert('Ошибка при входе: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <NavBar />
      <Box className="container" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, maxWidth: 400, margin: '0 auto' }}>
          <Typography variant="h5" gutterBottom>Вход</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="2FA-код (если включено)"
              fullWidth
              margin="normal"
              value={twoFAToken}
              onChange={(e) => setTwoFAToken(e.target.value)}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Войти
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
