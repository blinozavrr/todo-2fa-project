const User = require('../models/User');

// Получить профиль залогиненного пользователя
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -twoFactorSecret');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Обновить профиль (например, email)
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body; // email, password и т.д.
    const user = await User.findById(req.user.userId);

    if (updates.password) {
      // если пользователь хочет изменить пароль
      user.password = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    for (let key in updates) {
      user[key] = updates[key];
    }
    await user.save();

    res.json({ message: 'Профиль обновлен' });
  } catch (err) {
    next(err);
  }
};

// Только для админа: получить всех пользователей
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -twoFactorSecret');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Только для админа: назначить пользователя админом (или наоборот)
exports.makeAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params; // id пользователя, которого меняем
    const { role } = req.body; // 'admin' или 'user'
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'Роль пользователя обновлена', user });
  } catch (err) {
    next(err);
  }
};
