import React, { useState } from 'react';
import axios from '../api/axios';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import NavBar from '../components/NavBar';

export default function RegisterPage() {
  // Поля для шага регистрации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // После регистрации сервер пришлёт userId и QR-код (dataURL)
  const [userId, setUserId] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  // На втором «шаге» пользователь вводит TOTP‑код (6 цифр)
  const [twoFAToken, setTwoFAToken] = useState('');

  // Для переключения «экрана»:
  // step=1 (запрос email/пароль), step=2 (отображение QR, ввод кода)
  const [step, setStep] = useState(1);

  // Отправляем email/пароль → получаем (qrCodeDataURL, userId)
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', {
        email,
        password
      });
      // сервер вернул qrCodeDataURL, userId
      setUserId(res.data.userId);
      setQrCodeDataURL(res.data.qrCodeDataURL);

      // переключаемся на второй «шаг» (ввод кода)
      setStep(2);
    } catch (error) {
      alert('Ошибка регистрации: ' + (error.response?.data?.message || error.message));
    }
  };

  // Отправляем введённый TOTP‑код на /api/auth/verify-2fa
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/verify-2fa', {
        userId,
        token: twoFAToken
      });
      alert('2FA подтверждена! Теперь можете войти в систему.');
      // например, перенаправим на /login:
      window.location.href = '/login';
    } catch (error) {
      alert('Ошибка верификации 2FA: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <NavBar />
      <Box className="container" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, maxWidth: 500, margin: '0 auto' }}>
          {step === 1 && (
            <>
              <Typography variant="h5" gutterBottom>
                Регистрация (шаг 1)
              </Typography>
              <Box component="form" onSubmit={handleRegister}>
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
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Зарегистрироваться
                </Button>
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="h5" gutterBottom>
                Сканируйте QR-код (шаг 2)
              </Typography>
              {qrCodeDataURL && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img
                    src={qrCodeDataURL}
                    alt="QR Code for 2FA"
                    style={{ marginTop: '1rem' }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Откройте Google Authenticator и сканируйте этот код
                  </Typography>
                </Box>
              )}
              <Typography variant="body1" sx={{ mb: 2 }}>
                Затем введите 6-значный код из приложения, чтобы завершить настройку.
              </Typography>

              <Box component="form" onSubmit={handleVerify2FA}>
                <TextField
                  label="2FA-код"
                  fullWidth
                  margin="normal"
                  value={twoFAToken}
                  onChange={(e) => setTwoFAToken(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Подтвердить
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}
