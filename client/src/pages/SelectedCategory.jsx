import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SelectedCategory = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/category/select-category/${slug}`
        );
        if (isCurrent) {
          setCategory(response.data.category);
          setPosts(response.data.products ?? []);
        }
      } catch (error) {
        if (isCurrent) {
          console.error(error);
          toast.error(error.message);
        }
      }
    };

    fetchCategory();
    return () => {
      isCurrent = false;
    };
  }, [slug]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-[92%] p-8 relative bottom-7 mt-11 mx-auto">
      <h1 className="text-2xl font-bold mb-8 mt-5">{category?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            to={`/product/${post.slug}`}
            key={post._id}
            aria-label={`View ${post.title}`}
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 w-[21rem] mx-auto shadow-lg transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <img
              src={post.images?.[currentImageIndex] || post.images?.[0] || "https://via.placeholder.com/150"}
              alt="Post Thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
            <h3 className="z-10 mt-3 text-3xl font-bold text-white">
              {post.hotelLocation}
            </h3>
            <div className="z-10 text-sm leading-6 text-gray-300">
              {post.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SelectedCategory;
