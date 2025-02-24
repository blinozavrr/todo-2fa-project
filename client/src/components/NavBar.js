import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function NavBar() {
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Todo 2FA
        </Typography>
        <Button color="inherit" href="/">Главная</Button>
        <Button color="inherit" href="/tasks">Мои задачи</Button>
        <Button color="inherit" href="/admin">Админ</Button>
        <Button color="inherit" onClick={handleLogout}>Выйти</Button>
      </Toolbar>
    </AppBar>
  );
}
