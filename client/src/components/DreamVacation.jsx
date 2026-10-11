import React from "react";
import { Link } from "react-router-dom";

const destinations = [
  { name: "Kyoto, Japan", tag: "Temples, gardens and quiet streets", query: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85", alt: "Traditional street in Kyoto framed by historic buildings" },
  { name: "Amalfi Coast, Italy", tag: "Cliffside villages by the sea", query: "Amalfi", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85", alt: "Colorful coastal village on the Italian Riviera" },
  { name: "Bali, Indonesia", tag: "Tropical landscapes and island stays", query: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85", alt: "Bali temple surrounded by tropical greenery" },
  { name: "Santorini, Greece", tag: "Blue domes and Aegean sunsets", query: "Santorini", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85", alt: "Whitewashed Santorini buildings above the sea" },
  { name: "Maldives", tag: "Clear water and island escapes", query: "Maldives", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85", alt: "Turquoise water along a tropical beach" },
  { name: "Paris, France", tag: "Neighbourhood cafés and city walks", query: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85", alt: "Paris skyline with the Eiffel Tower at golden hour" },
];

const DreamVacation = () => (
  <section id="discover" className="mx-auto mt-14 max-w-7xl scroll-mt-6 px-5 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Get inspired</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Find your kind of getaway</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Explore places travellers dream about, then search for a stay that suits your plans.</p></div>
      <Link to="/search" className="font-semibold text-blue-700 hover:text-blue-900">Browse all stays <span aria-hidden="true">→</span></Link>
    </div>
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => <Link key={destination.name} to={"/search?keyword=" + encodeURIComponent(destination.query)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
        <div className="relative h-56 overflow-hidden"><img src={destination.image} alt={destination.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">Travel inspiration</span></div>
        <div className="p-5"><h3 className="text-xl font-semibold text-slate-900">{destination.name}</h3><p className="mt-1 text-sm text-slate-600">{destination.tag}</p><span className="mt-4 inline-flex font-semibold text-blue-700">Search this destination <span className="ml-2" aria-hidden="true">→</span></span></div>
      </Link>)}
    </div>
    <p className="mt-4 text-xs text-slate-500">Destination photos from Unsplash. Listings and availability are shown in search results.</p>
  </section>
);

export default DreamVacation;
