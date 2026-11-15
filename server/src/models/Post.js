import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hotelLocation: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.ObjectId,
    ref: "Category",
    required: true,
  },
  images: {
    type: [String],
    required: true,
    validate: [arrayLimit, "Provide between one and three images"],
  },
  slug: {
    type: String,
    unique: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true,
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  guest: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  price: {
    type: Number,
    required: true,
    min: 100,
    max: 25000,
    index: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4,
  },
  nearArea: {
    type: [String],
    required: true,
  },
  facilities: {
    type: [String],
    required: true,
  },
});

postSchema.index({ city: 1, price: 1 });
postSchema.index({ facilities: 1 });

function arrayLimit(val) {
  return val.length >= 1 && val.length <= 3;
}

export default mongoose.model("Post", postSchema);
