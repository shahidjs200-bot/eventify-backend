
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
import passport from "./config/passport.js";
import "./config/passport.js";
import authRoutes from "./routes/authroutes.js";
import eventRoutes from "./routes/eventroutes.js";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingroutes.js";
import aiRoutes from "./routes/airoutes.js";
const app = express();

connectDB();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173",
  process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/events',eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai",aiRoutes)
app.listen(process.env.PORT , () => console.log("🚀 Server running on port 5000"));
