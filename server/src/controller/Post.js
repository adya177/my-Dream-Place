import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";
import slug from "slugify";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";

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
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const minPrice = Math.max(0, Number(req.query.minPrice) || 0);
    const maxPrice = Math.max(minPrice, Number(req.query.maxPrice) || 15000);
    const city = String(req.query.city || req.query.keyword || "").trim();
    const rawAmenities = req.query.amenity ?? req.query.amenities ?? "";
    const amenities = (Array.isArray(rawAmenities) ? rawAmenities : String(rawAmenities).split(","))
      .map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
    const requestedStars = (Array.isArray(req.query.stars) ? req.query.stars : String(req.query.stars || "").split(","))
      .map(Number).filter((rating) => rating >= 1 && rating <= 5);
    const minRating = Math.min(...requestedStars, 5);
    const query = { price: { $gte: minPrice, $lte: maxPrice }, isAvailable: true };

    if (city) {
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matchingCategories = await Category.find({ name: { $regex: escapedCity, $options: "i" } }).select("_id").lean();
      query.$or = [
        { city: { $regex: `^${escapedCity}`, $options: "i" } },
        { hotelLocation: { $regex: escapedCity, $options: "i" } },
        { title: { $regex: escapedCity, $options: "i" } },
        ...(matchingCategories.length ? [{ category: { $in: matchingCategories.map(({ _id }) => _id) } }] : []),
      ];
    }
    if (amenities.length) query.facilities = { $all: amenities };
    if (requestedStars.length) query.rating = { $gte: minRating };
    const guests = Number(req.query.guests);
    if (Number.isInteger(guests) && guests > 0) query.guest = { $gte: guests };

    const checkIn = req.query.checkIn ? new Date(`${req.query.checkIn}T00:00:00.000Z`) : null;
    const checkOut = req.query.checkOut ? new Date(`${req.query.checkOut}T00:00:00.000Z`) : null;
    if (checkIn && checkOut && !Number.isNaN(checkIn.getTime()) && !Number.isNaN(checkOut.getTime()) && checkOut > checkIn) {
      const conflictingBookings = await Booking.find({
        status: { $ne: "cancelled" },
        bookingDate: { $lt: checkOut },
        $or: [
          { checkOutDate: { $gt: checkIn } },
          { checkOutDate: { $exists: false }, bookingDate: { $gte: checkIn } },
        ],
      }).distinct("post");
      if (conflictingBookings.length) query._id = { $nin: conflictingBookings };
    }

    const [posts, total] = await Promise.all([
      Post.aggregate([
        { $match: query },
        { $sort: { rating: -1, _id: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { title: 1, hotelLocation: 1, city: 1, images: 1, description: 1, slug: 1, price: 1, rating: 1, isAvailable: 1, isDemo: 1, facilities: 1, category: 1 } },
      ]),
      Post.countDocuments(query),
    ]);
    const postIds = posts.map(({ _id }) => _id);
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
    res.json({ success: true, posts: posts.map((post) => ({ ...post, bookedDates: bookedByPost.get(String(post._id)) || [] })), total, page, limit, hasMore: page * limit < total });
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
