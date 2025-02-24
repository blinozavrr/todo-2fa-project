const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Регистрация пользователя (шаг 1) - создаём юзера, генерируем 2FA-секрет
exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Генерируем секрет для 2FA
    const secret = speakeasy.generateSecret({ name: `Todo2FA (${email})` });

    // Создаём пользователя в БД с заготовленным twoFactorSecret
    const newUser = new User({
      email,
      password: hashedPassword,
      twoFactorEnabled: false,
      twoFactorSecret: secret.base32 // храним base32 формат
    });
    await newUser.save();

    // Генерируем QR-код (dataURL) для отправки клиенту
    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);

    res.json({
      message: 'Пользователь создан. Просканируйте QR-код Google Authenticator-ом.',
      qrCodeDataURL,
      userId: newUser._id
    });
  } catch (err) {
    next(err);
  }
};

// Подтверждаем 2FA-код (шаг 2) - завершаем регистрацию
exports.verify2FA = async (req, res, next) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (!verified) {
      return res.status(400).json({ message: 'Неверный код 2FA' });
    }

    // Активируем 2FA
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: '2FA успешно активирована. Можете авторизоваться.' });
  } catch (err) {
    next(err);
  }
};

// Логин с проверкой пароля + 2FA
exports.login = async (req, res, next) => {
  try {
    const { email, password, token } = req.body; // token - это 2FA-код

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Если пользователь включил 2FA, то проверяем код
    if (user.twoFactorEnabled) {
      const is2FAVerified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token
      });
      if (!is2FAVerified) {
        return res.status(401).json({ message: 'Неверный код 2FA' });
      }
    }

    // Генерируем JWT
    const payload = {
      userId: user._id,
      role: user.role
    };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Успешный вход',
      token: jwtToken
    });
  } catch (err) {
    next(err);
  }
};
