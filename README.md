Проект: ToDoList c двухфакторной аутентификацией (2FA)
Оглавление
Описание
Функционал
Технологии
Структура проекта
Установка и запуск локально
Настройка переменных окружения
Запуск приложения
API-эндпоинты
Двухфакторная аутентификация (2FA)
Роли пользователей (RBAC)
Деплой на Render (пример)
Лицензия
Описание
ToDoList c двухфакторкой — это учебный пример приложения, где:

Пользователь регистрируется и может создавать задачи (Todo).
Включена двухфакторная аутентификация (2FA) через Google Authenticator.
Роль «admin» может управлять задачами всех пользователей, просматривать их и т. д.
Данный проект включает в себя:

Бэкенд на Node.js + Express.js (с JWT, bcrypt, speakeasy и т. д.).
Фронтенд (React, Material UI) для интерфейса.
Базу данных MongoDB (например, MongoDB Atlas).
Возможность деплоя на Render, Railway или другой хостинг.
Функционал
Регистрация пользователя:

Сервер генерирует секрет для 2FA, отсылает QR-код.
Пользователь сканирует QR-код Google Authenticator-ом.
Пользователь подтверждает 6-значный код (TOTP), и 2FA включается.
Логин:

Ввод email/пароля.
Дополнительно требуется 2FA-код (если включено).
CRUD Задач:

Пользователь с ролью user может управлять только своими задачами.
admin видит задачи всех пользователей, может создавать задачи любому пользователю и т. д.
Профиль пользователя:

Изменение email/пароля и т. п.
admin может повышать других пользователей до «admin» или обратно.
Безопасность:

JWT‑токен (срок жизни, проверка middleware).
bcrypt для хэширования паролей.
speakeasy для 2FA.
Технологии
Node.js + Express.js
MongoDB (MongoDB Atlas)
JWT (jsonwebtoken)
bcrypt (хэширование)
speakeasy и qrcode (2FA)
React (Material UI) для интерфейса
Структура проекта
bash
Копировать
Редактировать
todo-2fa-project/
  ├─ client/               # React-приложение
  │   ├─ public/
  │   ├─ src/
  │   │   ├─ api/
  │   │   ├─ components/
  │   │   ├─ pages/
  │   │   ├─ App.js
  │   │   ├─ index.js
  │   │   └─ ...
  │   └─ package.json
  ├─ server/               # Бэкенд (Express)
  │   ├─ config/db.js
  │   ├─ controllers/
  │   ├─ middlewares/
  │   ├─ models/
  │   ├─ routes/
  │   ├─ server.js
  │   └─ package.json
  ├─ package.json          # Корневой (для деплоя монолитом)
  ├─ README.md             # Настоящий файл README
  └─ ...
Основные папки:
client: исходный код React (страницы, компоненты, стили).
server: исходный код Node.js/Express (маршруты, модели, контроллеры).
корневой package.json (если нужно монолитное развертывание).
Установка и запуск локально
Настройка переменных окружения
Клонируйте репозиторий:
bash
Копировать
Редактировать
git clone https://github.com/<username>/todo-2fa-project.git
Перейдите в папку server и создайте файл .env. Пример содержимого:
ini
Копировать
Редактировать
PORT=4000
MONGO_URI=<ваша-строка-подключения-к-mongodb>
JWT_SECRET=<любая-строка-для-jwt-секрета>
Аналогично, если нужно, настроить переменные окружения для клиента (обычно не требуется, если нет специфики).
Запуск приложения
Способ A: Запуск отдельно (Dev)
Бэкенд:

bash
Копировать
Редактировать
cd server
npm install
npm run dev
Сервер будет на http://localhost:4000.

Фронтенд:

bash
Копировать
Редактировать
cd ../client
npm install
npm start
Интерфейс доступен на http://localhost:3000.

Способ B: «Монолит» (Express раздаёт React)
В корне проекта создайте (или проверьте) package.json, где скрипт:
json
Копировать
Редактировать
{
  "scripts": {
    "postinstall": "npm install --prefix client && npm run build --prefix client && npm install --prefix server",
    "start": "node server/server.js"
  }
}
Выполните в корне:
bash
Копировать
Редактировать
npm install
npm run postinstall
npm start
Откройте http://localhost:4000 (если PORT=4000).
API-эндпоинты
Ниже краткое описание основных маршрутов (предположим, префикс /api/...).

Аутентификация (публичные)
POST /api/auth/register

Body: { email, password }
Ответ: { userId, qrCodeDataURL, message }
Генерирует пользователя с twoFactorEnabled=false, возвращает QR для сканирования.
POST /api/auth/verify-2fa

Body: { userId, token }
Ответ: { message }
Проверяет 6-значный код из Google Authenticator, включает twoFactorEnabled=true.
POST /api/auth/login

Body: { email, password, token }
Ответ: { token: <jwt> }
Проверяет пароль и (если 2FA включена) код из Authenticator, возвращает JWT.
Пользователи (приватные)
GET /api/users/profile

Headers: Authorization: Bearer <jwt>
Ответ: { _id, email, role, ... }
Возвращает профиль залогиненного пользователя.
PUT /api/users/profile

Headers: Authorization: Bearer <jwt>
Body: { email?, password? }
Обновляет профиль текущего пользователя (email/пароль).
GET /api/users (admin)

Список всех пользователей (без паролей).
PUT /api/users/:userId (admin)

Может менять role пользователя (например, сделать «admin»).
Задачи (приватные)
POST /api/tasks

Headers: Authorization: Bearer <jwt>
Body: { title, description, dueDate?, ownerId? }
Создание задачи. Если user — создаёт задачу себе; если admin — может указать ownerId.
GET /api/tasks

Если user — вернутся только его задачи.
Если admin и параметр ?owner=..., вернутся задачи указанного пользователя, иначе все.
GET /api/tasks/:id, PUT /api/tasks/:id, DELETE /api/tasks/:id

Получить/обновить/удалить задачу по ID. Только владелец или admin.
Двухфакторная аутентификация (2FA)
Используется пакет speakeasy для генерации TOTP-секретов, и qrcode для генерации изображения QR.

При регистрации сервер создаёт секрет и QR-код, отсылает его клиенту.
Пользователь сканирует этот код в Google Authenticator, вводит 6-значный временный код.
Сервер валидацией speakeasy.totp.verify(...) подтверждает корректность. Устанавливает twoFactorEnabled = true.
Роли пользователей (RBAC)
В схеме User есть поле role, которое может быть:

user
admin
user → видит/редактирует только свои задачи.
admin → может управлять задачами всех, видеть список пользователей, повышать роли и т. п.

Деплой на Render (пример)
Если хотите деплоить только фронтенд (React) как статический сайт:

Перейдите в Render.com, New → Static Site.
Выберите репо, укажите:
Root Directory → client
Build Command → npm install && npm run build
Publish Directory → build
Создайте сайт; после билда он будет доступен по URL вида https://myfrontend.onrender.com.
Если хотите монолит (Node.js + раздача React):

Сделайте корневой package.json со скриптами:
json
Копировать
Редактировать
{
  "scripts": {
    "postinstall": "npm install --prefix client && npm run build --prefix client && npm install --prefix server",
    "start": "node server/server.js"
  }
}
В server.js (бэкенд) раздавайте client/build.
На Render создайте Web Service.
Build Command можно оставить пустым (или npm install).
Start Command → npm start.
В Environment добавьте переменные MONGO_URI, JWT_SECRET.
Дождитесь успешного деплоя.
