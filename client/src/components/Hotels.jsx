import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { Link } from "react-router-dom";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

const Hotels = () => {
  const [posts, setPosts] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    let active = true;
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/get-all-post`)
      .then((res) => { if (active) setPosts(Array.isArray(res.data?.posts) ? res.data.posts : []); })
      .catch((error) => console.error("Could not load featured stays", error));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (posts.length < 1) return undefined;
    const interval = setInterval(() => {
      setImageIndexes((previous) => {
        const next = { ...previous };
        posts.forEach((post) => {
          const imageCount = post.images?.length || 0;
          if (imageCount > 1) next[post._id] = ((previous[post._id] || 0) + 1) % imageCount;
        });
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [posts]);

  return (
    <section className="mx-auto mt-14 max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-600">Handpicked for you</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Popular stays</h2><p className="mt-2 text-slate-600">Places to make your next getaway feel special.</p></div>
        <Link to="/search" className="font-semibold text-blue-700 transition hover:text-blue-900">See all stays <span aria-hidden="true">→</span></Link>
      </div>
      {posts.length ? (
        <Carousel responsive={responsive} removeArrowOnDeviceType={["mobile"]} itemClass="px-2 pb-2" containerClass="-mx-2" dotListClass="!static mt-4" showDots={posts.length > 3}>
          {posts.map((hotel) => {
            const images = hotel.images || [];
            const image = images[imageIndexes[hotel._id] || 0];
            return <Link to={`/product/${hotel.slug}`} key={hotel._id} className="group mx-auto block h-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none">
              <div className="relative h-64 overflow-hidden bg-slate-100">{image ? <img src={image} alt={hotel.title || "Featured stay"} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-slate-400">Stay photo coming soon</div>}<span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">Featured stay</span></div>
              <div className="p-5"><h3 className="text-lg font-bold text-slate-900">{hotel.title}</h3><p className="mt-1 text-sm text-slate-500">{hotel.hotelLocation || "Explore this destination"}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="font-semibold text-blue-700">View stay</span><span className="text-blue-700 transition group-hover:translate-x-1" aria-hidden="true">→</span></div></div>
            </Link>;
          })}
        </Carousel>
      ) : <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">Featured stays are loading. <Link to="/search" className="font-semibold text-blue-700">Search all stays</Link></div>}
    </section>
  );
};

export default Hotels;
