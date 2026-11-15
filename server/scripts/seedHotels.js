import "dotenv/config";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import slugify from "slugify";
import Category from "../src/models/Category.js";
import Hotel from "../src/models/Hotel.js";
import Post from "../src/models/Post.js";
import { connectToDb } from "../src/config/db.js";
import { pathToFileURL } from "node:url";

const destinations = [
  ["Bangalore", "Indiranagar", "India", "Business", 4, 6200],
  ["Bangalore", "MG Road", "India", "Luxury", 5, 14200],
  ["Mumbai", "Bandra West", "India", "Boutique", 4, 8800],
  ["Mumbai", "Marine Drive", "India", "Luxury", 5, 14900],
  ["New Delhi", "Aerocity", "India", "Business", 5, 11700],
  ["Jaipur", "Civil Lines", "India", "Heritage", 5, 12800],
  ["Jaipur", "Amer Road", "India", "Resorts", 4, 7800],
  ["Udaipur", "Lake Pichola", "India", "Heritage", 5, 14500],
  ["Goa", "Candolim", "India", "Beachfront", 5, 13600],
  ["Goa", "Palolem", "India", "Resorts", 4, 7600],
  ["Goa", "Anjuna", "India", "Boutique", 4, 6900],
  ["Kochi", "Fort Kochi", "India", "Heritage", 4, 7100],
  ["Chennai", "Nungambakkam", "India", "Business", 4, 6400],
  ["Hyderabad", "Banjara Hills", "India", "Luxury", 5, 12100],
  ["Pune", "Koregaon Park", "India", "Boutique", 4, 5900],
  ["Kolkata", "Park Street", "India", "Heritage", 4, 6800],
  ["Manali", "Old Manali", "India", "Resorts", 4, 8200],
  ["Shimla", "Mall Road", "India", "Heritage", 4, 9100],
  ["Paris", "Le Marais", "France", "Boutique", 4, 14800],
  ["Bali", "Ubud", "Indonesia", "Resorts", 5, 13900],
  ["Bali", "Seminyak", "Indonesia", "Beachfront", 5, 14400],
  ["Santorini", "Oia", "Greece", "Beachfront", 5, 15000],
  ["Sydney", "The Rocks", "Australia", "Luxury", 5, 14700],
  ["Kyoto", "Higashiyama", "Japan", "Heritage", 4, 13200],
];

const perks = ["Free Cancellation", "Breakfast Included", "Pool Access", "Free Wi-Fi", "Airport Transfer", "Spa Credit", "Late Checkout", "Ocean View"];
const photoIds = [
  "photo-1566073771259-6a8506099945", "photo-1542314831-068cd1dbfeeb", "photo-1571896349842-33c89424de2d",
  "photo-1564501049412-61c2a3083791", "photo-1578683010236-d716f9a3f461", "photo-1566665797739-1674de7a421a",
  "photo-1568084680786-a84f91d1153c", "photo-1582719508461-905c673771fd", "photo-1590490360182-c33d57733427",
  "photo-1596394516093-501ba68a0ba6", "photo-1611892440504-42a792e24d32", "photo-1584132967334-10e028bd69f7",
  "photo-1571003123894-1c35a1d90a", "photo-1587874522487-fe10e954d035", "photo-1595576508898-0ad5c879a061",
  "photo-1563911302283-d2bc129e7570", "photo-1596436889106-be35e843f974", "photo-1591047139829-d91aecb6caea",
  "photo-1562790351-d273a961e0e9", "photo-1611892440504-42a792e24d32", "photo-1568084680786-a84f91d1153c",
  "photo-1601918774946-25832a4be0d6", "photo-1551882547-ff40c63fe5fa", "photo-1598300056393-4aac492f4344",
];

const createListing = (index) => {
  const [city, locality, country, category, starRating, basePrice] = destinations[index];
  const namePrefix = faker.helpers.arrayElement(["The", "Casa", "Grand", "Maison", "Cedar", "Aurora"]);
  const name = `${namePrefix} ${faker.company.name()} ${faker.helpers.arrayElement(["Hotel", "Suites", "Retreat", "House", "Residences"])}`;
  const slug = slugify(`${name}-${city}-${String(index + 1).padStart(2, "0")}`, { lower: true, strict: true });
  const pricePerNight = Math.min(15000, Math.max(1500, basePrice + faker.number.int({ min: -650, max: 650 })));
  const discount = faker.number.int({ min: 15, max: 30 });
  const originalPrice = Math.round(pricePerNight / (1 - discount / 100));
  const selectedPerks = faker.helpers.arrayElements(perks, { min: 3, max: 5 });
  const images = faker.helpers.arrayElements(photoIds, 3).map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`);
  const guestRating = faker.number.float({ min: 4.1, max: 4.9, fractionDigits: 1 });
  const description = `${faker.company.catchPhrase()}. ${faker.lorem.sentence({ min: 8, max: 14 })}`;

  return {
    hotel: {
      name, city, locality, country, category, starRating, guestRating,
      reviewCount: faker.number.int({ min: 128, max: 2860 }),
      pricePerNight, originalPrice, taxesAndFees: Math.round(pricePerNight * 0.12),
      images, perks: selectedPerks,
      promoTag: `DREAMPLACE - ${discount}% OFF`, slug, description,
      guestCapacity: faker.number.int({ min: 2, max: 6 }), isAvailable: true,
    },
    post: {
      title: name, slug, city, hotelLocation: `${locality}, ${city}, ${country}`,
      description, images, guest: 4, price: pricePerNight, rating: guestRating,
      nearArea: [locality, faker.location.street()], facilities: selectedPerks,
      isAvailable: true, isDemo: true,
    },
  };
};

export const seedHotels = async () => {
  faker.seed(20261115);
  const countries = [...new Set(destinations.map(([, , country]) => country))];
  const categoryIds = new Map();
  for (const name of countries) {
    const category = await Category.findOneAndUpdate(
      { name },
      { $set: { slug: slugify(name, { lower: true }) } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categoryIds.set(name, category._id);
  }

  let inserted = 0;
  for (const [index, listing] of destinations.map((_, index) => [index, createListing(index)])) {
    const hotelData = listing.hotel;
    const post = await Post.findOneAndUpdate(
      { slug: hotelData.slug },
      { $setOnInsert: { ...listing.post, category: categoryIds.get(hotelData.country) } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    const result = await Hotel.updateOne(
      { slug: hotelData.slug },
      { $set: { ...hotelData, postId: post._id } },
      { upsert: true, runValidators: true },
    );
    if (result.upsertedCount) inserted += 1;
  }

  console.log(`Hotel seed complete: ${inserted} new marketplace stays; ${destinations.length} curated demo listings are ready.`);
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
