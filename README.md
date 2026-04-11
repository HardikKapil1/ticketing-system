# 🎟️ Ticketing System

A full-stack ticketing application built with NestJS, MySQL, and React.

## 🛠️ Tech Stack

**Backend**
- NestJS + TypeScript
- MySQL + TypeORM
- JWT Authentication (Access + Refresh Tokens)
- Swagger API Documentation

**Frontend**
- React + TypeScript
- Tailwind CSS
- Axios with interceptors
- React Router

## ✨ Features

- JWT Auth with refresh tokens
- Role-based access (Admin / User)
- Admin: Create, update, delete events
- User: Browse events, book tickets, view bookings
- Filtering, search, pagination on events
- Protected routes on frontend

## 🚀 Getting Started

**Backend**
```bash
cd backend
npm install
# Add .env file (see below)
npm run start:dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=ticketing
```

## �API Endpoints

- `POST /user/register` — Register
- `POST /user/login` — Login
- `POST /auth/refresh` — Refresh token
- `GET /event` — Get all events
- `POST /event` — Create event (Admin)
- `DELETE /event/:id` — Delete event (Admin)
- `POST /ticket` — Book ticket
- `GET /ticket` — My tickets
