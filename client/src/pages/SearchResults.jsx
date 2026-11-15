import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowDown, BadgePercent, BriefcaseBusiness, Building2, ChevronRight,
  Copy, Crown, Gem, Heart, Landmark, Map, MapPin, Palmtree, Search, Sparkles, Star, Waves, LocateFixed,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useSearch } from "../context/Serach";
import { Button } from "../components/ui/button";
import DateRangePicker from "../components/Search/DateRangePicker";
const StayMap = lazy(() => import("../components/Search/StayMap"));

const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80";
const pageSize = 20;
const perks = ["Breakfast Included", "Free Cancellation", "Pool Access", "Free Wi-Fi", "Airport Transfer", "Spa Credit", "Ocean View"];
const categories = [
  { label: "All stays", value: "", Icon: Building2 },
  { label: "5-Star Luxury", value: "Luxury", Icon: Crown },
  { label: "Resorts", value: "Resorts", Icon: Palmtree },
  { label: "Boutique", value: "Boutique", Icon: Gem },
  { label: "Heritage", value: "Heritage", Icon: Landmark },
  { label: "Business", value: "Business", Icon: BriefcaseBusiness },
  { label: "Beachfront", value: "Beachfront", Icon: Waves },
];
const deals = [
  { eyebrow: "STAY MORE, SAVE MORE", title: "A little extra off your next escape", code: "DREAM25", accent: "blue" },
  { eyebrow: "WEEKEND EDIT", title: "Make room for a slower weekend", code: "WEEKEND25", accent: "coral" },
  { eyebrow: "CARD MEMBER OFFER", title: "Unlock a better rate at checkout", code: "DREAMBANK", accent: "lavender" },
];
const cardGridMotion = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };
const cardItemMotion = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } } };
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const offerLabel = (value) => String(value || "MEMBER RATE").replace(/MMTDEAL\s*[-:]?\s*/i, "").trim() || "SPECIAL OFFER";

function HotelCard({ stay, checkIn, checkOut }) {
  const images = stay.images?.length ? stay.images : [fallbackImage];
  const [wishlisted, setWishlisted] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dream-place-wishlist") || "[]").includes(stay.hotelId || stay._id); }
    catch { return false; }
  });
  const productLink = `/product/${stay.slug}${checkIn || checkOut ? `?${new URLSearchParams({ ...(checkIn ? { checkIn } : {}), ...(checkOut ? { checkOut } : {}) })}` : ""}`;
  const toggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const id = stay.hotelId || stay._id;
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem("dream-place-wishlist") || "[]"); } catch { saved = []; }
    const next = wishlisted ? saved.filter((item) => item !== id) : [...new Set([...saved, id])];
    localStorage.setItem("dream-place-wishlist", JSON.stringify(next));
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "Removed from your wishlist" : "Added to your wishlist");
  };
  const hotelName = stay.name || stay.title;
  const rating = Number(stay.guestRating || stay.rating || 4);
  const hotelPerks = stay.perks || stay.facilities || [];

  return <article className="hotel-card">
    <div className="hotel-card__photo">
      <Swiper className="hotel-card__swiper" modules={[Pagination]} pagination={{ clickable: true, dynamicBullets: true }} loop={images.length > 1}>
        {images.map((image, index) => <SwiperSlide key={`${image}-${index}`}><Link to={productLink} tabIndex={-1} aria-hidden="true" className="hotel-card__photo-link"><img src={image} alt={`${hotelName} in ${stay.city} — photo ${index + 1}`} loading="lazy" onError={(event) => { event.currentTarget.src = fallbackImage; }} /></Link></SwiperSlide>)}
      </Swiper>
      <span className="hotel-card__promo"><BadgePercent size={13}/>{offerLabel(stay.promoTag)}</span>
      <motion.button type="button" aria-label={wishlisted ? `Remove ${hotelName} from wishlist` : `Add ${hotelName} to wishlist`} aria-pressed={wishlisted} className={`hotel-card__wishlist${wishlisted ? " is-saved" : ""}`} onClick={toggleWishlist} whileTap={{ scale: 1.35 }} animate={{ scale: wishlisted ? [1, 1.22, 1] : 1 }} transition={{ type: "spring", stiffness: 480, damping: 18 }}>
        <Heart size={19} fill={wishlisted ? "currentColor" : "none"}/>
      </motion.button>
    </div>
    <Link to={productLink} className="hotel-card__content">
      <div className="hotel-card__eyebrow"><span>{stay.starRating || 4}★ Hotel</span><span className="hotel-card__guest-rating"><Star size={13} fill="currentColor"/>{rating.toFixed(1)}/5 <span>({Number(stay.reviewCount || 0).toLocaleString("en-IN")})</span></span></div>
      <h3>{hotelName}</h3>
      <p className="hotel-card__location"><MapPin size={14}/>{stay.locality ? `${stay.locality}, ` : ""}{stay.city}</p>
      <div className="hotel-card__perks">{hotelPerks.slice(0, 2).map((perk) => <span key={perk}>{perk}</span>)}</div>
      <div className="hotel-card__pricing">
        <div><span className="hotel-card__original">{money(stay.originalPrice)}</span><strong>{money(stay.pricePerNight || stay.price)}</strong><span className="hotel-card__night">per night</span></div>
        <span className="hotel-card__taxes">+ {money(stay.taxesAndFees)} taxes &amp; fees</span>
      </div>
    </Link>
  </article>;
}
HotelCard.propTypes = {
  stay: PropTypes.shape({ _id: PropTypes.string, hotelId: PropTypes.string, slug: PropTypes.string, name: PropTypes.string, title: PropTypes.string, city: PropTypes.string, locality: PropTypes.string, starRating: PropTypes.number, guestRating: PropTypes.number, rating: PropTypes.number, reviewCount: PropTypes.number, pricePerNight: PropTypes.number, price: PropTypes.number, originalPrice: PropTypes.number, taxesAndFees: PropTypes.number, promoTag: PropTypes.string, images: PropTypes.arrayOf(PropTypes.string), perks: PropTypes.arrayOf(PropTypes.string), facilities: PropTypes.arrayOf(PropTypes.string) }).isRequired,
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
};

