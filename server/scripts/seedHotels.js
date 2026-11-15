import "dotenv/config";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import slugify from "slugify";
import { pathToFileURL } from "node:url";
import Category from "../src/models/Category.js";
import Post from "../src/models/Post.js";
import { connectToDb } from "../src/config/db.js";

const inventorySize = 520;
const destinations = [
  { city: "Bangalore", country: "India", category: "India" },
  { city: "Mumbai", country: "India", category: "India" },
  { city: "New Delhi", country: "India", category: "India" },
  { city: "Goa", country: "India", category: "India" },
  { city: "Jaipur", country: "India", category: "India" },
  { city: "Kochi", country: "India", category: "India" },
  { city: "Sydney", country: "Australia", category: "Australia" },
  { city: "Kyoto", country: "Japan", category: "Japan" },
  { city: "Paris", country: "France", category: "Paris" },
  { city: "Bali", country: "Indonesia", category: "Bali" },
  { city: "Santorini", country: "Greece", category: "Greece" },
  { city: "Queenstown", country: "New Zealand", category: "New Zealand" },
];
const amenities = ["Wi-Fi", "Pool", "Parking", "Spa", "Gym", "Free Breakfast", "Air conditioning", "Ocean view", "Pet friendly"];
const photos = [
  "photo-1566073771259-6a8506099945", "photo-1542314831-068cd1dbfeeb", "photo-1571896349842-33c89424de2d",
  "photo-1564501049412-61c2a3083791", "photo-1578683010236-d716f9a3f461", "photo-1566665797739-1674de7a421a",
  "photo-1568084680786-a84f91d1153c", "photo-1582719508461-905c673771fd", "photo-1590490360182-c33d57733427",
  "photo-1596394516093-501ba68a0ba6", "photo-1611892440504-42a792e24d32", "photo-1571896349842-33c89424de2d",
];

const createHotel = (index, categoryIds) => {
  const destination = destinations[index % destinations.length];
  const name = `${faker.company.name()} ${faker.helpers.arrayElement(["Hotel", "Suites", "House", "Retreat", "Residences"])}`;
  const suffix = String(index + 1).padStart(4, "0");
  const selectedAmenities = faker.helpers.arrayElements(amenities, { min: 3, max: 5 });
  const images = faker.helpers.arrayElements(photos, 3).map((photo) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=82`);

  return {
    title: name,
    slug: slugify(`${name}-${destination.city}-${suffix}`, { lower: true, strict: true }),
    city: destination.city,
    hotelLocation: `${destination.city}, ${destination.country}`,
    description: `${faker.company.catchPhrase()}. ${faker.lorem.sentence({ min: 9, max: 16 })}`,
    category: categoryIds.get(destination.category),
    images,
    guest: faker.number.int({ min: 1, max: 6 }),
    price: faker.number.int({ min: 1500, max: 15000 }),
    rating: faker.number.float({ min: 3.2, max: 5, fractionDigits: 1 }),
    facilities: selectedAmenities,
    nearArea: Array.from({ length: 3 }, () => faker.location.street()),
    isAvailable: true,
    isDemo: true,
  };
};

export const seedHotels = async () => {
  // A fixed seed makes reruns deterministic and lets bulk upserts stay idempotent.
  faker.seed(20261115);
  const categoryNames = [...new Set(destinations.map(({ category }) => category))];
  const categoryIds = new Map();
  for (const name of categoryNames) {
    const category = await Category.findOneAndUpdate(
      { name },
      { $set: { slug: slugify(name, { lower: true }) } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categoryIds.set(name, category._id);
  }

  const hotels = Array.from({ length: inventorySize }, (_, index) => createHotel(index, categoryIds));
  const result = await Post.bulkWrite(hotels.map((hotel) => ({
    updateOne: {
      filter: { slug: hotel.slug },
      update: { $setOnInsert: hotel },
      upsert: true,
    },
  })), { ordered: false });
  console.log(`Hotel seed complete: ${result.upsertedCount} new stays, ${inventorySize - result.upsertedCount} already present.`);
};

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  connectToDb()
    .then(seedHotels)
    .catch((error) => {
      console.error("Could not seed hotel inventory:", error.message);
      process.exitCode = 1;
    })
    .finally(async () => mongoose.disconnect());
}
