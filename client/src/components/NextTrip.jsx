import React from "react";
import { Link } from "react-router-dom";

const stories = [
  { city: "Sydney", title: "A long weekend by the harbour", description: "Pair waterfront walks and landmark views with a relaxed city stay.", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1100&q=85", alt: "Sydney Harbour and the Opera House", query: "Sydney" },
  { city: "Tokyo", title: "A first-timer's guide to Tokyo", description: "Make space for lively neighbourhoods, small cafés and peaceful gardens.", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1100&q=85", alt: "Tokyo city skyline at dusk", query: "Tokyo" },
  { city: "Bali", title: "Slow mornings on an island escape", description: "Find inspiration for a restful trip surrounded by tropical scenery.", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1100&q=85", alt: "Scenic coastal travel destination", query: "Bali" },
];

const NextTrip = () => (
  <section id="activities" className="mx-auto mt-16 max-w-7xl scroll-mt-6 px-5 py-8 sm:px-6 lg:px-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Ideas for the road</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Get inspiration for your next trip</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">A few thoughtful ideas to help you picture where you might go next.</p></div><Link to="/activities" className="font-semibold text-blue-700 hover:text-blue-900">More trip ideas <span aria-hidden="true">→</span></Link></div>
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {stories.map((story) => <Link key={story.city} to={"/search?keyword=" + encodeURIComponent(story.query)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
        <div className="h-56 overflow-hidden"><img src={story.image} alt={story.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
        <div className="p-5"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{story.city}</p><h3 className="mt-2 text-xl font-semibold text-slate-900">{story.title}</h3><p className="mt-2 leading-6 text-slate-600">{story.description}</p><span className="mt-4 inline-flex font-semibold text-blue-700">Search this destination <span className="ml-2" aria-hidden="true">→</span></span></div>
      </Link>)}
    </div>
    <p className="mt-4 text-xs text-slate-500">Travel photos from Unsplash. Destination stories are for inspiration; stay availability is confirmed in search results.</p>
  </section>
);

export default NextTrip;
