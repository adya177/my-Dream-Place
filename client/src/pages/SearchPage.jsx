import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowDown, ChevronLeft, ChevronRight, Map, MapPin, Search, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "../context/Serach";
import { Button } from "../components/ui/button";
import DateRangePicker from "../components/Search/DateRangePicker";
const StayMap = lazy(() => import("../components/Search/StayMap"));

const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80";
const amenities = ["Pool", "Wi-Fi", "Parking", "Spa", "Gym", "Free Breakfast"];
const pageSize = 20;
const cardGridMotion = { hidden: {}, show: { transition: { staggerChildren: 0.075 } } };
const cardItemMotion = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } } };

function StayCard({ stay, checkIn, checkOut }) {
  const images = stay.images?.length ? stay.images : [fallbackImage];
  const [imageIndex, setImageIndex] = useState(0);
  const move = (event, amount) => {
    event.preventDefault(); event.stopPropagation();
    setImageIndex((index) => (index + amount + images.length) % images.length);
  };
  const query = new URLSearchParams();
  if (checkIn) query.set("checkIn", checkIn);
  if (checkOut) query.set("checkOut", checkOut);
  const productLink = `/product/${stay.slug}${query.size ? `?${query}` : ""}`;
  return <article className="stay-card group">
    <div className="stay-card__image"><Link to={productLink} tabIndex={-1} aria-hidden="true" className="stay-card__image-link"><img src={images[imageIndex]} alt="" onError={(event) => { event.currentTarget.src = fallbackImage; }} /></Link>
      {images.length > 1 && <><button aria-label="Previous photo" className="stay-card__arrow stay-card__arrow--left" onClick={(event) => move(event, -1)}><ChevronLeft size={18} /></button><button aria-label="Next photo" className="stay-card__arrow stay-card__arrow--right" onClick={(event) => move(event, 1)}><ChevronRight size={18} /></button><span className="stay-card__count">{imageIndex + 1} / {images.length}</span></>}
    </div>
    <Link to={productLink} className="stay-card__body"><p className="stay-card__location"><MapPin size={15} strokeWidth={1.8} />{stay.hotelLocation || "Destination stay"}<span className="stay-card__rating"><Star size={14} fill="currentColor" />{Number(stay.rating || 4).toFixed(1)}</span></p><h3>{stay.title}</h3><p className="stay-card__description">{stay.description || "A comfortable place to make your trip memorable."}</p><p className="stay-card__price">₹{Number(stay.price || 0).toLocaleString("en-IN")} <span>/ night</span></p></Link>
  </article>;
}
StayCard.propTypes = { stay: PropTypes.shape({ images: PropTypes.arrayOf(PropTypes.string), slug: PropTypes.string, title: PropTypes.string, hotelLocation: PropTypes.string, description: PropTypes.string, price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }).isRequired, checkIn: PropTypes.string, checkOut: PropTypes.string };

