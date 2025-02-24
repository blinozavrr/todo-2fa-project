import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import axios from '../api/axios';

export default function TaskCard({ task, onUpdate }) {
  const token = localStorage.getItem('jwtToken');

  const handleComplete = async () => {
    try {
      await axios.put(
        `/api/tasks/${task._id}`,
        { status: 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>{task.title}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>{task.description || 'Без описания'}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>Статус: {task.status}</Typography>
        <Button variant="contained" onClick={handleComplete} sx={{ mr: 2 }}>
          Завершить
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Удалить
        </Button>
      </CardContent>
    </Card>
  );
}
