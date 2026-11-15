import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...values) => twMerge(clsx(values));
const destinations = ["Bangalore", "Mumbai", "New Delhi", "Jaipur", "Udaipur", "Goa", "Kochi", "Chennai", "Hyderabad", "Pune", "Kolkata", "Manali", "Shimla", "Paris", "Bali", "Santorini", "Sydney", "Kyoto"];

export default function GlassSearch() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("city", city.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests !== "2") params.set("guests", guests);
    navigate(`/search${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <motion.div className="home-search-wrap relative z-20 mx-auto -mt-1 max-w-6xl px-5 sm:px-8 lg:px-10" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      <form onSubmit={submit} className="home-search-glass">
        <label className="home-search-field home-search-field--location"><span className="home-search-icon"><MapPin size={18}/></span><span><small>GOING SOMEWHERE?</small><input list="home-destinations" value={city} onChange={(event) => setCity(event.target.value)} placeholder="City, hotel, or vibe" aria-label="Destination" /><datalist id="home-destinations">{destinations.map((destination) => <option key={destination} value={destination}/>)}</datalist></span></label>
        <label className="home-search-field"><span className="home-search-icon"><CalendarDays size={18}/></span><span><small>CHECK IN</small><input type="date" value={checkIn} min={new Date().toISOString().slice(0, 10)} onChange={(event) => { setCheckIn(event.target.value); if (checkOut && event.target.value >= checkOut) setCheckOut(""); }} aria-label="Check-in date"/></span></label>
        <label className="home-search-field"><span className="home-search-icon"><CalendarDays size={18}/></span><span><small>CHECK OUT</small><input type="date" value={checkOut} min={checkIn || new Date().toISOString().slice(0, 10)} onChange={(event) => setCheckOut(event.target.value)} aria-label="Check-out date"/></span></label>
        <label className="home-search-field home-search-field--guests"><span className="home-search-icon"><Users size={18}/></span><span><small>WHO&apos;S COMING?</small><select value={guests} onChange={(event) => setGuests(event.target.value)} aria-label="Guests">{[1, 2, 3, 4, 5, 6].map((number) => <option value={number} key={number}>{number} {number === 1 ? "guest" : "guests"}</option>)}</select></span></label>
        <motion.button className={cn("home-search-submit", "rounded-2xl")} type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} aria-label="Search stays"><Search size={19}/><span>Search</span></motion.button>
      </form>
      <div className="home-search-note"><span className="home-online-dot"/> 24 handpicked stays · 18 destinations · zero boring trips</div>
    </motion.div>
  );
}
