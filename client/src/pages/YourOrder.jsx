import React from "react";
import { useBook } from "../context/Booking";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./User/Navbar";

const YourOrder = () => {
  const [book, setBook] = useBook();
  const navigate = useNavigate();

  const handleCheckout = async (orderId, postId) => {
    try {
      // Filter out the completed order
      const updatedBooking = book.filter((item) => item._id !== orderId);
      setBook(updatedBooking);
      localStorage.setItem("booking", JSON.stringify(updatedBooking));
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/booking/update-availability`,
        {
          postId,
          isAvailable: true,
        }
      );
      toast.success("Order completed and room is now available again!");
      navigate("/thank-you");
    } catch (error) {
      console.error("Error during checkout:", error.message);
      toast.error("Failed to complete the order. Please try again.");
    }
  };

  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:flex">
        <Navbar />
        <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Your account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Your bookings</h1>
          <p className="mt-2 text-slate-600">See your reservations and payment details.</p>
          {book && Array.isArray(book) && book.length > 0 ? (
            <div className="mt-7 grid gap-4 xl:grid-cols-2">
              {book.map((order, index) => (
                <article key={order._id || index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-blue-600">Reservation</p><h2 className="mt-2 text-lg font-bold text-slate-900">{order.title}</h2></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${order.paymentStatus === "unpaid" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{order.paymentStatus === "unpaid" ? "Payment due" : "Paid"}</span></div>
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600"><p><span className="font-semibold text-slate-800">Guest:</span> {order.customerName || "Account holder"}</p><p><span className="font-semibold text-slate-800">Total:</span> ${Number(order.amount || 0).toLocaleString("en-US")}</p><p><span className="font-semibold text-slate-800">Payment:</span> {order.paymentMethod === "property" ? "Pay at the property · due on arrival" : order.paymentStatus === "unpaid" ? "Payment pending" : "Paid online"}</p></div>
                  <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" onClick={() => handleCheckout(order._id, order.postId)}><FaShoppingCart /> Check out and release stay</button>
                </article>
              ))}
            </div>
          ) : <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"><p className="text-lg font-semibold text-slate-900">No bookings yet</p><p className="mt-2 text-sm text-slate-600">Your confirmed stays will show up here.</p><button type="button" onClick={() => navigate("/search")} className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Explore stays</button></div>}
        </section>
      </div>
    </main>
  );
};

export default YourOrder;
