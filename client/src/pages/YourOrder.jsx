import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, CreditCard, MapPin, ReceiptText, Sparkles, TicketCheck } from "lucide-react";
import { useBook } from "../context/Booking";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./User/Navbar";

const money = (amount) => Number(amount || 0).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const YourOrder = () => {
  const [book, setBook] = useBook();
  const navigate = useNavigate();

  const handleCheckout = async (orderId, postId) => {
    try {
      const updatedBooking = book.filter((item) => item._id !== orderId);
      setBook(updatedBooking);
      localStorage.setItem("booking", JSON.stringify(updatedBooking));
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/api/booking/update-availability`, { postId, isAvailable: true });
      toast.success("Stay completed. The room is available again.");
      navigate("/thank-you");
    } catch {
      toast.error("Could not complete checkout. Please try again.");
    }
  };

  const bookings = Array.isArray(book) ? book : [];
  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:flex">
        <Navbar />
        <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-violet-300"><Sparkles size={15}/> Your travel archive</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Your bookings</h1><p className="mt-2 text-sm text-slate-600">Every getaway, all in one place.</p></div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">{bookings.length} {bookings.length === 1 ? "reservation" : "reservations"}</span>
          </motion.header>
          {bookings.length ? <div className="mt-8 grid gap-4 xl:grid-cols-2">
            {bookings.map((order, index) => <motion.article key={order._id || index} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .06, .3) }} whileHover={{ y: -3 }} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/20 sm:p-6">
              <div className="flex items-start justify-between gap-4"><div><span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-violet-300"><TicketCheck size={14}/> Reservation</span><h2 className="mt-2 text-lg font-bold text-slate-900">{order.title || "Your stay"}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13}/>{order.hotelLocation || order.city || "India"}</p></div><span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${order.paymentStatus === "unpaid" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{order.paymentStatus === "unpaid" ? "Payment due" : "Confirmed"}</span></div>
              <div className="my-5 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5"><div><span className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-slate-500"><CalendarDays size={12}/> CHECK IN</span><strong className="mt-1 block text-xs text-slate-800">{order.checkInDate ? new Date(order.checkInDate).toLocaleDateString() : "See confirmation"}</strong></div><div><span className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-slate-500"><CalendarDays size={12}/> CHECK OUT</span><strong className="mt-1 block text-xs text-slate-800">{order.checkOutDate ? new Date(order.checkOutDate).toLocaleDateString() : "See confirmation"}</strong></div></div>
              <div className="flex flex-wrap items-end justify-between gap-4"><div><span className="flex items-center gap-1.5 text-[10px] text-slate-500"><CreditCard size={13}/>{order.paymentMethod === "property" ? "Pay at the property" : order.paymentStatus === "unpaid" ? "Payment pending" : "Paid online"}</span><strong className="mt-1 block text-xl font-extrabold tracking-tight text-slate-900">{money(order.amount)}</strong></div><button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white" onClick={() => handleCheckout(order._id, order.postId)}><ReceiptText size={15}/> Complete stay</button></div>
            </motion.article>)}
          </div> : <motion.section initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300"><CalendarDays size={25}/></span><h2 className="mt-5 text-xl font-bold text-slate-900">Your next story starts here</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">No bookings yet. Find a stay that feels like you and it will show up in this space.</p><Link to="/search" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500">Explore stays <ArrowUpRight size={16}/></Link></motion.section>}
        </section>
      </div>
    </main>
  );
};

export default YourOrder;