function SkeletonCards() {
  return <div className="stay-grid" aria-label="Loading stays">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="skeleton-card"><div className="skeleton-block skeleton-image"/><div className="skeleton-content"><div className="skeleton-block skeleton-line short"/><div className="skeleton-block skeleton-line"/><div className="skeleton-block skeleton-line medium"/></div></div>)}</div>;
}

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const [search, setSearch] = useSearch();
  const [keyword, setKeyword] = useState(params.get("city") || params.get("keyword") || search.keyword || "");
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || "");
  const [guests, setGuests] = useState(params.get("guests") || "2");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "0");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "15000");
  const [stars, setStars] = useState(params.getAll("stars"));
  const [selectedAmenities, setSelectedAmenities] = useState(params.getAll("amenity"));
  const [mapView, setMapView] = useState(params.get("view") === "map");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("city") || new URLSearchParams(location.search).get("keyword") || "";
    setKeyword(query);
    setCheckIn(new URLSearchParams(location.search).get("checkIn") || "");
    setCheckOut(new URLSearchParams(location.search).get("checkOut") || "");
    setGuests(new URLSearchParams(location.search).get("guests") || "2");
    setMinPrice(new URLSearchParams(location.search).get("minPrice") || "0");
    setMaxPrice(new URLSearchParams(location.search).get("maxPrice") || "15000");
    setStars(new URLSearchParams(location.search).getAll("stars"));
    setSelectedAmenities(new URLSearchParams(location.search).getAll("amenity"));
    setMapView(new URLSearchParams(location.search).get("view") === "map");
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get("city") || urlParams.get("keyword") || "";
    if (!query.trim()) { setResults([]); setTotalCount(0); setHasMore(false); setLoading(false); setLoadingMore(false); return; }
    let active = true;
    setLoading(page === 1);
    setLoadingMore(page > 1);
    setSearchError("");
    const requestParams = new URLSearchParams(location.search);
    requestParams.set("city", query.trim());
    requestParams.set("page", String(page));
    requestParams.set("limit", String(pageSize));
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotels?${requestParams.toString()}`)
      .then(({ data }) => { if (active) { const stays = Array.isArray(data?.posts) ? data.posts : []; setResults((previous) => page === 1 ? stays : [...previous, ...stays]); setTotalCount(data?.total || 0); setHasMore(Boolean(data?.hasMore)); setSearch((prev) => ({ ...prev, keyword: query, results: stays })); } })
      .catch((error) => { console.error("Unable to search stays:", error); if (active) { const message = "We couldn't load stays right now. Please try again."; if (page === 1) setResults([]); setSearchError(message); toast.error(message); } })
    .finally(() => { if (active) { setLoading(false); setLoadingMore(false); } });
    return () => { active = false; };
  }, [location.search, page, setSearch]);

  const blockedDates = useMemo(() => {
    if (!results.length) return new Set();
    const candidates = new Set(results.flatMap((stay) => stay.bookedDates || []));
    return new Set([...candidates].filter((date) => results.every((stay) => stay.isAvailable === false || (stay.bookedDates || []).includes(date))));
  }, [results]);

  const visible = results;

  const updateUrl = (event, overrides = {}) => {
    event?.preventDefault();
    const values = { keyword, checkIn, checkOut, guests, minPrice, maxPrice, stars, amenities: selectedAmenities, mapView, ...overrides };
    const query = new URLSearchParams();
    if (values.keyword.trim()) query.set("city", values.keyword.trim());
    if (values.checkIn) query.set("checkIn", values.checkIn);
    if (values.checkOut) query.set("checkOut", values.checkOut);
    if (values.guests) query.set("guests", values.guests);
    if (values.minPrice !== "0") query.set("minPrice", values.minPrice);
    if (values.maxPrice !== "15000") query.set("maxPrice", values.maxPrice);
    values.stars.forEach((star) => query.append("stars", star));
    values.amenities.forEach((amenity) => query.append("amenity", amenity));
    if (values.mapView) query.set("view", "map");
    setPage(1);
    navigate(`/search?${query.toString()}`);
  };

  const resetFilters = () => { setMinPrice("0"); setMaxPrice("15000"); setStars([]); setSelectedAmenities([]); setCheckIn(""); setCheckOut(""); updateUrl(undefined, { minPrice: "0", maxPrice: "15000", stars: [], amenities: [], checkIn: "", checkOut: "" }); };
  const toggleFilter = (list, setter, item, key) => { const next = list.includes(item) ? list.filter((value) => value !== item) : [...list, item]; setter(next); updateUrl(undefined, key === "amenities" ? { amenities: next } : { stars: next }); };

  return <main className="search-page">
    <div className="search-shell">
      <p className="search-eyebrow">FIND YOUR STAY</p><h1>Explore places to stay</h1><p className="search-intro">Find the right place for your next getaway.</p>
      <form onSubmit={updateUrl} className={`search-pill${calendarOpen ? " is-calendar-open" : ""}`}>
        <label><span>Destination</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="City or property" aria-label="Destination" /></label>
        <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChange={(start, end) => { setCheckIn(start); setCheckOut(end); }} onOpenChange={setCalendarOpen} disabledDates={blockedDates} />
        <label><span>Guests</span><select value={guests} onChange={(event) => setGuests(event.target.value)} aria-label="Guests">{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
        <Button type="submit" aria-label="Search stays"><Search size={17} /><span>Search</span></Button>
      </form>

      {!keyword && !loading ? <section className="search-empty"><div className="empty-art" aria-hidden="true"><svg viewBox="0 0 240 160"><path d="M22 135h196M42 135V77l78-45 78 45v58M72 135V93h35v42M138 85h35v28h-35z"/><circle cx="190" cy="34" r="14"/></svg></div><h2>Where would you like to go?</h2><p>Enter a city or property above to discover your next stay.</p></section> : null}
      {searchError && <p role="alert" className="search-error">{searchError}</p>}

      {keyword && <div className="search-results-layout">
        <aside className="filter-panel"><div className="filter-heading"><h2>Filters</h2><button type="button" onClick={resetFilters}>Clear</button></div>
          <div className="filter-section"><h3>Price per night</h3><label className="range-label">₹{Number(minPrice).toLocaleString("en-IN")} – ₹{Number(maxPrice).toLocaleString("en-IN")}</label><input aria-label="Minimum price" type="range" min="0" max="15000" step="500" value={minPrice} onChange={(event) => setMinPrice(Math.min(Number(event.target.value), Number(maxPrice) - 500).toString())} onPointerUp={() => updateUrl()} onKeyUp={() => updateUrl()}/><input aria-label="Maximum price" type="range" min="1500" max="15000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), Number(minPrice) + 500).toString())} onPointerUp={() => updateUrl()} onKeyUp={() => updateUrl()}/></div>
          <div className="filter-section"><h3>Guest rating</h3>{[4, 3].map((rating) => <label className="filter-option" key={rating}><input type="checkbox" checked={stars.includes(String(rating))} onChange={() => toggleFilter(stars, setStars, String(rating), "stars")}/>{rating}+ stars</label>)}</div>
          <div className="filter-section"><h3>Amenities</h3>{amenities.map((amenity) => <label className="filter-option" key={amenity}><input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => toggleFilter(selectedAmenities, setSelectedAmenities, amenity, "amenities")}/>{amenity}</label>)}</div>
          <Button type="button" className="apply-filters" onClick={() => updateUrl()}>Apply filters</Button>
        </aside>
        <section className="results-column"><div className="results-heading"><div><h2>Stays for “{keyword}”</h2><p>{loading ? "Finding places…" : `${totalCount.toLocaleString()} ${totalCount === 1 ? "place" : "places"} to explore`}</p></div><Button variant="outline" className={`map-toggle ${mapView ? "is-active" : ""}`} onClick={() => updateUrl(undefined, { mapView: !mapView })}><Map size={17} />{mapView ? "Hide map" : "Show map"}</Button></div>
          {loading ? <SkeletonCards /> : visible.length ? <div className={mapView ? "results-with-map" : ""}><motion.div className="stay-grid" variants={cardGridMotion} initial="hidden" animate="show">{visible.map((stay) => <motion.div key={stay._id} variants={cardItemMotion}><StayCard stay={stay} checkIn={checkIn} checkOut={checkOut}/></motion.div>)}</motion.div>{mapView && <Suspense fallback={<div className="stay-map stay-map__loading" role="status">Loading interactive map…</div>}><StayMap stays={visible} checkIn={checkIn} checkOut={checkOut} /></Suspense>}</div> : <section className="search-empty search-empty--results"><div className="empty-art" aria-hidden="true"><svg viewBox="0 0 240 160"><circle cx="103" cy="72" r="39"/><path d="m132 101 34 34M34 137h172M65 81l22-22 17 17 20-25"/></svg></div><h2>No stays found for these filters</h2><p>{checkIn && checkOut ? "No stays are available for these dates and filters." : "Try another destination or clear your filters to see more places."}</p><Button className="clear-filters" onClick={resetFilters}>Clear filters</Button></section>}
          {!loading && hasMore && <Button className="load-more" onClick={() => setPage((current) => current + 1)} disabled={loadingMore}>{loadingMore ? "Finding more stays…" : <>Load more stays <ArrowDown size={16}/></>}</Button>}
        </section>
      </div>}
    </div>
  </main>;
};

export default SearchPage;
