import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  locality: { type: String, required: true, trim: true },
  starRating: { type: Number, enum: [3, 4, 5], required: true },
  guestRating: { type: Number, min: 1, max: 5, required: true },
  reviewCount: { type: Number, min: 0, default: 0 },
  category: {
    type: String,
    enum: ["Luxury", "Resorts", "Boutique", "Business", "Beachfront", "Heritage"],
    required: true,
    index: true,
  },
  pricePerNight: { type: Number, min: 1, required: true },
  originalPrice: { type: Number, min: 1, required: true },
  taxesAndFees: { type: Number, min: 0, default: 0 },
  images: { type: [String], required: true, validate: [(items) => items.length >= 3, "At least three photos are required"] },
  perks: { type: [String], default: [] },
  promoTag: { type: String, default: "" },
  slug: { type: String, required: true, unique: true, index: true },
  country: { type: String, required: true },
  state: { type: String, trim: true, default: "", index: true },
  seedBatch: { type: String, default: "" },
  description: { type: String, default: "" },
  guestCapacity: { type: Number, default: 4 },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
  isAvailable: { type: Boolean, default: true, index: true },
}, { timestamps: true });

hotelSchema.index({ city: 1, category: 1, starRating: 1, pricePerNight: 1 });
hotelSchema.index({ city: 1 });
hotelSchema.index({ state: 1, city: 1, pricePerNight: 1 });
hotelSchema.index({ pricePerNight: 1 });
hotelSchema.index({ guestRating: -1, reviewCount: -1 });

export default mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
