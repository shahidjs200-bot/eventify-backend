<div align="center">

# 🎟️ Eventify

### A full-stack event booking platform built with the MERN stack


</div>

---

## 🌐 Live Demo

| | URL |
|---|---|
| **Frontend** | https://eventify-frontend-ren9.vercel.app |
| **Backend API** | https://eventify-backend-10ah.onrender.com |

> ⚠️ First load may take 30-50 seconds — backend is hosted on Render free tier (cold start)

---

## 🔑 Test Credentials

```
Email    : moco@gmail.com
Password : 1234567890
```

**Razorpay Test Payment:**
```
UPI ID : success@razorpay
```
Or use test card:
```
Card Number : 4111 1111 1111 1111
Expiry      : 12/26
CVV         : 123
OTP         : 1234
```

---

## ✨ Features

### 👤 For Users
- 🔍 Browse and search events by keyword, category, location, price range
- 🎟️ Book tickets for free and paid events
- 💳 Secure payment integration via **Razorpay**
- 📱 QR code ticket generation on successful booking
- 📋 View and cancel bookings from My Bookings page
- 🔐 Google OAuth login support

### 🎯 For Organizers
- ➕ Create, edit, and delete events with image upload
- ✨ **AI-powered description generator** using Groq (Llama 3)
- 📊 Real-time dashboard — tickets sold and revenue per event
- 🖼️ Cloud image storage via **Cloudinary**
- 💰 Track total earnings across all events

### 🌟 General
- 📱 Fully responsive — mobile, tablet, desktop
- 🔒 JWT authentication with HTTP-only cookies
- 🎨 Clean purple-themed UI with Tailwind CSS
- ⚡ Skeleton loaders for better UX

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| React Hook Form | Form handling & validation |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Cloudinary | Image storage |
| Razorpay | Payment gateway |
| Groq AI (Llama 3) | AI description generation |
| Multer | File upload handling |
| Passport.js | Google OAuth strategy |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
eventify/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── cloudinary.js
│   │   └── passport.js
│   ├── controller/
│   │   ├── authcontroller.js
│   │   ├── eventcontroller.js
│   │   ├── bookingController.js
│   │   └── aicontroller.js
│   ├── middleware/
│   │   ├── authmiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── authroutes.js
│   │   ├── eventroutes.js
│   │   ├── bookingroutes.js
│   │   └── airoutes.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── assets/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── CreateEvent.jsx
        │   ├── EditEvent.jsx
        │   ├── EventDetail.jsx
        │   ├── FindEvents.jsx
        │   ├── Myevent.jsx
        │   ├── Mybookings.jsx
        │   ├── PaymentPage.jsx
        │   └── PaymentSuccess.jsx
        ├── components/
        │   ├── AppNavbar.jsx
        │   ├── Navbar.jsx
        │   ├── Navbar2.jsx
        │   ├── Eventcard.jsx
        │   └── Footer.jsx
        ├── context/
        │   └── Authcontext.jsx
        └── hooks/
            └── useAuth.js
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Razorpay test account
- Groq API key (free at console.groq.com)
- Google OAuth credentials

### 1. Clone the repositories

```bash
git clone https://github.com/shahidjs200-bot/eventify-backend.git
git clone https://github.com/shahidjs200-bot/eventify-frontend.git
```

### 2. Backend setup

```bash
cd eventify-backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173

GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd eventify-frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 🔮 Future Improvements

- [ ] Real-time chat between attendees and organizers (Socket.io)
- [ ] Email notifications for booking confirmation
- [ ] Event analytics with charts
- [ ] Admin dashboard for platform management
- [ ] Full-text search with MongoDB Atlas Search
- [ ] PWA support for mobile users

---

## 👨‍💻 Developer

**Shaikh Shahid**
- 🎓 Final year BCA student
- 💻 Aspiring Full Stack Developer
- 🌐 GitHub: [@shahidjs200-bot](https://github.com/shahidjs200-bot)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by Shaikh Shahid
</div>