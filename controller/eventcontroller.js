import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";
import Booking from "../models/Booking.js";

export const CreateEvent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Event image is required" });
    }

    if (req.user.role === "user") {
      req.user.role = "organizer";
      await req.user.save();
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "events" });

    const event = await Event.create({
      title:       req.body.title,
      description: req.body.description,
      date:        req.body.date,
      time:        req.body.time,
      duration:    req.body.duration,
      location:    req.body.location,
      category:    req.body.category,
      language:    req.body.language,
      price:       Number(req.body.price) || 0,   // ✅ Always stored as Number
      image:       uploadResult.secure_url,
      organizer:   req.user._id,
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("❌ CREATE EVENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyevents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    const eventWithStats = await Promise.all(
      events.map(async (event)=>{
        const bookings = await Booking.find({event: event._id});

        const ticketsSold = bookings.reduce(
          (sum,b) => sum + (b.tickets || 0),0
        );

        const revenue = bookings.reduce(
          (sum, b) => sum + (b.totalAmount || 0), 0
        );

        return {
          ...event.toObject(),
          ticketsSold,
          revenue,
        }
      })
    )
    res.json(eventWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    return res.json({ message: "Event deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const SingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const UpdateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ All fields updated including price, category, language, description
    event.title       = req.body.title;
    event.description = req.body.description;
    event.date        = req.body.date;
    event.time        = req.body.time;
    event.duration    = req.body.duration;
    event.location    = req.body.location;
    event.category    = req.body.category;
    event.language    = req.body.language;
    event.price       = Number(req.body.price) || 0;  // ✅ Always stored as Number

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "events" });
      event.image = uploadResult.secure_url;
    }

    await event.save();
    res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const searchEvent = async (req, res) => {
  try {
    const { event, location, category, price, date, language } = req.query;
    let query = {};

   if (event) {
  const words = event.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word — normal search
    query.title = { $regex: event, $options: 'i' };
  } else {
    // Multiple words — har word alag search karo OR condition mein
    query.$or = words.map(word => ({
      title: { $regex: word, $options: 'i' }
    }));
  }
}
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (language) {
      query.language = language;
    }

    if (date) {
      query.date = date;
    }

    // ✅ Price range filter — works because price is stored as Number in DB
    if (price) {
      if (price === "free")           query.price = 0;
      else if (price === "0-500")     query.price = { $gt: 0,    $lte: 500  };
      else if (price === "500-1000")  query.price = { $gt: 500,  $lte: 1000 };
      else if (price === "1000-2000") query.price = { $gt: 1000, $lte: 2000 };
      else if (price === "2000+")     query.price = { $gt: 2000 };
    }

    const events = await Event.find(query).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};