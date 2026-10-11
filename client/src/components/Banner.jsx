import React, { useMemo, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import BannerImage from "../assets/Rectangle 2.png";
import { useSearch } from "../context/Serach";
import { useNavigate } from "react-router-dom";

const destinations = [
  { name: "Bali", detail: "Indonesia · Island escapes" },
  { name: "Kyoto", detail: "Japan · Temples and gardens" },
  { name: "Paris", detail: "France · City stays" },
  { name: "Santorini", detail: "Greece · Sea views" },
  { name: "Maldives", detail: "Indian Ocean · Beach resorts" },
  { name: "Sydney", detail: "Australia · Harbour stays" },
];

const Banner = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const query = (search.keyword || "").trim();
  const suggestions = useMemo(() => {
    if (!query) return destinations;
    return destinations.filter((destination) => destination.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const handleSearch = async (event, selectedKeyword) => {
    event?.preventDefault();
    const keyword = (selectedKeyword || search.keyword || "").trim();
    if (!keyword) {
      toast.info("Enter a destination or hotel name to search.");
      return;
    }
    setSearch((current) => ({ ...current, keyword }));
    setIsOpen(false);
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

  const openDestinationGuide = (name) => {
    setSearch((current) => ({ ...current, keyword: name }));
    setIsOpen(false);
    navigate("/destination/" + name.toLowerCase().replace(/ /g, "-"));
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && isOpen) {
      event.preventDefault();
      setActiveIndex((index) => (suggestions.length ? (index + 1) % suggestions.length : 0));
    } else if (event.key === "ArrowUp" && isOpen) {
      event.preventDefault();
      setActiveIndex((index) => (suggestions.length ? (index - 1 + suggestions.length) % suggestions.length : 0));
    } else if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Enter" && isOpen && suggestions.length) {
      event.preventDefault();
      openDestinationGuide(suggestions[activeIndex]?.name || suggestions[0].name);
    }
  };

  return (
    <section className="relative isolate min-h-[460px] bg-cover bg-center sm:min-h-[500px]" style={{ backgroundImage: "url(" + BannerImage + ")" }}>
      <div className="absolute inset-0 -z-10 bg-slate-950/50" />
      <div className="mx-auto flex min-h-[460px] max-w-7xl flex-col items-center justify-center px-5 py-14 text-center text-white sm:min-h-[500px] sm:px-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Find your next escape</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Make room for a great getaway</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">Explore places to stay, discover inspiring destinations, and plan a trip that feels like yours.</p>

        <form onSubmit={(event) => handleSearch(event)} className="relative mt-8 w-full max-w-3xl rounded-2xl bg-white p-2 shadow-2xl sm:flex sm:items-center sm:gap-2">
          <div className="relative min-w-0 flex-1">
            <FaMapMarkerAlt aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
            <input
              id="home-destination"
              type="search"
              role="combobox"
              aria-label="Search destinations"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls="destination-suggestions"
              aria-activedescendant={isOpen && suggestions.length ? "destination-option-" + activeIndex : undefined}
              autoComplete="off"
              placeholder="Where do you want to go?"
              className="w-full rounded-xl border-0 bg-white py-4 pl-11 pr-4 text-left text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
              value={search.keyword || ""}
              onFocus={() => { setActiveIndex(0); setIsOpen(true); }}
              onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
              onChange={(event) => { setSearch((current) => ({ ...current, keyword: event.target.value })); setActiveIndex(0); setIsOpen(true); }}
              onKeyDown={handleKeyDown}
            />
            {isOpen && (suggestions.length > 0 || query) && (
              <div id="destination-suggestions" role="listbox" aria-label="Suggested destinations" className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 text-left text-slate-900 shadow-2xl">
                {suggestions.map((destination, index) => (
                  <button
                    id={"destination-option-" + index}
                    key={destination.name}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openDestinationGuide(destination.name)}
                    className={"flex w-full items-center gap-3 px-4 py-3 text-left transition " + (index === activeIndex ? "bg-blue-50" : "hover:bg-slate-50")}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700"><FaMapMarkerAlt aria-hidden="true" /></span>
                    <span className="min-w-0"><span className="block font-semibold">{destination.name}</span><span className="block text-sm text-slate-500">{destination.detail}</span></span>
                  </button>
                ))}
                {suggestions.length === 0 && query && (
                  <button type="submit" className="w-full px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50">Search for “{query}”</button>
                )}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70 sm:mt-0 sm:w-auto">
            {loading ? "Searching…" : "Search stays"}
          </button>
        </form>
        <p className="mt-3 text-sm text-slate-100">Popular searches: Bali · Kyoto · Paris · Maldives</p>
      </div>
    </section>
  );
};

export default Banner;
