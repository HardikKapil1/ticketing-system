# 🎟️ TicketOps

A full-stack ticketing application built with NestJS, MySQL, React, and Next.js.

## 🛠️ Tech Stack

**Backend**
- NestJS + TypeScript
- MySQL + TypeORM
- JWT Authentication (Access + Refresh Tokens)
- Swagger API Documentation

**Frontend**
- React + TypeScript (classic SPA)
- Next.js + TypeScript (App Router)
- Tailwind CSS
- Axios with interceptors

## ✨ Features
- JWT Auth with refresh tokens
- Role-based access (Admin / User)
- Admin: Create, delete events, view all tickets
- User: Browse events, book tickets, view bookings
- Filtering, search, pagination on events
- Protected routes on frontend
- Professional dark SaaS UI

## 🚀 Getting Started

**Backend**
```bash
cd backend
npm install
# Add .env file (see below)
npm run start:dev
```

**React Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Next.js Frontend**
```bash
cd ticketing-frontend-next
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

## 📡 API Endpoints
- `POST /user/register` — Register
- `POST /user/login` — Login
- `POST /auth/refresh` — Refresh token
- `GET /event` — Get all events
- `POST /event` — Create event (Admin)
- `DELETE /event/:id` — Delete event (Admin)
- `POST /ticket` — Book ticket
- `GET /ticket` — My tickets
- `GET /ticket/admin` — All tickets (Admin)
- `GET /user/all` — All users (Admin)
