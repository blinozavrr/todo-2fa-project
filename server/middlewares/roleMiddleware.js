module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав доступа (admin only)' });
    }
    next();
  };
  