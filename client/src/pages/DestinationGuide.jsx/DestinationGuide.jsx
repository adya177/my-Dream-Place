import React from "react";
import { Link, useParams } from "react-router-dom";

const guides = {
  kyoto: { name: "Kyoto", country: "Japan", theme: "Quiet lanes, temple gardens, and traditional tea houses", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=90", alt: "Traditional street in Kyoto", intro: "Take your time among Kyoto’s historic streets, peaceful gardens, and neighbourhood cafés. This guide helps you start planning while accommodation listings are being added." },
  amalfi: { name: "Amalfi Coast", country: "Italy", theme: "Colorful cliffside villages and Mediterranean views", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1800&q=90", alt: "Colorful coastal village in Italy", intro: "Plan a slower coastal escape, with winding village streets, sea views, and long meals along the waterfront. Check back as local stays become available." },
  bali: { name: "Bali", country: "Indonesia", theme: "Tropical landscapes, culture, and island days", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1800&q=90", alt: "Temple and tropical greenery in Bali", intro: "Balance beach time with visits to temples, local markets, and the island’s green interior. We’re preparing accommodation listings for this destination." },
  santorini: { name: "Santorini", country: "Greece", theme: "Whitewashed villages and Aegean sunsets", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1800&q=90", alt: "Whitewashed buildings above the Aegean Sea", intro: "Explore the island’s villages, coastal paths, and caldera views. Stay availability will appear here once verified listings are added." },
  maldives: { name: "Maldives", country: "Indian Ocean", theme: "Clear water, quiet beaches, and island escapes", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=90", alt: "Turquoise water beside a tropical beach", intro: "Start imagining a restorative island trip, from time by the water to quiet evenings by the shore. Accommodation listings are not available yet." },
  paris: { name: "Paris", country: "France", theme: "Neighbourhood cafés, galleries, and city walks", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=90", alt: "Paris and the Eiffel Tower at golden hour", intro: "Build a city break around neighbourhood walks, museums, cafés, and the landmarks that draw you in. We’ll show stays here as they are added." },
  sydney: { name: "Sydney", country: "Australia", theme: "Harbour walks, coastal views, and city culture", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1800&q=90", alt: "Sydney Harbour and the Opera House", intro: "Pair a harbour walk with time at the beaches, gardens, and lively city neighbourhoods. Verified stays will appear here when available." },
  tokyo: { name: "Tokyo", country: "Japan", theme: "Lively neighbourhoods, small cafés, and gardens", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=90", alt: "Tokyo city streets at dusk", intro: "Give yourself room to explore Tokyo one neighbourhood at a time, from busy shopping streets to quieter gardens and cafés." },
};

const DestinationGuide = () => {
  const { slug = "" } = useParams();
  const guide = guides[slug.toLowerCase()];
  if (!guide) return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center"><h1 className="text-3xl font-bold text-slate-900">Destination guide not found</h1><p className="mt-3 text-slate-600">Choose one of our featured destinations to explore.</p><Link to="/discover" className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Explore destinations</Link></main>
  );

  return (
    <main className="min-h-screen bg-white">
      <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-slate-900 sm:min-h-[520px]">
        <img src={guide.image} alt={guide.alt} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-slate-900/10" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-24 sm:px-10 sm:pb-16">
          <Link to="/discover" className="text-sm font-semibold text-white/90 hover:text-white">← All destinations</Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Destination guide · {guide.country}</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-6xl">Discover {guide.name}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/90">{guide.theme}</p>
          <Link to={"/search?keyword=" + encodeURIComponent(guide.name)} className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 shadow hover:bg-blue-50">Check available stays <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">A place to begin</p><h2 className="mt-3 text-3xl font-bold text-slate-900">A little inspiration for {guide.name}</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{guide.intro}</p><p className="mt-5 max-w-3xl leading-7 text-slate-600">Browse the ideas, save this destination for later, or search for accommodation. Search results show only stays currently listed in the booking system.</p></article>
        <aside className="h-fit rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="text-sm font-semibold uppercase tracking-wide text-amber-800">Stay availability</p><h2 className="mt-2 text-xl font-bold text-slate-900">Listings are being added</h2><p className="mt-3 text-sm leading-6 text-slate-700">There are no bookable stays for {guide.name} yet. We’ll display them here once the property listings have been added and verified.</p><Link to={"/search?keyword=" + encodeURIComponent(guide.name)} className="mt-5 inline-flex font-semibold text-blue-700 hover:text-blue-900">Check again <span className="ml-2" aria-hidden="true">→</span></Link></aside>
      </section>
      <p className="mx-auto max-w-7xl px-6 pb-10 text-xs text-slate-500 sm:px-10">Destination photography from Unsplash.</p>
    </main>
  );
};

export default DestinationGuide;
