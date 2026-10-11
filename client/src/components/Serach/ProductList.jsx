import React from "react";
import { Link } from "react-router-dom";

const ProductList = ({ products = [] }) => (
  <div className="w-full min-w-0">
    <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <h2 className="text-xl font-semibold text-slate-900">{products.length} {products.length === 1 ? "stay" : "stays"} to explore</h2>
      <p className="text-sm text-slate-500">Select a stay to see details and availability.</p>
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((post) => (
        <Link to={"/product/" + post.slug} key={post._id || post.slug} aria-label={"View " + post.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
          <div className="relative h-56 bg-slate-100">
            {post.images?.[0] ? <img src={post.images[0]} alt={post.title || "Stay"} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">Photo coming soon</div>}
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">{post.hotelLocation || "Destination"}</span>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-slate-900">{post.title || "Stay details"}</h3>
            {post.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.description}</p>}
            <span className="mt-4 inline-flex font-semibold text-blue-700">View stay <span aria-hidden="true" className="ml-2">→</span></span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default ProductList;
