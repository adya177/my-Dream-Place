import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Map, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSearch } from "../context/Serach";
import { Button } from "../components/ui/button";

const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80";
const today = new Date().toISOString().slice(0, 10);
const amenities = ["Pool", "Wi-Fi", "Parking"];
const cardGridMotion = { hidden: {}, show: { transition: { staggerChildren: 0.075 } } };
const cardItemMotion = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] } } };

function StayCard({ stay }) {
  const images = stay.images?.length ? stay.images : [fallbackImage];
  const [imageIndex, setImageIndex] = useState(0);
  const move = (event, amount) => {
    event.preventDefault(); event.stopPropagation();
    setImageIndex((index) => (index + amount + images.length) % images.length);
  };
  return <article className="stay-card group">
    <div className="stay-card__image"><Link to={`/product/${stay.slug}`} tabIndex={-1} aria-hidden="true" className="stay-card__image-link"><img src={images[imageIndex]} alt="" onError={(event) => { event.currentTarget.src = fallbackImage; }} /></Link>
      {images.length > 1 && <><button aria-label="Previous photo" className="stay-card__arrow stay-card__arrow--left" onClick={(event) => move(event, -1)}><ChevronLeft size={18} /></button><button aria-label="Next photo" className="stay-card__arrow stay-card__arrow--right" onClick={(event) => move(event, 1)}><ChevronRight size={18} /></button><span className="stay-card__count">{imageIndex + 1} / {images.length}</span></>}
    </div>
    <Link to={`/product/${stay.slug}`} className="stay-card__body"><p className="stay-card__location"><MapPin size={15} strokeWidth={1.8} />{stay.hotelLocation || "Destination stay"}</p><h3>{stay.title}</h3><p className="stay-card__description">{stay.description || "A comfortable place to make your trip memorable."}</p><p className="stay-card__price">${Number(stay.price || 0).toLocaleString()} <span>/ night</span></p></Link>
  </article>;
}
StayCard.propTypes = { stay: PropTypes.shape({ images: PropTypes.arrayOf(PropTypes.string), slug: PropTypes.string, title: PropTypes.string, hotelLocation: PropTypes.string, description: PropTypes.string, price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }).isRequired };

