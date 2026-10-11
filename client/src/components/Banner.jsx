import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import BannerImage from "../assets/Rectangle 2.png";
import { useSearch } from "../context/Serach";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const keyword = (search.keyword || "").trim();
    if (!keyword) {
      toast.info("Enter a destination or hotel name to search.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + "/api/booking/search/" + encodeURIComponent(keyword));
      setSearch((current) => ({ ...current, keyword, results: Array.isArray(response.data) ? response.data : [] }));
      navigate("/search");
    } catch (error) {
      const message = error.response?.data?.message || "Search is temporarily unavailable. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-[460px] bg-cover bg-center sm:min-h-[500px]" style={{ backgroundImage: "url(" + BannerImage + ")" }}>
      <div className="absolute inset-0 -z-10 bg-slate-950/50" />
      <div className="mx-auto flex min-h-[460px] max-w-7xl flex-col items-center justify-center px-5 py-16 text-center text-white sm:min-h-[500px]">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Find your next escape</p>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Make room for a great getaway</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">Explore places to stay, discover inspiring destinations, and plan a trip that feels like yours.</p>
        <form onSubmit={handleSearch} className="mt-9 flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="home-destination">Search destinations</label>
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-blue-600 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <FaMapMarkerAlt aria-hidden="true" />
            <input id="home-destination" type="search" placeholder="Search a city or property" className="min-w-0 flex-1 border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400" value={search.keyword || ""} onChange={(event) => setSearch((current) => ({ ...current, keyword: event.target.value }))} />
          </div>
          <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400">{loading ? "Searching…" : "Search stays"}</button>
        </form>
      </div>
    </section>
  );
};

export default Banner;
