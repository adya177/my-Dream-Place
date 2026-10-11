import React, { useState } from "react";
import { Link } from "react-router-dom";


const destinations = [
  { name: "Kyoto", country: "Japan", tag: "Temples, gardens and quiet streets", query: "Kyoto", kind: "Culture", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85", alt: "Traditional street in Kyoto framed by historic buildings" },
  { name: "Amalfi Coast", country: "Italy", tag: "Cliffside villages by the sea", query: "Amalfi", kind: "Coast", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85", alt: "Colorful coastal village on the Italian Riviera" },
  { name: "Bali", country: "Indonesia", tag: "Tropical landscapes and island stays", query: "Bali", kind: "Island", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85", alt: "Bali temple surrounded by tropical greenery" },
  { name: "Santorini", country: "Greece", tag: "Blue domes and Aegean sunsets", query: "Santorini", kind: "Island", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85", alt: "Whitewashed Santorini buildings above the sea" },
  { name: "Maldives", country: "Indian Ocean", tag: "Clear water and island escapes", query: "Maldives", kind: "Island", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85", alt: "Turquoise water along a tropical beach" },
  { name: "Paris", country: "France", tag: "Neighbourhood cafés and city walks", query: "Paris", kind: "City", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85", alt: "Paris skyline with the Eiffel Tower at golden hour" },
];

const filters = ["All places", "Island", "Coast", "City", "Culture"];

const DreamVacation = () => {
  const [activeFilter, setActiveFilter] = useState("All places");
  const visibleDestinations = activeFilter === "All places" ? destinations : destinations.filter((destination) => destination.kind === activeFilter);

  return (
    <section id="discover" className="mx-auto mt-10 max-w-7xl scroll-mt-28 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-sm font-bold uppercase tracking-[.17em] text-blue-600">A good trip starts somewhere</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Find your kind of getaway</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Beach mornings, city nights, or a little bit of everything. What sounds like you?</p></div>
        <Link to="/search" className="inline-flex shrink-0 font-bold text-blue-700 transition hover:text-blue-900">Browse all stays <span aria-hidden="true" className="ml-2">→</span></Link>
      </div>
      <div role="group" aria-label="Filter destinations by trip style" className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => <button type="button" aria-pressed={activeFilter === filter} key={filter} onClick={() => setActiveFilter(filter)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${activeFilter === filter ? "bg-slate-900 text-white shadow-md" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>{filter}</button>)}
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDestinations.map((destination) => <Link key={destination.name} to={"/destination/" + destination.query.toLowerCase().replace(/ /g, "-")} className="group relative isolate min-h-[330px] overflow-hidden rounded-[1.6rem] bg-slate-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
          <img src={destination.image} alt={destination.alt} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-slate-950/10" />
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur">{destination.kind} escape</span>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-sm font-semibold text-white/75">{destination.country}</p><h3 className="mt-1 text-2xl font-extrabold tracking-tight">{destination.name}</h3><p className="mt-2 text-sm text-white/85">{destination.tag}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Explore destination <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span></span></div>
        </Link>)}
      </div>
      <p className="mt-5 text-xs text-slate-500">Destination photography from Unsplash. Listings and availability appear in stay search.</p>
    </section>
  );
};


export default DreamVacation;
