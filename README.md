# 🎟️ TicketOps

A **production-ready full-stack event ticketing system** with real-time notifications, secure payments, and scalable backend architecture.

---

## 🔗 Live Demo

* 🌐 **Frontend**: https://ticketing-frontend-xi.vercel.app
* ⚙️ **Backend API (Swagger)**: https://ticketing-backend-s71g.onrender.com/api

> ⚠️ Backend runs on Render free tier — first request may take **30–60 seconds** (cold start).

---

## ✨ Features

* 🔐 **JWT Authentication** with Refresh Tokens
* 👥 **Role-Based Access Control** (Admin/User)
* 🎪 **Event Management (CRUD)** — Admin only
* 🎟️ **Ticket Booking** with seat selection
* 💳 **Razorpay Payment Integration** with signature verification
* 🔔 **Real-time Notifications** using WebSockets
* ⚡ **Redis Caching** for faster event fetching
* 🛡️ **Rate Limiting** to prevent abuse
* 🐳 **Dockerized Setup** for easy deployment

---

## 🛠️ Tech Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Backend   | NestJS, TypeScript       |
| Database  | MySQL, TypeORM           |
| Frontend  | Next.js 15, Tailwind CSS |
| Auth      | JWT + Refresh Tokens     |
| Cache     | Redis (Upstash)          |
| Payments  | Razorpay                 |
| Real-time | Socket.IO                |
| DevOps    | Docker, Render, Vercel   |

---

## 📁 Project Structure

```
ticketing-system/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── event/
│   │   ├── ticket/
│   │   ├── payment/
│   │   ├── notifications/
│   │   └── user/
│
├── frontend-next/    # Next.js App
│   ├── app/
│   │   ├── admin/
│   │   ├── user/
│   │   ├── events/
│   │   ├── login/
│   │   └── register/
│
└── docker-compose.yml
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

* Node.js 18+
* MySQL
* Docker (optional)

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/HardikKapil1/ticketing-system
cd ticketing-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Create a `.env` file in `/backend`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_NAME=ticketing

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

REDIS_URL=your_upstash_redis_url

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend-next
npm install
npm run dev
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

### 🐳 Docker Setup (Optional)

```bash
docker-compose up --build
```

* 🌐 Frontend → http://localhost:3001
* ⚙️ Backend → http://localhost:3000
* 📄 Swagger → http://localhost:3000/api

---

## 🧪 API Testing

Use Swagger UI:
https://ticketing-backend-s71g.onrender.com/api

---

## 🧠 Key Highlights

* Implemented **secure payment verification** using Razorpay signatures
* Designed **scalable backend architecture** using NestJS modules
* Integrated **Redis caching** for performance optimization
* Built **real-time notifications** using WebSockets
* Deployed across **Render + Vercel**

---

## 👤 Author

**Hardik Kapil**

* 🔗 LinkedIn: *(add link here)*
* 🌐 Portfolio: https://portfolio-ashen-sigma-cndksz8six.vercel.app

---

## ⭐ Support

If you found this project helpful:

👉 Give it a ⭐ on GitHub
## 📸 Screenshots

<img width="1894" height="911" alt="image" src="https://github.com/user-attachments/assets/4ed4341c-0f79-499b-a212-e791c8e4e9e6" />

<img width="872" height="579" alt="image" src="https://github.com/user-attachments/assets/2fa633a1-86b5-4b04-a5e2-6d12b9fb6de4" />

<img width="904" height="886" alt="image" src="https://github.com/user-attachments/assets/6804d157-43d0-4507-a5f0-0f4646e66798" />
