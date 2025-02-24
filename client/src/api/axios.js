import axios from 'axios';

// Можно указать базовый URL, если ваш сервер, например, работает на http://localhost:4000
const instance = axios.create({
  baseURL: 'http://localhost:4000'
});

// Если нужно, добавляем interceptors (например, для автоматического подстановления токена)
instance.interceptors.request.use((config) => {
  // Пример: брать jwtToken из localStorage и прокидывать в заголовок
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