function SkeletonCards() {
  return <div className="stay-grid" aria-label="Loading stays">{[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="skeleton-card"><div className="skeleton-block skeleton-image"/><div className="skeleton-content"><div className="skeleton-block skeleton-line short"/><div className="skeleton-block skeleton-line"/><div className="skeleton-block skeleton-line medium"/></div></div>)}</div>;
}

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, setSearch] = useSearch();
  const params = new URLSearchParams(location.search);
  const [keyword, setKeyword] = useState(params.get("city") || params.get("keyword") || "");
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || "");
  const [guests, setGuests] = useState(params.get("guests") || "2");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "0");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "5000");
  const [stars, setStars] = useState(params.getAll("stars"));
  const [selectedAmenities, setSelectedAmenities] = useState(params.getAll("amenity"));
  const [mapView, setMapView] = useState(params.get("view") === "map");

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("city") || new URLSearchParams(location.search).get("keyword") || "";
    setKeyword(query);
    setCheckIn(new URLSearchParams(location.search).get("checkIn") || "");
    setCheckOut(new URLSearchParams(location.search).get("checkOut") || "");
    setGuests(new URLSearchParams(location.search).get("guests") || "2");
    setMinPrice(new URLSearchParams(location.search).get("minPrice") || "0");
    setMaxPrice(new URLSearchParams(location.search).get("maxPrice") || "5000");
    setStars(new URLSearchParams(location.search).getAll("stars"));
    setSelectedAmenities(new URLSearchParams(location.search).getAll("amenity"));
    setMapView(new URLSearchParams(location.search).get("view") === "map");
    if (!query.trim()) { setResults([]); return; }
    let active = true;
    setLoading(true);
    setSearchError("");
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/booking/search/${encodeURIComponent(query.trim())}`)
      .then(({ data }) => { if (active) { const stays = Array.isArray(data) ? data : []; setResults(stays); setSearch((prev) => ({ ...prev, keyword: query, results: stays })); } })
      .catch((error) => { console.error("Unable to search stays:", error); if (active) { const message = "We couldn't load stays right now. Please try again."; setResults([]); setSearchError(message); toast.error(message); } })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [location.search, setSearch]);

  const visible = useMemo(() => results.filter((stay) => {
    const price = Number(stay.price || 0);
    const text = `${stay.description || ""} ${(stay.amenities || stay.facilities || []).join(" ")}`.toLowerCase();
    const starValue = Number(stay.rating || stay.stars || 0);
    return price >= Number(minPrice || 0) && price <= Number(maxPrice || Infinity) &&
      (!stars.length || (starValue > 0 && stars.some((star) => starValue >= Number(star)))) &&
      selectedAmenities.every((amenity) => text.includes(amenity.toLowerCase()));
  }), [results, minPrice, maxPrice, stars, selectedAmenities]);

  const updateUrl = (event) => {
    event?.preventDefault();
    const query = new URLSearchParams();
    if (keyword.trim()) query.set("city", keyword.trim());
    if (checkIn) query.set("checkIn", checkIn);
    if (checkOut) query.set("checkOut", checkOut);
    if (guests) query.set("guests", guests);
    if (minPrice !== "0") query.set("minPrice", minPrice);
    if (maxPrice !== "5000") query.set("maxPrice", maxPrice);
    stars.forEach((star) => query.append("stars", star));
    selectedAmenities.forEach((amenity) => query.append("amenity", amenity));
    if (mapView) query.set("view", "map");
    navigate(`/search?${query.toString()}`);
  };

  const resetFilters = () => { setMinPrice("0"); setMaxPrice("5000"); setStars([]); setSelectedAmenities([]); };
  const toggleList = (list, setter, item) => setter(list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

  return <main className="search-page">
    <div className="search-shell">
      <p className="search-eyebrow">FIND YOUR STAY</p><h1>Explore places to stay</h1><p className="search-intro">Find the right place for your next getaway.</p>
      <form onSubmit={updateUrl} className="search-pill">
        <label><span>Destination</span><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="City or property" aria-label="Destination" /></label>
        <label><span>Check in</span><input type="date" min={today} value={checkIn} onChange={(event) => { const nextDate = event.target.value; setCheckIn(nextDate); if (checkOut && checkOut <= nextDate) setCheckOut(""); }} aria-label="Check-in date" /></label>
        <label><span>Check out</span><input type="date" min={checkIn || today} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} aria-label="Check-out date" /></label>
        <label><span>Guests</span><select value={guests} onChange={(event) => setGuests(event.target.value)} aria-label="Guests">{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
        <Button type="submit" aria-label="Search stays"><Search size={17} /><span>Search</span></Button>
      </form>

      {!keyword && !loading ? <section className="search-empty"><div className="empty-art" aria-hidden="true"><svg viewBox="0 0 240 160"><path d="M22 135h196M42 135V77l78-45 78 45v58M72 135V93h35v42M138 85h35v28h-35z"/><circle cx="190" cy="34" r="14"/></svg></div><h2>Where would you like to go?</h2><p>Enter a city or property above to discover your next stay.</p></section> : null}
      {searchError && <p role="alert" className="search-error">{searchError}</p>}

      {keyword && <div className="search-results-layout">
        <aside className="filter-panel"><div className="filter-heading"><h2>Filters</h2><button type="button" onClick={resetFilters}>Clear</button></div>
          <div className="filter-section"><h3>Price per night</h3><label className="range-label">${Number(minPrice).toLocaleString()} – ${Number(maxPrice).toLocaleString()}</label><input type="range" min="0" max="5000" step="50" value={minPrice} onChange={(event) => setMinPrice(Math.min(Number(event.target.value), Number(maxPrice) - 50).toString())}/><input type="range" min="50" max="5000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), Number(minPrice) + 50).toString())}/></div>
          <div className="filter-section"><h3>Guest rating</h3>{[4, 3].map((rating) => <label className="filter-option" key={rating}><input type="checkbox" checked={stars.includes(String(rating))} onChange={() => toggleList(stars, setStars, String(rating))}/>{rating}+ stars</label>)}</div>
          <div className="filter-section"><h3>Amenities</h3>{amenities.map((amenity) => <label className="filter-option" key={amenity}><input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => toggleList(selectedAmenities, setSelectedAmenities, amenity)}/>{amenity}</label>)}</div>
          <Button type="button" className="apply-filters" onClick={() => updateUrl()}>Apply filters</Button>
        </aside>
        <section className="results-column"><div className="results-heading"><div><h2>Stays for “{keyword}”</h2><p>{loading ? "Finding places…" : `${visible.length} ${visible.length === 1 ? "place" : "places"} to explore`}</p></div><Button variant="outline" className={`map-toggle ${mapView ? "is-active" : ""}`} onClick={() => { const next = !mapView; setMapView(next); const nextParams = new URLSearchParams(location.search); next ? nextParams.set("view", "map") : nextParams.delete("view"); navigate(`/search?${nextParams.toString()}`); }}><Map size={17} />{mapView ? "Hide map" : "Show map"}</Button></div>
          {loading ? <SkeletonCards /> : visible.length ? <div className={mapView ? "results-with-map" : ""}><motion.div className="stay-grid" variants={cardGridMotion} initial="hidden" animate="show">{visible.map((stay) => <motion.div key={stay._id} variants={cardItemMotion}><StayCard stay={stay}/></motion.div>)}</motion.div>{mapView && <div className="map-panel" aria-label="Map of stay prices"><div className="map-road road-one"/><div className="map-road road-two"/><div className="map-road road-three"/><div className="map-water"/>{visible.slice(0, 8).map((stay, index) => <span key={stay._id} className="map-pin" style={{ left: `${15 + ((index * 23) % 72)}%`, top: `${18 + ((index * 31) % 65)}%` }}>${Number(stay.price || 0).toLocaleString()}</span>)}<small>Map preview · approximate stay locations</small></div>}</div> : <section className="search-empty search-empty--results"><div className="empty-art" aria-hidden="true"><svg viewBox="0 0 240 160"><circle cx="103" cy="72" r="39"/><path d="m132 101 34 34M34 137h172M65 81l22-22 17 17 20-25"/></svg></div><h2>No stays found for these filters</h2><p>Try another destination or clear your filters to see more places.</p><Button className="clear-filters" onClick={resetFilters}>Clear filters</Button></section>}
        </section>
      </div>}
    </div>
  </main>;
};

export default SearchPage;
