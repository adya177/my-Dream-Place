import "dotenv/config";
import mongoose from "mongoose";
import slugify from "slugify";
import { faker } from "@faker-js/faker";
import { connectToDb } from "../src/config/db.js";
import Category from "../src/models/Category.js";
import Hotel from "../src/models/Hotel.js";
import Post from "../src/models/Post.js";

const brands = ["Taj", "ITC", "The Leela", "Oberoi", "Lemon Tree", "Radisson Blu", "Treebo Trend", "FabHotel", "Oyo Rooms", "Sterling", "Club Mahindra", "Vivanta", "Trident", "Novotel", "Hyatt Regency"];
const suffixes = ["Palace", "Resort & Spa", "Residency", "Boutique Hotel", "Grand", "Retreat", "Inn", "Suites"];
const stateCityMap = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Coorg"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Rajgir"],
  "Delhi": ["New Delhi", "Connaught Place", "Aerocity", "Saket"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Noida"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Ooty", "Kodaikanal"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Munnar", "Wayanad", "Alleppey"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Kutch"],
  "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Durgapur", "Howrah"],
  "Goa": ["Panaji", "Vagator", "Baga", "Palolem", "Morjim"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Secunderabad"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur"],
  "Punjab": ["Amritsar", "Chandigarh", "Ludhiana", "Jalandhar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain"],
  "Odisha": ["Bhubaneswar", "Puri", "Cuttack", "Rourkela"],
  "Assam": ["Guwahati", "Dibrugarh", "Jorhat", "Kaziranga"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Dalhousie"],
  "Uttarakhand": ["Dehradun", "Mussoorie", "Rishikesh", "Nainital"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Jagdalpur"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Deoghar"],
  "Manipur": ["Imphal", "Bishnupur", "Ukhrul"],
  "Meghalaya": ["Shillong", "Cherrapunji", "Tura"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Sikkim": ["Gangtok", "Pelling", "Namchi"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
  "Andaman and Nicobar Islands": ["Sri Vijaya Puram", "Havelock Island", "Neil Island"],
  "Chandigarh": ["Sector 17", "Sukhna Lake", "Elante City"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Gulmarg"],
  "Ladakh": ["Leh", "Kargil", "Nubra Valley"],
  "Lakshadweep": ["Kavaratti", "Agatti", "Bangaram"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe"],
};

const categories = ["Luxury", "Resorts", "Boutique", "Business", "Beachfront", "Heritage"];
const perks = ["Free Cancellation", "Breakfast Included", "Pool Access", "Free Wi-Fi", "Airport Transfer", "Spa Credit", "Late Checkout", "Ocean View"];
const localities = ["City Centre", "Old Town", "Airport Road", "Lake Road", "Heritage Quarter", "Business District", "Garden Enclave", "Market District"];
const citiesPerState = 100;

function validateCityMap() {
  const entries = Object.entries(stateCityMap);
  if (entries.length !== 36 || entries.some(([, cities]) => !Array.isArray(cities) || cities.length < 2)) {
    throw new Error("The India state and territory map must contain 36 entries with at least two cities each.");
  }
  return entries;
}

function createListings(state, cities, stateIndex, batchId, categoryIds) {
  return Array.from({ length: citiesPerState }, (_, itemIndex) => {
    const city = faker.helpers.arrayElement(cities);
    const brand = faker.helpers.arrayElement(brands);
    const suffix = faker.helpers.arrayElement(suffixes);
    const title = `${brand}${faker.datatype.boolean() ? ` ${city}` : ""} ${suffix}`;
    const locality = faker.helpers.arrayElement(localities);
    const category = faker.helpers.arrayElement(categories);
    const starRating = faker.helpers.arrayElement([3, 4, 5]);
    const guestRating = faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 });
    const price = faker.number.int({ min: 1500, max: 25000 });
    const discount = faker.number.int({ min: 10, max: 35 });
    const originalPrice = Math.round(price / (1 - discount / 100));
    const slug = `${slugify(`${title}-${city}-${state}`, { lower: true, strict: true })}-${batchId}-${itemIndex + 1}`;
    const images = [0, 1, 2].map((imageIndex) =>
      `https://picsum.photos/seed/${batchId}-${stateIndex}-${itemIndex}-${imageIndex}/800/600`,
    );
    const selectedPerks = faker.helpers.arrayElements(perks, { min: 3, max: 5 });
    const description = `${title} offers ${faker.company.catchPhrase().toLowerCase()} in ${city}, ${state}. ${faker.lorem.sentence()}`;
    const postId = new mongoose.Types.ObjectId();
    const hotelId = new mongoose.Types.ObjectId();

    return {
      post: {
        _id: postId,
        title,
        slug,
        city,
        hotelLocation: `${locality}, ${city}, ${state}, India`,
        description,
        category: categoryIds.get(category),
        images,
        guest: faker.number.int({ min: 1, max: 6 }),
        price,
        rating: guestRating,
        nearArea: [locality, city],
        facilities: selectedPerks,
        isAvailable: true,
        isDemo: true,
      },
      hotel: {
        _id: hotelId,
        postId,
        name: title,
        slug,
        city,
        locality,
        country: "India",
        state,
        starRating,
        guestRating,
        reviewCount: faker.number.int({ min: 25, max: 5000 }),
        category,
        pricePerNight: price,
        originalPrice,
        taxesAndFees: Math.round(price * 0.12),
        images,
        perks: selectedPerks,
        promoTag: `DREAMPLACE - ${discount}% OFF`,
        description,
        guestCapacity: faker.number.int({ min: 1, max: 6 }),
        isAvailable: true,
        seedBatch: batchId,
      },
    };
  });
}

export async function seedIndianHotels() {
  const stateEntries = validateCityMap();
  const batchId = Date.now().toString(36);
  await connectToDb();

  const categoryIds = new Map();
  for (const name of categories) {
    const category = await Category.findOneAndUpdate(
      { name },
      { $setOnInsert: { slug: slugify(name, { lower: true }) } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categoryIds.set(name, category._id);
  }

  const oldHotels = await Hotel.find({}).select("_id postId").lean();
  const oldHotelIds = oldHotels.map(({ _id }) => _id);
  const oldHotelPostIds = oldHotels.map(({ postId }) => postId).filter(Boolean);
  const oldDemoPosts = oldHotelPostIds.length
    ? await Post.find({ _id: { $in: oldHotelPostIds }, isDemo: true }).distinct("_id")
    : [];
  const listings = stateEntries.flatMap(([state, cities], stateIndex) =>
    createListings(state, cities, stateIndex, batchId, categoryIds),
  );
  const postDocuments = listings.map(({ post }) => post);
  const hotelDocuments = listings.map(({ hotel }) => hotel);

  if (postDocuments.length !== 3600 || hotelDocuments.length !== 3600) {
    throw new Error(`Expected 3,600 listings but generated ${hotelDocuments.length}.`);
  }

  try {
    await Post.insertMany(postDocuments, { ordered: true });
    await Hotel.insertMany(hotelDocuments, { ordered: true });
  } catch (error) {
    await Promise.allSettled([
      Hotel.deleteMany({ seedBatch: batchId }),
      Post.deleteMany({ _id: { $in: postDocuments.map(({ _id }) => _id) } }),
    ]);
    throw error;
  }

  await Promise.all([
    oldHotelIds.length ? Hotel.deleteMany({ _id: { $in: oldHotelIds } }) : Promise.resolve(),
    oldDemoPosts.length ? Post.deleteMany({ _id: { $in: oldDemoPosts } }) : Promise.resolve(),
  ]);

  console.log(`Seeded exactly ${citiesPerState} hotels in each of ${stateEntries.length} states and union territories (${hotelDocuments.length} hotels total).`);
  return hotelDocuments.length;
}

seedIndianHotels()
  .catch((error) => {
    console.error("Could not seed Indian hotels:", error?.message || "Unknown error");
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
