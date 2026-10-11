import React from "react";
import { Link } from "react-router-dom";

const RelatedProduct = ({ relatedProducts = [] }) => (
  relatedProducts.length ? (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {relatedProducts.map((stay) => (
        <Link to={`/product/${stay.slug}`} key={stay._id || stay.slug} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none">
          <div className="h-52 overflow-hidden bg-slate-100">{stay.images?.[0] ? <img src={stay.images[0]} alt={stay.title || "Recommended stay"} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-slate-500">Photo coming soon</div>}</div>
          <div className="p-5"><h3 className="font-bold text-slate-900">{stay.title}</h3><p className="mt-1 text-sm text-slate-500">{stay.hotelLocation || "Explore this destination"}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4"><span className="font-bold text-slate-900">${Number(stay.price || 0).toLocaleString("en-US")} <span className="text-xs font-normal text-slate-500">/ night</span></span><span className="font-semibold text-blue-700">View stay →</span></div></div>
        </Link>
      ))}
    </div>
  ) : <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No similar stays to show yet. <Link to="/search" className="font-semibold text-blue-700">Explore all stays</Link></p>
);

export default RelatedProduct;
