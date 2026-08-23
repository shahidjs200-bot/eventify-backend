import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event:         { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  tickets:       { type: Number, default: 1 },
  totalAmount:   { type: Number, default: 0 },
  paymentStatus: String,
  paymentId:     String,   // Razorpay payment ID — for reference
  qrCode:        String,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);