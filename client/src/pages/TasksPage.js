import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper } from '@mui/material';
import axios from '../api/axios';
import TaskCard from '../components/TaskCard';
import NavBar from '../components/NavBar';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const token = localStorage.getItem('jwtToken');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks', {
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
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <NavBar />
      <Box className="container" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Мои задачи</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            label="Новая задача"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleCreateTask}>
            Добавить
          </Button>
        </Paper>

        <Grid container spacing={2}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <TaskCard task={task} onUpdate={fetchTasks} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
