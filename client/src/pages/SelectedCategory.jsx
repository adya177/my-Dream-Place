import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const SelectedCategory = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
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
          setCategory(response.data?.category || null);
          setPosts(Array.isArray(response.data?.products) ? response.data.products.filter(Boolean) : []);
        }
      } catch (error) {
        if (isCurrent) {
          toast.error(error?.response?.data?.message || "Could not load this category.");
        }
      } finally {
        if (isCurrent) setLoading(false);
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
    <main className="mx-auto min-h-[55vh] max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Explore stays</p><h1 className="mb-7 mt-2 text-3xl font-bold tracking-tight text-slate-900">{category?.name}</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? <div className="skeleton-card" aria-label="Loading category stays"><div className="skeleton-block skeleton-image"/><div className="skeleton-content"><div className="skeleton-block skeleton-line"/><div className="skeleton-block skeleton-line medium"/></div></div> : posts?.map?.((post, index) => post && (
          <Link
            to={`/product/${post.slug}`}
            key={post._id || post.slug || index}
            aria-label={`View ${post.title}`}
            className="relative isolate flex min-h-80 w-full flex-col justify-end overflow-hidden rounded-2xl px-6 pb-6 pt-32 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <img
              src={(Array.isArray(post.images) ? post.images[currentImageIndex] || post.images[0] : "") || "https://via.placeholder.com/150"}
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
    </main>
  );
};

export default SelectedCategory;
