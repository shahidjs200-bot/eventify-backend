import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  createRazorpayOrder,
  verifyPayment,
} from "../controller/bookingController.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelBooking);
// Razorpay routes
router.post("/create-order", protect, createRazorpayOrder);  // step 1 — order banao
router.post("/verify-payment", protect, verifyPayment);       // step 2 — verify karo
 
export default router;