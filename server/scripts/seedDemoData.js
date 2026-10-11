import "dotenv/config";
import slugify from "slugify";
import mongoose from "mongoose";
import Category from "../src/models/Category.js";
import Post from "../src/models/Post.js";
import { connectToDb } from "../src/config/db.js";

const categoryNames = ["Australia", "Japan", "New Zealand", "Greece"];

const demoListings = [
  {
    title: "Harbourlight Escape (Demo)",
    hotelLocation: "Sydney, Australia",
    category: "Australia",
    price: 320,
    guest: 4,
    images: ["/demo/coast.png", "/demo/city.png", "/demo/island.png"],
    nearArea: ["Sydney Harbour", "The Rocks", "Circular Quay"],
    facilities: ["Wi-Fi", "Air conditioning", "Kitchen", "Parking"],
    description:
      "Sample Sydney stay for previewing the Dream Place booking experience, close to the harbour and city attractions.",
  },
  {
    title: "Byron Coastal Hideaway (Demo)",
    hotelLocation: "Byron Bay, Australia",
    category: "Australia",
    price: 245,
    guest: 3,
    images: ["/demo/island.png", "/demo/coast.png", "/demo/villa.png"],
    nearArea: ["Main Beach", "Cape Byron Lighthouse", "Town Centre"],
    facilities: ["Wi-Fi", "Pool", "Kitchen", "Garden"],
    description:
      "Sample coastal accommodation for the site demo, with beach access and a relaxed garden setting.",
  },
  {
    title: "Kyoto Garden Stay (Demo)",
    hotelLocation: "Kyoto, Japan",
    category: "Japan",
    price: 185,
    guest: 2,
    images: ["/demo/city.png", "/demo/villa.png", "/demo/island.png"],
    nearArea: ["Gion", "Nishiki Market", "Kiyomizu-dera"],
    facilities: ["Wi-Fi", "Air conditioning", "Breakfast", "Garden"],
    description:
      "Sample Kyoto guesthouse listing for previewing search, category browsing, and product details.",
  },
  {
    title: "Tokyo City Suite (Demo)",
    hotelLocation: "Tokyo, Japan",
    category: "Japan",
    price: 275,
    guest: 4,
    images: ["/demo/city.png", "/demo/coast.png", "/demo/lake.png"],
    nearArea: ["Shinjuku", "Shibuya Crossing", "Meiji Shrine"],
    facilities: ["Wi-Fi", "Air conditioning", "Kitchen", "City view"],
    description:
      "Sample Tokyo city apartment listing created for the Dream Place interview demo.",
  },
  {
    title: "Lake Tekapo Lodge (Demo)",
    hotelLocation: "Lake Tekapo, New Zealand",
    category: "New Zealand",
    price: 295,
    guest: 4,
    images: ["/demo/lake.png", "/demo/mountain.png", "/demo/coast.png"],
    nearArea: ["Lake Tekapo", "Church of the Good Shepherd", "Mount John"],
    facilities: ["Wi-Fi", "Heating", "Kitchen", "Parking"],
    description:
      "Sample lakeside lodge listing for previewing the New Zealand destination category.",
  },
  {
    title: "Queenstown Alpine Stay (Demo)",
    hotelLocation: "Queenstown, New Zealand",
    category: "New Zealand",
    price: 365,
    guest: 6,
    images: ["/demo/mountain.png", "/demo/lake.png", "/demo/villa.png"],
    nearArea: ["Lake Wakatipu", "Skyline Queenstown", "Queenstown Gardens"],
    facilities: ["Wi-Fi", "Heating", "Kitchen", "Mountain view"],
    description:
      "Sample alpine accommodation created for demonstrating destination browsing and booking screens.",
  },
  {
    title: "Santorini Sea View Villa (Demo)",
    hotelLocation: "Santorini, Greece",
    category: "Greece",
    price: 420,
    guest: 4,
    images: ["/demo/island.png", "/demo/villa.png", "/demo/coast.png"],
    nearArea: ["Oia", "Fira", "Ammoudi Bay"],
    facilities: ["Wi-Fi", "Pool", "Air conditioning", "Sea view"],
    description:
      "Sample Santorini villa listing for the Dream Place demo; listing details are fictional.",
  },
  {
    title: "Crete Olive Grove Retreat (Demo)",
    hotelLocation: "Chania, Greece",
    category: "Greece",
    price: 230,
    guest: 5,
    images: ["/demo/villa.png", "/demo/island.png", "/demo/lake.png"],
    nearArea: ["Chania Old Town", "Venizelos Graves", "Agia Marina"],
    facilities: ["Wi-Fi", "Kitchen", "Garden", "Parking"],
    description:
      "Sample Crete holiday home listing created for previewing the app. This is fictional demo content.",
  },
];

const run = async () => {
  await connectToDb();

  const categories = new Map();
  for (const name of categoryNames) {
    const slug = slugify(name, { lower: true });
    const category = await Category.findOneAndUpdate(
      { name },
      { $set: { slug } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    categories.set(name, category._id);
  }

  let added = 0;
  let existing = 0;
  for (const listing of demoListings) {
    const slug = slugify(listing.title, { lower: true, strict: true });
    const result = await Post.updateOne(
      { slug },
      {
        $setOnInsert: {
          ...listing,
          category: categories.get(listing.category),
          slug,
          isAvailable: true,
        },
      },
      { upsert: true }
    );
    if (result.upsertedCount) added += 1;
    else existing += 1;
  }

  console.log(
    `Demo seed complete: ${categoryNames.length} categories, ${added} listings added, ${existing} listings already existed.`
  );
};

run()
  .catch((error) => {
    console.error("Could not seed demo data:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
