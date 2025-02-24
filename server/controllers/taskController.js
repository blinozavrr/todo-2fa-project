const Task = require('../models/Task');
const User = require('../models/User');

// Создать новую задачу
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, ownerId } = req.body;

    // Если админ создает задачу для другого user'а
    let owner = req.user.userId;
    if (req.user.role === 'admin' && ownerId) {
      owner = ownerId;
    }

    const task = new Task({
      title,
      description,
      dueDate,
      owner
    });
    await task.save();
    res.json({ message: 'Задача создана', task });
  } catch (err) {
    next(err);
  }
};

// Получить все задачи для текущего пользователя 
// или для всех (если админ захочет)
exports.getTasks = async (req, res, next) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      // админ может смотреть все задачи или по query-параметрам
      if (req.query.owner) {
        tasks = await Task.find({ owner: req.query.owner });
      } else {
        tasks = await Task.find().populate('owner', 'email');
      }
    } else {
      // user видит только свои задачи
      tasks = await Task.find({ owner: req.user.userId });
    }
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Получить задачу по id (если владелец или админ)
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    // Проверяем право доступа
    if (req.user.role !== 'admin' && task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Обновить задачу
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    if (req.user.role !== 'admin' && task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    const { title, description, status, dueDate } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    await task.save();

    res.json({ message: 'Задача обновлена', task });
  } catch (err) {
    next(err);
  }
};

// Удалить задачу
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    if (req.user.role !== 'admin' && task.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Нет доступа' });
    }
    await task.deleteOne();
    res.json({ message: 'Задача удалена' });
  } catch (err) {
    next(err);
  }
};