function SkeletonCards() {
  return <div className="stay-grid" aria-label="Loading hotel listings">{Array.from({ length: 8 }, (_, item) => <div key={item} className="skeleton-card"><div className="skeleton-block skeleton-image"/><div className="skeleton-content"><div className="skeleton-block skeleton-line short"/><div className="skeleton-block skeleton-line"/><div className="skeleton-block skeleton-line medium"/></div></div>)}</div>;
}

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();
  const params = new URLSearchParams(location.search);
  const [keyword, setKeyword] = useState(params.get("city") || params.get("keyword") || search.keyword || "");
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || "");
  const [guests, setGuests] = useState(params.get("guests") || "2");
  const [rooms, setRooms] = useState(params.get("rooms") || "1");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState("");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "0");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "15000");
  const [stars, setStars] = useState(params.getAll("stars"));
  const [selectedAmenities, setSelectedAmenities] = useState(params.getAll("amenity"));
  const [category, setCategory] = useState(params.get("category") || "");
  const [sort, setSort] = useState(params.get("sort") || "rating_desc");
  const [mapView, setMapView] = useState(params.get("view") === "map");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stateName, setStateName] = useState(params.get("state") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({ rootMargin: "600px 0px", threshold: 0 });

  useEffect(() => {
    const current = new URLSearchParams(location.search);
    setKeyword(current.get("city") || current.get("keyword") || "");
    setStateName(current.get("state") || "");
    setCheckIn(current.get("checkIn") || "");
    setCheckOut(current.get("checkOut") || "");
    setGuests(current.get("guests") || "2");
    setRooms(current.get("rooms") || "1");
    setMinPrice(current.get("minPrice") || "0");
    setMaxPrice(current.get("maxPrice") || "15000");
    setStars(current.getAll("stars"));
    setSelectedAmenities(current.getAll("amenity"));
    setCategory(current.get("category") || "");
    setSort(current.get("sort") || "rating_desc");
    setMapView(current.get("view") === "map");
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    if (loadMoreInView && hasMore && !loading && !loadingMore) setPage((current) => current + 1);
  }, [loadMoreInView, hasMore, loading, loadingMore]);

  useEffect(() => {
    const query = keyword.trim();
    if (!query) { setSuggestions([]); return undefined; }
    let active = true;
    const timer = setTimeout(() => {
      axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotels/suggestions`, { params: { q: query } })
        .then(({ data }) => { if (active) setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []); })
        .catch(() => { if (active) setSuggestions([]); });
    }, 140);
    return () => { active = false; clearTimeout(timer); };
  }, [keyword]);

  useEffect(() => {
    let active = true;
    setLoading(page === 1);
    setLoadingMore(page > 1);
    setSearchError("");
    const requestParams = new URLSearchParams(location.search);
    const destination = requestParams.get("city") || requestParams.get("keyword");
    if (!destination) { requestParams.delete("city"); requestParams.delete("keyword"); }
    requestParams.set("page", String(page));
    requestParams.set("limit", String(pageSize));
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/hotels?${requestParams.toString()}`)
      .then(({ data }) => {
        if (!active) return;
        const hotels = Array.isArray(data?.posts) ? data.posts : [];
        setResults((previous) => page === 1 ? hotels : [...previous, ...hotels]);
        setTotalCount(Number(data?.total || 0));
        setHasMore(Boolean(data?.hasMore));
        setSearch((previous) => ({ ...previous, keyword: destination || "", results: hotels }));
      })
      .catch((error) => {
        console.error("Unable to load hotels:", error);
        if (active) {
          setSearchError("We couldn't load hotels right now. Please try again.");
          if (page === 1) setResults([]);
          toast.error("Hotel search is temporarily unavailable.");
        }
      })
      .finally(() => { if (active) { setLoading(false); setLoadingMore(false); } });
    return () => { active = false; };
  }, [location.search, page, setSearch]);

  const blockedDates = useMemo(() => {
    const candidates = new Set(results.flatMap((stay) => stay.bookedDates || []));
    return new Set([...candidates].filter((date) => results.length && results.every((stay) => (stay.bookedDates || []).includes(date))));
  }, [results]);

  const updateUrl = (event, overrides = {}) => {
    event?.preventDefault();
    const values = { keyword, stateName, checkIn, checkOut, guests, rooms, minPrice, maxPrice, stars, amenities: selectedAmenities, category, sort, mapView, ...overrides };
    const query = new URLSearchParams();
    if (values.keyword.trim()) query.set("city", values.keyword.trim());
    if (values.stateName) query.set("state", values.stateName);
    if (values.checkIn) query.set("checkIn", values.checkIn);
    if (values.checkOut) query.set("checkOut", values.checkOut);
    if (values.guests) query.set("guests", values.guests);
    if (values.rooms !== "1") query.set("rooms", values.rooms);
    if (values.minPrice !== "0") query.set("minPrice", values.minPrice);
    if (values.maxPrice !== "15000") query.set("maxPrice", values.maxPrice);
    values.stars.forEach((star) => query.append("stars", star));
    values.amenities.forEach((amenity) => query.append("amenity", amenity));
    if (values.category) query.set("category", values.category);
    if (values.sort !== "rating_desc") query.set("sort", values.sort);
    if (values.mapView) query.set("view", "map");
    setPage(1);
    navigate(`/search${query.size ? `?${query.toString()}` : ""}`);
  };

  const resetFilters = () => {
    setMinPrice("0"); setMaxPrice("15000"); setStars([]); setSelectedAmenities([]); setCheckIn(""); setCheckOut(""); setCategory("");
    updateUrl(undefined, { minPrice: "0", maxPrice: "15000", stars: [], amenities: [], checkIn: "", checkOut: "", category: "" });
  };
  const toggleFilter = (list, setter, item, key) => {
    const next = list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
    setter(next);
    updateUrl(undefined, key === "amenities" ? { amenities: next } : { stars: next });
  };
  const copyOffer = async (code) => {
    try { await navigator.clipboard.writeText(code); toast.success(`${code} copied`); }
    catch { toast.info(`Use code ${code} at checkout`); }
  };

  return <main className="search-page">
    <div className="search-shell">
      <div className="marketplace-heading"><div><p className="search-eyebrow">STAYS FOR EVERY KIND OF GETAWAY</p><h1>Find a place worth the trip.</h1><p className="search-intro">Thoughtful hotels, standout stays, and better rates in one place.</p></div><span className="marketplace-heading__note"><Sparkles size={17}/> Curated stays, made easy</span></div>
      <form onSubmit={updateUrl} className={`search-pill${calendarOpen ? " is-calendar-open" : ""}`}>
        <label className="destination-field"><span>City, state, or hotel</span><input role="combobox" aria-autocomplete="list" aria-expanded={suggestionsOpen && suggestions.length > 0} aria-controls="destination-suggestions" value={keyword || stateName} onFocus={() => setSuggestionsOpen(true)} onBlur={() => setTimeout(() => setSuggestionsOpen(false), 130)} onChange={(event) => { setKeyword(event.target.value); setStateName(""); setSuggestionsOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") setSuggestionsOpen(false); if (event.key === "ArrowDown" && suggestions.length) { event.preventDefault(); document.querySelector("#destination-suggestions button")?.focus(); } }} placeholder="Try Goa, Kerala or a hotel" aria-label="City, state, or hotel" />
          {suggestionsOpen && suggestions.length > 0 && <div className="destination-suggestions" role="listbox" id="destination-suggestions">{suggestions.map((item) => <button type="button" role="option" key={`${item.type}-${item.value}`} onMouseDown={(event) => event.preventDefault()} onClick={() => { setKeyword(item.type === "state" ? "" : item.value); setStateName(item.type === "state" ? item.value : ""); setSuggestionsOpen(false); updateUrl(undefined, item.type === "state" ? { keyword: "", stateName: item.value } : { keyword: item.value, stateName: "" }); }}><span className="destination-suggestion-icon"><LocateFixed size={16}/></span><span><strong>{item.value}</strong><small>{item.type === "state" ? `Explore stays across ${item.value}` : item.type === "city" ? `Explore stays in ${item.value}` : `${item.city} · ${item.type === "hotel" ? "Hotel" : "Area"}`}</small></span><ChevronRight size={16}/></button>)}</div>}
        </label>
        <DateRangePicker checkIn={checkIn} checkOut={checkOut} onChange={(start, end) => { setCheckIn(start); setCheckOut(end); }} onOpenChange={setCalendarOpen} disabledDates={blockedDates} />
        <label><span>Guests</span><select value={guests} onChange={(event) => setGuests(event.target.value)} aria-label="Guests">{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
        <label><span>Rooms</span><select value={rooms} onChange={(event) => setRooms(event.target.value)} aria-label="Rooms">{[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count} {count === 1 ? "room" : "rooms"}</option>)}</select></label>
        <Button type="submit" aria-label="Search hotels"><Search size={17}/><span>Search</span></Button>
      </form>

      <nav aria-label="Hotel categories" className="hotel-category-bar">
        {categories.map(({ label, value, Icon }) => <motion.button type="button" key={label} className={`hotel-category-tab${category === value ? " is-active" : ""}`} onClick={() => { setCategory(value); updateUrl(undefined, { category: value }); }} whileTap={{ scale: .96 }}>
          <Icon size={18}/><span>{label}</span>{category === value && <motion.i layoutId="active-hotel-category"/>}
        </motion.button>)}
      </nav>

      <section className="hotel-deal-strip" aria-label="Hotel deals">
        <div className="hotel-deal-strip__intro"><span><Sparkles size={15}/> JUST FOR YOUR NEXT GETAWAY</span><strong>Super Saver Hotel Deals</strong></div>
        <div className="hotel-deal-strip__track">{deals.map((deal) => <article key={deal.code} className={`hotel-deal-card hotel-deal-card--${deal.accent}`}>
          <div className="hotel-deal-card__copy"><span>{deal.eyebrow}</span><strong>{deal.title}</strong><small>Extra savings on a stay you’ll love.</small></div>
          <button type="button" onClick={() => copyOffer(deal.code)} aria-label={`Copy promo code ${deal.code}`}><span>{deal.code}</span><Copy size={14}/></button>
        </article>)}</div>
      </section>

      <div className="search-results-layout">
        <aside className="filter-panel"><div className="filter-heading"><h2>Refine your stay</h2><button type="button" onClick={resetFilters}>Reset</button></div>
          <div className="filter-section"><h3>Price per night</h3><label className="range-label">{money(minPrice)} – {money(maxPrice)}</label><input aria-label="Minimum price" type="range" min="0" max="15000" step="500" value={minPrice} onChange={(event) => setMinPrice(Math.min(Number(event.target.value), Number(maxPrice) - 500).toString())} onPointerUp={() => updateUrl()} onKeyUp={() => updateUrl()}/><input aria-label="Maximum price" type="range" min="1500" max="15000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), Number(minPrice) + 500).toString())} onPointerUp={() => updateUrl()} onKeyUp={() => updateUrl()}/></div>
          <div className="filter-section"><h3>Hotel class</h3>{[5, 4, 3].map((rating) => <label className="filter-option" key={rating}><input type="checkbox" checked={stars.includes(String(rating))} onChange={() => toggleFilter(stars, setStars, String(rating), "stars")}/>{rating} star{rating === 1 ? "" : "s"}</label>)}</div>
          <div className="filter-section"><h3>Popular perks</h3>{perks.slice(0, 5).map((perk) => <label className="filter-option" key={perk}><input type="checkbox" checked={selectedAmenities.includes(perk)} onChange={() => toggleFilter(selectedAmenities, setSelectedAmenities, perk, "amenities")}/>{perk}</label>)}</div>
        </aside>
        <section className="results-column">
          <div className="results-heading"><div><h2>{keyword ? `Hotels in ${keyword}` : stateName ? `Stays across ${stateName}` : category ? `${category} stays` : "Handpicked hotels for you"}</h2><p>{loading ? "Finding your next stay…" : `${totalCount.toLocaleString()} ${totalCount === 1 ? "hotel" : "hotels"} to explore`}</p></div>
            <div className="results-actions"><label className="sort-control"><span>Sort</span><select aria-label="Sort hotels" value={sort} onChange={(event) => { setSort(event.target.value); updateUrl(undefined, { sort: event.target.value }); }}><option value="rating_desc">Top rated</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label><Button variant="outline" className={`map-toggle ${mapView ? "is-active" : ""}`} onClick={() => updateUrl(undefined, { mapView: !mapView })}><Map size={17}/>{mapView ? "Hide map" : "Map"}</Button></div>
          </div>
          {searchError && <p role="alert" className="search-error">{searchError}</p>}
          {loading ? <SkeletonCards/> : results.length ? <>
            <div className={mapView ? "results-with-map" : ""}>
              <motion.div className="stay-grid" variants={cardGridMotion} initial="hidden" animate="show">{results.map((stay) => <motion.div key={stay.hotelId || stay._id} variants={cardItemMotion}><HotelCard stay={stay} checkIn={checkIn} checkOut={checkOut}/></motion.div>)}</motion.div>
              {mapView && <Suspense fallback={<div className="stay-map stay-map__loading" role="status">Loading map…</div>}><StayMap stays={results} checkIn={checkIn} checkOut={checkOut}/></Suspense>}
            </div>
            {hasMore && <div ref={loadMoreRef} className="load-more-trigger"><Button className="load-more" onClick={() => setPage((current) => current + 1)} disabled={loadingMore}>{loadingMore ? "Finding more stays…" : <>Load more hotels <ArrowDown size={16}/></>}</Button></div>}
          </> : <section className="search-empty search-empty--results"><div className="empty-art" aria-hidden="true"><svg viewBox="0 0 240 160"><circle cx="103" cy="72" r="39"/><path d="m132 101 34 34M34 137h172M65 81l22-22 17 17 20-25"/></svg></div><h2>No exact matches found</h2><p>Try another city or clear the filters to explore more stays.</p><Button className="clear-filters" onClick={resetFilters}>Clear filters</Button></section>}
        </section>
      </div>
    </div>
  </main>;
};

export default SearchResults;
