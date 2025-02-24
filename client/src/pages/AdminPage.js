import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from '../api/axios';
import NavBar from '../components/NavBar';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem('jwtToken');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchTasks = async (userId) => {
    try {
      const res = await axios.get(`/api/tasks?owner=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post(
        '/api/tasks',
        { title: taskTitle, ownerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTaskTitle('');
      fetchTasks(ownerId);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <NavBar />
      <Box className="container" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Админ-панель</Typography>
        
        <Typography variant="h6" sx={{ mt: 3 }}>Список пользователей:</Typography>
        <ul>
          {users.map((u) => (
            <li key={u._id}>
              {u.email} ({u.role})
            </li>
          ))}
        </ul>

        <Paper sx={{ p: 2, my: 3 }}>
          <Typography variant="h6" gutterBottom>Добавить задачу пользователю:</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Пользователь</InputLabel>
            <Select
              value={ownerId}
              label="Пользователь"
              onChange={(e) => setOwnerId(e.target.value)}
            >
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>{u.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Заголовок задачи"
            fullWidth
            sx={{ mb: 2 }}
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <Button variant="contained" onClick={handleCreateTask}>
            Создать
          </Button>
        </Paper>

        {ownerId && (
          <>
            <Button variant="outlined" onClick={() => fetchTasks(ownerId)}>
              Показать задачи выбранного пользователя
            </Button>
            <Typography variant="h6" sx={{ mt: 2 }}>Задачи:</Typography>
            <ul>
              {tasks.map((t) => (
                <li key={t._id}>{t.title} | {t.status}</li>
              ))}
            </ul>
          </>
        )}
      </Box>
    </>
  );
}
