import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import QRCode from "qrcode";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay instance — test keys from .env
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── STEP 1: Create Razorpay Order ───────────────────────────────────────────
// Frontend calls this first — we create an order on Razorpay and send back order_id
export const createRazorpayOrder = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const price    = Number(event.price || 0);
    const total    = price * (tickets || 1);

    // Free event — skip Razorpay, directly create booking
    if (total === 0) {
      return res.json({ free: true });
    }

    // Razorpay amount is in paise (₹1 = 100 paise)
    const options = {
      amount:   total * 100,
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Send order details to frontend
    res.json({
      free:       false,
      orderId:    order.id,          // Razorpay order ID
      amount:     total,             // in rupees (for display)
      amountPaise: total * 100,      // in paise (for Razorpay)
      currency:   "INR",
      keyId:      process.env.RAZORPAY_KEY_ID,  // frontend needs this to open popup
      eventTitle: event.title,
      userEmail:  req.user.email,
    });
  } catch (err) {
    console.error("❌ Razorpay order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── STEP 2: Verify Payment + Create Booking ─────────────────────────────────
// After user pays, Razorpay sends back 3 values — we verify them using crypto
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      tickets,
    } = req.body;

    // Signature verification — security step
    // Razorpay signs the payment using your key_secret
    // We recreate the signature and compare — if match, payment is real
    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Signature matched — payment is real — now create the booking
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const price = Number(event.price || 0);
    const total = price * (tickets || 1);

    const qr = await QRCode.toDataURL(
      `Event:${event.title} User:${req.user._id} Payment:${razorpay_payment_id}`
    );

    const booking = await Booking.create({
      user:          req.user._id,
      event:         eventId,
      tickets,
      totalAmount:   total,
      paymentStatus: "paid",
      paymentId:     razorpay_payment_id,  // store for reference
      qrCode:        qr,
    });

    res.json(booking);
  } catch (err) {
    console.error("❌ Payment verify error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─── CREATE BOOKING (free events) ────────────────────────────────────────────
export const createBooking = async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const price = Number(event.price || 0);
    const total = price * (tickets || 1);

    const qr = await QRCode.toDataURL(
      `Event:${event.title} User:${req.user._id}`
    );

    const booking = await Booking.create({
      user:          req.user._id,
      event:         eventId,
      tickets,
      totalAmount:   total,
      paymentStatus: price === 0 ? "free" : "paid",
      qrCode:        qr,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET MY BOOKINGS ──────────────────────────────────────────────────────────
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("event")
    .sort({ createdAt: -1 });

  res.json(bookings);
};

// ─── CANCEL BOOKING ───────────────────────────────────────────────────────────
export const cancelBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};