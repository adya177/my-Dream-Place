import "dotenv/config";
import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import { faker } from "@faker-js/faker";
import slugify from "slugify";
import Category from "./src/models/Category.js";
import Hotel from "./src/models/Hotel.js";
import Post from "./src/models/Post.js";
import { connectToDb } from "./src/config/db.js";

const stateCities = [
  { state: "Andhra Pradesh", cities: ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore", "Rajahmundry"] },
  { state: "Arunachal Pradesh", cities: ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila", "Roing"] },
  { state: "Assam", cities: ["Guwahati", "Dibrugarh", "Jorhat", "Tezpur", "Silchar", "Kaziranga"] },
  { state: "Bihar", cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Rajgir"] },
  { state: "Chhattisgarh", cities: ["Raipur", "Bilaspur", "Jagdalpur", "Durg", "Ambikapur", "Bhilai"] },
  { state: "Goa", cities: ["Panaji", "Margao", "Calangute", "Candolim", "Palolem", "Vasco da Gama"] },
  { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Dwarka", "Bhuj"] },
  { state: "Haryana", cities: ["Gurugram", "Faridabad", "Panipat", "Karnal", "Hisar", "Kurukshetra"] },
  { state: "Himachal Pradesh", cities: ["Shimla", "Manali", "Dharamshala", "Kasol", "Kullu", "Spiti"] },
  { state: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Deoghar", "Dhanbad", "Bokaro", "Hazaribagh"] },
  { state: "Karnataka", cities: ["Bengaluru", "Mysuru", "Mangaluru", "Hampi", "Coorg", "Gokarna"] },
  { state: "Kerala", cities: ["Kochi", "Thiruvananthapuram", "Alappuzha", "Munnar", "Kozhikode", "Wayanad"] },
  { state: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Khajuraho"] },
  { state: "Maharashtra", cities: ["Mumbai", "Pune", "Nashik", "Nagpur", "Mahabaleshwar", "Aurangabad"] },
  { state: "Manipur", cities: ["Imphal", "Bishnupur", "Churachandpur", "Thoubal", "Ukhrul", "Moreh"] },
  { state: "Meghalaya", cities: ["Shillong", "Cherrapunji", "Tura", "Mawlynnong", "Jowai", "Nongpoh"] },
  { state: "Mizoram", cities: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Saiha"] },
  { state: "Nagaland", cities: ["Kohima", "Dimapur", "Mokokchung", "Mon", "Wokha", "Tuensang"] },
  { state: "Odisha", cities: ["Bhubaneswar", "Puri", "Cuttack", "Konark", "Rourkela", "Gopalpur"] },
  { state: "Punjab", cities: ["Amritsar", "Ludhiana", "Chandigarh", "Patiala", "Jalandhar", "Anandpur Sahib"] },
  { state: "Rajasthan", cities: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar", "Bikaner"] },
  { state: "Sikkim", cities: ["Gangtok", "Pelling", "Namchi", "Lachung", "Ravangla", "Yuksom"] },
  { state: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Ooty", "Kodaikanal", "Kanyakumari"] },
  { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"] },
  { state: "Tripura", cities: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa", "Belonia"] },
  { state: "Uttar Pradesh", cities: ["Lucknow", "Varanasi", "Agra", "Prayagraj", "Mathura", "Noida"] },
  { state: "Uttarakhand", cities: ["Dehradun", "Rishikesh", "Nainital", "Mussoorie", "Haridwar", "Almora"] },
  { state: "West Bengal", cities: ["Kolkata", "Darjeeling", "Siliguri", "Kalimpong", "Durgapur", "Sundarbans"] },
];

const categories = ["Luxury", "Resorts", "Boutique", "Business", "Beachfront", "Heritage"];
const baseCount = Math.floor(5000 / stateCities.length);
const extraCount = 5000 % stateCities.length;
const perks = ["Breakfast Included", "Free Cancellation", "Pool Access", "Free Wi-Fi", "Airport Transfer", "Spa Credit", "Late Checkout", "Ocean View", "Gym Access", "Pet Friendly"];
const imageIds = [
  "photo-1566073771259-6a8506099945", "photo-1542314831-068cd1dbfeeb", "photo-1571896349842-33c89424de2d",
  "photo-1564501049412-61c2a3083791", "photo-1578683010236-d716f9a3f461", "photo-1566665797739-1674de7a421a",
  "photo-1568084680786-a84f91d1153c", "photo-1582719508461-905c673771fd", "photo-1590490360182-c33d57733427",
  "photo-1596394516093-501ba68a0ba6", "photo-1611892440504-42a792e24d32", "photo-1584132967334-10e028bd69f7",
  "photo-1587874522487-fe10e954d035", "photo-1595576508898-0ad5c879a061", "photo-1563911302283-d2bc129e7570",
  "photo-1596436889106-be35e843f974", "photo-1591047139829-d91aecb6caea", "photo-1562790351-d273a961e0e9",
  "photo-1601918774946-25832a4be0d6", "photo-1551882547-ff40c63fe5fa", "photo-1598300056393-4aac492f4344",
];
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;
const batches = (items, size = 500) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

const buildInventory = () => {
  faker.seed(20261115);
  const listings = [];
  stateCities.forEach(({ state, cities }, stateIndex) => {
    const count = baseCount + (stateIndex < extraCount ? 1 : 0);
    for (let index = 0; index < count; index += 1) {
      const city = cities[index % cities.length];
      const locality = faker.location.street();
      const prefix = faker.helpers.arrayElement(["The", "Casa", "Grand", "Maison", "Cedar", "Aurora", "Stay", "Vista"]);
      const suffix = faker.helpers.arrayElement(["Hotel", "Suites", "Retreat", "House", "Residences", "Hideaway"]);
      const name = `${prefix} ${faker.company.name()} ${suffix}`;
      const slug = slugify(`${name}-${state}-${city}-${String(index + 1).padStart(3, "0")}`, { lower: true, strict: true });
      const pricePerNight = faker.number.int({ min: 1500, max: 15000 });
      const discount = faker.number.int({ min: 12, max: 35 });
      const starRating = faker.helpers.arrayElement([3, 4, 5]);
      const guestRating = faker.number.float({ min: 3.8, max: 4.9, fractionDigits: 1 });
      const hotelImages = faker.helpers.arrayElements(imageIds, 5).map(photo);
      const hotelPerks = faker.helpers.arrayElements(perks, { min: 3, max: 5 });
      const description = `${faker.company.catchPhrase()}. ${faker.lorem.sentences(faker.number.int({ min: 1, max: 2 }))}`;
      const hotel = {
        name, city, locality, country: "India", state, category: faker.helpers.arrayElement(categories), starRating,
        guestRating, reviewCount: faker.number.int({ min: 24, max: 5800 }), pricePerNight,
        originalPrice: Math.round(pricePerNight / (1 - discount / 100)), taxesAndFees: Math.round(pricePerNight * 0.12),
        images: hotelImages, perks: hotelPerks, promoTag: `DREAMPLACE - ${discount}% OFF`, slug, description,
        guestCapacity: faker.number.int({ min: 1, max: 6 }), isAvailable: true, seedBatch: "india-5000-v1",
      };
      const post = {
        title: name, slug, city, hotelLocation: `${locality}, ${city}, ${state}, India`, description,
        images: hotelImages.slice(0, 3), isAvailable: true, isDemo: true,
        guest: Math.min(6, hotel.guestCapacity), price: pricePerNight, rating: guestRating,
        nearArea: [locality, city], facilities: hotelPerks,
      };
      listings.push({ hotel, post });
    }
  });
  return listings;
};

export async function seedAllHotels() {
  const listings = buildInventory();
  const category = await Category.findOneAndUpdate(
    { name: "India" }, { $set: { slug: "india" } }, { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const slugs = listings.map(({ hotel }) => hotel.slug);
  const [existingHotels, existingPosts] = await Promise.all([
    Hotel.find({ slug: { $in: slugs } }).select("slug").lean(),
    Post.find({ slug: { $in: slugs } }).select("_id slug").lean(),
  ]);
  const hotelSlugs = new Set(existingHotels.map(({ slug }) => slug));
  const postIds = new Map(existingPosts.map(({ slug, _id }) => [slug, _id]));
  const postsToInsert = [];
  for (const { hotel, post } of listings) {
    if (!postIds.has(hotel.slug)) {
      const _id = new mongoose.Types.ObjectId();
      postIds.set(hotel.slug, _id);
      postsToInsert.push({ _id, ...post, category: category._id });
    }
  }
  const hotelsToInsert = listings
    .filter(({ hotel }) => !hotelSlugs.has(hotel.slug))
    .map(({ hotel }) => ({ ...hotel, postId: postIds.get(hotel.slug) }));

  for (const batch of batches(postsToInsert)) await Post.insertMany(batch, { ordered: false });
  for (const batch of batches(hotelsToInsert)) await Hotel.insertMany(batch, { ordered: false });
  console.log(`Seed complete: ${listings.length.toLocaleString()} Indian hotels across ${stateCities.length} states; ${hotelsToInsert.length.toLocaleString()} new Hotel records and ${postsToInsert.length.toLocaleString()} linked detail records inserted.`);
  for (const { state } of stateCities) console.log(`${state}: ${baseCount + (stateCities.findIndex((item) => item.state === state) < extraCount ? 1 : 0)} listings`);
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  connectToDb()
    .then(seedAllHotels)
    .catch((error) => { console.error("Hotel inventory seeding failed:", error.message); process.exitCode = 1; })
    .finally(async () => { await mongoose.disconnect(); });
}
