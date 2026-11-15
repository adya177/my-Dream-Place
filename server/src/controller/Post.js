import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";
import slug from "slugify";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const createPostController = async (req, res) => {
  try {
    const {
      title,
      hotelLocation,
      city,
      description,
      facilities,
      nearArea,
      category,
      guest,
      isAvailable,
      price,
    } = req.body;
    const files = req.files?.images;

    if (
      !title ||
      !description ||
      !facilities ||
      !nearArea ||
      !hotelLocation ||
      !category ||
      !guest ||
      !isAvailable ||
      !price
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!files || files.length !== 3) {
      return res
        .status(400)
        .json({ message: "Please upload exactly 3 images." });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map((file) =>
        cloudinary.uploader
          .upload(file.tempFilePath)
          .then((result) => result.secure_url)
      )
    );

    // Create new post
    const newPost = new Post({
      title,
      hotelLocation,
      city: city || hotelLocation.split(",")[0].trim(),
      description,
      facilities,
      nearArea,
      category,
      guest,
      isAvailable,
      price,
      images: imageUrls,
      slug: slug(title, { lower: true }),
    });

    // Save post to MongoDB
    await newPost.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostController = async (req, res) => {
  try {
    const product = await Post.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

export const getAllPostController = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const [posts, total] = await Promise.all([
      Post.find({}).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit),
      Post.countDocuments({}),
    ]);
    res.status(200).send({
      success: true,
      message: "All Products Fetched",
      posts,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

export const searchHotelsController = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
    const minPrice = Math.max(0, Number(req.query.minPrice) || 0);
    const maxPrice = Math.max(minPrice, Number(req.query.maxPrice) || 15000);
    const city = String(req.query.city || req.query.keyword || "").trim();
    const requestedCategory = String(req.query.category || "").trim();
    const rawAmenities = req.query.amenity ?? req.query.amenities ?? "";
    const amenities = (Array.isArray(rawAmenities) ? rawAmenities : String(rawAmenities).split(","))
      .map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
    const rawStars = req.query.starRating ?? req.query.stars ?? "";
    const starRatings = (Array.isArray(rawStars) ? rawStars : String(rawStars).split(","))
      .map(Number).filter((rating) => [3, 4, 5].includes(rating));
    const minRating = Math.min(...starRatings, 5);
    const query = { pricePerNight: { $gte: minPrice, $lte: maxPrice }, isAvailable: true };

    if (city) {
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [{ city: { $regex: escapedCity, $options: "i" } }, { locality: { $regex: escapedCity, $options: "i" } }, { name: { $regex: escapedCity, $options: "i" } }];
    }
    if (requestedCategory) query.category = requestedCategory;
    if (starRatings.length) query.starRating = { $gte: minRating };
    if (amenities.length) query.perks = { $all: amenities };
    const guests = Number(req.query.guests);
    if (Number.isInteger(guests) && guests > 0) query.guestCapacity = { $gte: guests };

    const sortOptions = {
      price_asc: { pricePerNight: 1 },
      price_desc: { pricePerNight: -1 },
      rating_desc: { guestRating: -1, reviewCount: -1 },
      rating_asc: { guestRating: 1, reviewCount: -1 },
    };
    const sort = sortOptions[req.query.sort] || sortOptions.rating_desc;

    const checkIn = req.query.checkIn ? new Date(`${req.query.checkIn}T00:00:00.000Z`) : null;
    const checkOut = req.query.checkOut ? new Date(`${req.query.checkOut}T00:00:00.000Z`) : null;
    const excludedPosts = await Post.distinct("_id", { isAvailable: false });
    if (excludedPosts.length) query.postId = { $nin: excludedPosts };
    if (checkIn && checkOut && !Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime()) && checkOut > checkIn) {
      const conflictingBookings = await Booking.find({
        status: { $ne: "cancelled" },
        bookingDate: { $lt: checkOut },
        $or: [
          { checkOutDate: { $gt: checkIn } },
          { checkOutDate: { $exists: false }, bookingDate: { $gte: checkIn } },
        ],
      }).distinct("post");
      if (conflictingBookings.length) {
        query.postId = { ...(query.postId || {}), $nin: [...new Set([...(query.postId?.$nin || []), ...conflictingBookings])] };
      }
    }

    const [hotels, total] = await Promise.all([
      Hotel.aggregate([
        { $match: query },
        { $sort: { ...sort, _id: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { name: 1, city: 1, locality: 1, country: 1, starRating: 1, guestRating: 1, reviewCount: 1, category: 1, pricePerNight: 1, originalPrice: 1, taxesAndFees: 1, images: 1, perks: 1, promoTag: 1, slug: 1, description: 1, guestCapacity: 1, postId: 1, isAvailable: 1 } },
      ]),
      Hotel.countDocuments(query),
    ]);
    const postIds = hotels.map(({ postId }) => postId);
    const bookings = postIds.length ? await Booking.find({ post: { $in: postIds }, status: { $ne: "cancelled" } }).select("post bookingDate checkOutDate").lean() : [];
    const bookedByPost = new Map();
    for (const booking of bookings) {
      const id = String(booking.post);
      const dates = bookedByPost.get(id) || [];
      const start = new Date(booking.bookingDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = booking.checkOutDate ? new Date(booking.checkOutDate) : new Date(start.getTime() + 86400000);
      end.setUTCHours(0, 0, 0, 0);
      for (const night = new Date(start); night < end; night.setUTCDate(night.getUTCDate() + 1)) dates.push(night.toISOString().slice(0, 10));
      bookedByPost.set(id, dates);
    }
    const formattedHotels = hotels.map((hotel) => ({
      ...hotel,
      hotelId: String(hotel._id),
      _id: String(hotel.postId),
      title: hotel.name,
      hotelLocation: `${hotel.locality}, ${hotel.city}`,
      price: hotel.pricePerNight,
      rating: hotel.guestRating,
      facilities: hotel.perks,
      guest: hotel.guestCapacity,
      isDemo: true,
      bookedDates: bookedByPost.get(String(hotel.postId)) || [],
    }));
    res.json({ success: true, hotels, posts: formattedHotels, total, page, limit, hasMore: page * limit < total });
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ success: false, message: "Unable to search hotels right now." });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      hotelLocation,
      city,
      description,
      facilities,
      nearArea,
      category,
      guest,
      isAvailable,
      price,
    } = req.body;
    const files = req.files?.images;

    // Find the existing post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Validate fields (optional for update)
    if (
      !title &&
      !hotelLocation &&
      !description &&
      !facilities &&
      !nearArea &&
      !category &&
      !guest &&
      isAvailable === undefined &&
      !price &&
      !files
    ) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    // Handle image update
    let updatedImages = post.images;
    if (files && files.length === 3) {
      // Delete old images from Cloudinary
      await Promise.all(
        post.images.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );

      // Upload new images
      updatedImages = await Promise.all(
        files.map((file) =>
          cloudinary.uploader
            .upload(file.tempFilePath)
            .then((result) => result.secure_url)
        )
      );
    } else if (files && files.length !== 3) {
      return res
        .status(400)
        .json({ message: "Please upload exactly 3 images." });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(hotelLocation && { hotelLocation }),
        ...(city && { city }),
        ...(description && { description }),
        ...(facilities && { facilities }),
        ...(nearArea && { nearArea }),
        ...(category && { category }),
        ...(guest && { guest }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(price && { price }),
        ...(files && { images: updatedImages }),
        ...(title && { slug: slug(title, { lower: true }) }),
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Post updated successfully!", post: updatedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePostController = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const relatedPostController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Post.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(2)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

export const postFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    // Build query object
    let args = {};
    if (checked?.length) args.guest = { $in: checked }; // Match guest count
    if (radio?.length === 2) args.price = { $gte: radio[0], $lte: radio[1] }; // Match price range

    // Fetch filtered posts
    const products = await Post.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const popularPostController = async (req, res) => {
  try {
    const popularPosts = await Post.find({}).sort({ views: -1 }).limit(5);

    res.status(200).send({
      success: true,
      message: "Top 5 popular posts fetched successfully",
      posts: popularPosts,
    });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching popular posts",
      error,
    });
  }
};
