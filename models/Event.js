import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
  date: String,
  time: String,
  duration: String,
  location: String,
  category: String,
  price: Number,
  language: String,
  image: {
    type: String,
    required: true ,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model('Event',eventSchema);