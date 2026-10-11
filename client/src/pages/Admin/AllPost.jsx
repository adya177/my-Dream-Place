import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllPost = () => {
  const [posts, setPosts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/get-all-post`
      );
      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 lg:flex-row lg:px-8">
      <Navbar />
      <section className="min-w-0 flex-1 p-2 sm:p-5">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Workspace</p><h1 className="mb-7 mt-2 text-3xl font-bold tracking-tight text-slate-900">All stays</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post._id}
              className="relative isolate flex min-h-72 w-full flex-col justify-end overflow-hidden rounded-2xl px-6 pb-6 pt-32 shadow-lg"
            >
              <img
                src={post.images[currentImageIndex]}
                alt="Post Thumbnail"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <h3 className="z-10 mt-3 text-3xl font-bold text-white">
                {post.hotelLocation}
              </h3>
              <div
                className="z-10 text-sm leading-6 text-gray-300"
                onClick={() => navigate(`/admin/post/${post.slug}`)}
              >
                {post.title}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AllPost;
