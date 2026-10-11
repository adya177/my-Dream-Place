import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [hotelLocation, setHotelLocation] = useState("");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState("");
  const [nearArea, setNearArea] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [guest, setGuest] = useState("1");
  const [isAvailable, setIsAvailable] = useState(false);
  const [price, setPrice] = useState("");

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/category/get-category`
      );
      setCategory(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.warn("You can only upload a maximum of 3 images.");
    } else {
      setImages(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !title ||
      !hotelLocation ||
      !description ||
      !facilities ||
      !nearArea ||
      !selectedCategory ||
      !guest ||
      !price
    ) {
      return toast.error("All fields are required.");
    }

    if (images.length !== 3) {
      return toast.error("Please upload exactly 3 images.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("hotelLocation", hotelLocation);
    formData.append("description", description);
    formData.append("facilities", facilities);
    formData.append("nearArea", nearArea);
    formData.append("category", selectedCategory);
    formData.append("guest", guest);
    formData.append("isAvailable", isAvailable);
    formData.append("price", price);

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/post/create-post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Post created successfully!");
      // Reset form
      setTitle("");
      setHotelLocation("");
      setDescription("");
      setFacilities("");
      setNearArea("");
      setSelectedCategory("");
      setImages([]);
      setGuest("1");
      setIsAvailable(false);
      setPrice("");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    }
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 lg:flex-row lg:px-8">
      <Navbar />
      <section className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Workspace</p><h1 className="mb-7 mt-2 text-3xl font-bold tracking-tight text-slate-900">Add a new stay</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full max-w-2xl p-3 border bg-white border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Hotel Location"
            value={hotelLocation}
            onChange={(e) => setHotelLocation(e.target.value)}
            className="w-full max-w-2xl bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full max-w-2xl bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Facilities"
            value={facilities}
            onChange={(e) => setFacilities(e.target.value)}
            className="w-full max-w-2xl bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full max-w-2xl bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Nearby Area"
            value={nearArea}
            onChange={(e) => setNearArea(e.target.value)}
            className="w-full max-w-2xl bg-white p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full max-w-2xl bg-white text-black border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {category?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="guest"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Guests
            </label>
            <select
              id="guest"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              className="w-full max-w-2xl bg-white border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            >
              {[...Array(6)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="isAvailable"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Availability
            </label>
            <select
              id="isAvailable"
              value={isAvailable}
              onChange={(e) =>
                setIsAvailable(e.target.value === "true" ? true : false)
              }
              className="w-full max-w-2xl bg-white border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          <div className="w-full max-w-2xl p-3 border border-gray-300 rounded">
            <label className="flex items-center cursor-pointer">
              <FaImage className="mr-2 text-gray-600" />
              <span>Upload Images (max 3)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <div className="flex space-x-4 mt-2">
              {images.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full max-w-2xl bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300"
          >
            Submit Post
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;
