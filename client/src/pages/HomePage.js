import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import NavBar from '../components/NavBar';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Box className="container" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h3" gutterBottom>Добро пожаловать в Todo 2FA!</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Здесь вы можете регистрироваться, входить в систему, создавать задачи и проверять двухфакторную аутентификацию.
        </Typography>
        <Button variant="contained" color="primary" href="/register" sx={{ mr: 2 }}>
          Регистрация
        </Button>
        <Button variant="outlined" color="primary" href="/login">
          Вход
        </Button>
      </Box>
    </>
  );
}
