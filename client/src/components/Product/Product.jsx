import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { CalendarDays, Check, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import RelatedProduct from "./RelatedProduct";
import Spinner from "../Spinner";
import { useCart } from "../../context/Cart";
import toast from "react-hot-toast";
import { useAuth } from "../../context/UserContext";

const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const tomorrowOf = (key) => { const date = new Date(`${key}T00:00:00`); date.setDate(date.getDate() + 1); return dateKey(date); };

export default function Product() {
  const { slug } = useParams();
  const propertyQuery = useQuery({
    queryKey: ["property", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/get-post/${slug}`);
      if (!data?.product) throw new Error("This stay could not be found.");
      return data.product;
    },
  });
  const postDetails = propertyQuery.data;
  const relatedQuery = useQuery({
    queryKey: ["related-properties", postDetails?._id, postDetails?.category?._id],
    enabled: Boolean(postDetails?._id && postDetails?.category?._id),
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/related-post/${postDetails?._id}/${postDetails?.category?._id}`);
      return Array.isArray(data?.products) ? data.products : [];
    },
  });
  const relatedProducts = relatedQuery.data || [];
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const checkIn = params.get("checkIn") || dateKey(new Date());
  const checkOut = params.get("checkOut") || tomorrowOf(checkIn);

  useEffect(() => {
    if (propertyQuery.isError) toast.error(propertyQuery.error?.message || "Could not load this stay.");
  }, [propertyQuery.isError, propertyQuery.error]);

  const handleCheckIn = () => {
    if (!auth?.token) { toast.error("Sign in to book this stay."); return navigate("/login"); }
    navigate("/payment", { state: { price: postDetails?.price, product: postDetails?.title, postId: postDetails?._id, checkIn, checkOut } });
  };
  const handleAddToCart = () => {
    if (!postDetails?.isDemo && !postDetails?.isAvailable) return;
    const stay = { ...postDetails, checkIn, checkOut };
    const nextCart = [...cart, stay];
    setCart(nextCart);
    localStorage.setItem("cart", JSON.stringify(nextCart));
    toast.success("Stay saved to your trips");
  };

  if (propertyQuery.isLoading) return <main className="hotel-details-page hotel-details-loading"><Spinner /></main>;
  if (!postDetails) return <main className="hotel-details-page mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-2xl font-bold">We couldn&apos;t find this stay</h1><p className="mt-3 text-slate-400">It may have been removed or is temporarily unavailable.</p><button type="button" onClick={() => navigate("/search")} className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-500">Search stays</button></main>;

  const facilities = [...new Set([...(postDetails.nearArea || []), ...(postDetails.facilities || [])].flatMap((item) => item.split(",")).map((item) => item.trim()).filter(Boolean))];
  const canBook = Boolean(postDetails.isDemo || postDetails.isAvailable);
  const galleryImages = postDetails.images?.length ? [...postDetails.images, ...postDetails.images].slice(0, 5) : [];

  return (
    <main className="hotel-details-page min-h-screen px-5 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 text-sm font-semibold text-violet-300 transition hover:text-white">← Back to stays</button>
        <motion.header className="hotel-details-heading" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <div><span><Sparkles size={14}/> YOUR NEXT GOOD STORY</span><h1>{postDetails.title}</h1><p><MdLocationOn />{postDetails.hotelLocation || "Location unavailable"}{postDetails.state ? ` · ${postDetails.state}` : ""}</p></div>
          <div className="hotel-details-rating"><FaStar/><strong>{Number(postDetails.rating || 4.8).toFixed(1)}</strong><small>{Number(postDetails.reviewCount || 0).toLocaleString()} reviews</small></div>
        </motion.header>
        {galleryImages.length > 0 && <motion.section className="hotel-bento-gallery" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, delay: .08 }} aria-label="Photos of this stay">
          {galleryImages.map((img, index) => <div key={`${img}-${index}`} className={`hotel-bento-gallery__tile${index === 0 ? " is-main" : ""}`}><img src={img} alt={`${postDetails.title} view ${index + 1}`} loading={index > 1 ? "lazy" : "eager"}/>{index === 0 && <span><Check size={14}/> Guest favourite</span>}</div>)}
        </motion.section>}
        <div className="hotel-details-layout">
          <div className="hotel-details-copy">
            <section className="hotel-details-panel"><span className={`hotel-availability-pill ${canBook ? "is-open" : ""}`}>{canBook ? "Available to book" : "Currently unavailable"}</span><h2>A stay with a little extra something.</h2><p>{postDetails.description || "Settle into a comfortable stay and explore everything this destination has to offer."}</p></section>
            {facilities.length > 0 && <section className="hotel-details-panel"><h2>The good stuff</h2><div className="hotel-perk-grid">{facilities.map((item, index) => <span key={`${item}-${index}`}><Check size={16}/>{item}</span>)}</div></section>}
            <section className="hotel-details-panel hotel-host-note"><ShieldCheck size={20}/><div><strong>Easy, flexible booking</strong><p>Review your dates and guest count before heading to secure checkout.</p></div></section>
          </div>
          <aside className="hotel-booking-widget">
            <span className={`hotel-availability-pill ${canBook ? "is-open" : ""}`}>{postDetails.isDemo ? "Demo stay · bookable" : canBook ? "Available to book" : "Currently unavailable"}</span>
            <div className="hotel-booking-price"><small>From</small><strong>{Number(postDetails.price || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}</strong><span>per night <i>·</i> + {Number(postDetails.taxesAndFees || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })} fees</span></div>
            <div className="hotel-booking-dates"><span><CalendarDays size={15}/> CHECK IN</span><strong>{checkIn}</strong><i/><span><CalendarDays size={15}/> CHECK OUT</span><strong>{checkOut}</strong></div>
            <button type="button" className="hotel-booking-primary" disabled={!canBook} onClick={handleCheckIn}>Book this stay</button><button type="button" className="hotel-booking-secondary" disabled={!canBook} onClick={handleAddToCart}>Save to trips ♡</button>
            <p className="hotel-booking-note">Choose card or pay at the property at checkout.</p>
          </aside>
        </div>
        <section className="mt-12"><h2 className="mb-6 text-2xl font-bold">You may also like</h2><RelatedProduct relatedProducts={relatedProducts} /></section>
      </div>
    </main>
  );
}
