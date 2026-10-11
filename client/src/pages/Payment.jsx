import React, { useMemo, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/UserContext";
import { useBook } from "../context/Booking";


const currency = (value) => Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";


const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [book, setBook] = useBook();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [customerName, setCustomerName] = useState(auth?.user?.name || "");
  const [address, setAddress] = useState({ line1: "", city: "", state: "", postalCode: "", country: "IN" });


  const items = useMemo(() => {
    const state = location.state;
    if (Array.isArray(state?.products)) return state.products.map((item) => ({ ...item, postId: item.postId || item._id }));
    if (state?.postId) return [{ title: state.product || "Your stay", price: state.price, postId: state.postId }];
    return [];
  }, [location.state]);
  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const addressField = (key) => (event) => setAddress((current) => ({ ...current, [key]: event.target.value }));


  const handlePayment = async (event) => {
    event.preventDefault();
    if (!items.length || items.some((item) => !item.postId) || total <= 0) {
      toast.error("Your checkout details are missing. Please select a stay again.");
      navigate("/search");
      return;
    }
    if (!auth?.token) {
      toast.error("Sign in before completing your booking.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (paymentMethod === "property") {
      setLoading(true);
      try {
        await Promise.all(items.map(async (item) => {
          await axios.post(import.meta.env.VITE_BASE_URL + "/api/booking/create-booking", {
            token: auth.token,
            postId: item.postId,
            bookingDate: new Date(),
            paymentStatus: "unpaid",
            paymentMethod: "property",
          });
          await axios.patch(import.meta.env.VITE_BASE_URL + "/api/booking/update-availability", {
            postId: item.postId,
            isAvailable: false,
          });
        }));
        const savedBookings = [...book, ...items.map((item, index) => ({
          _id: "property:" + Date.now() + ":" + index,
          title: item.title,
          amount: item.price,
          customerName: auth?.user?.name || "",
          postId: item.postId,
          paymentStatus: "unpaid",
          paymentMethod: "property",
        }))];
        setBook(savedBookings);
        localStorage.setItem("booking", JSON.stringify(savedBookings));
        toast.success("Stay reserved. You can pay when you arrive.");
        navigate("/user/your-order");
      } catch (error) {
        const message = error.response?.data?.message || error.message || "Please try again.";
        toast.error("We could not reserve your stay: " + message);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!/^[A-Za-z]{2}$/.test(address.country.trim())) {
      toast.error("Choose a valid country for your billing address.");
      return;
    }
    if (!stripe || !elements) {
      toast.error("Secure checkout is still loading. Please try again.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_BASE_URL + "/api/booking/create-payment-intent", {
        amount: Math.round(total * 100), currency: "usd", description: "My Dream Place booking (" + items.length + " stay)", customerName,
        customerAddress: { ...address, country: address.country.trim().toUpperCase() },
      });
      const data = response.data;
      if (!data?.clientSecret) throw new Error(data?.message || "Could not start secure checkout.");
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: customerName, address: { line1: address.line1, city: address.city, state: address.state, postal_code: address.postalCode, country: address.country.trim().toUpperCase() } },
        },
      });
      if (result.error) throw new Error(result.error.message || "Card payment failed.");
      if (result.paymentIntent?.status !== "succeeded") throw new Error("Payment could not be confirmed.");


      await Promise.all(items.map(async (item) => {
        await axios.post(import.meta.env.VITE_BASE_URL + "/api/booking/create-booking", {
          token: auth.token, postId: item.postId, bookingDate: new Date(), transactionId: result.paymentIntent.id,
        });
        await axios.patch(import.meta.env.VITE_BASE_URL + "/api/booking/update-availability", { postId: item.postId, isAvailable: false });
      }));
      const savedBookings = [...book, ...items.map((item, index) => ({ _id: result.paymentIntent.id + ":" + index, title: item.title, amount: item.price, customerName, postId: item.postId }))];
      setBook(savedBookings);
      localStorage.setItem("booking", JSON.stringify(savedBookings));
      toast.success("Payment and booking successful.");
      navigate("/user/your-order");
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Please check your details and try again.";
      toast.error("Checkout could not be completed: " + message);
    } finally {
      setLoading(false);
    }
  };


  if (!items.length) return (
    <main className="mx-auto my-16 max-w-2xl px-6"><div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600">⌂</div>
      <h1 className="mt-5 text-2xl font-bold text-slate-900">Your checkout is waiting for a stay</h1>
      <p className="mt-3 text-slate-600">Choose a destination to explore, then check for available stays before starting secure checkout.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3"><Link to="/discover" className="inline-flex rounded-xl border border-blue-200 px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50">Explore destination guides</Link><Link to="/search" className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">Find available stays</Link></div>
    </div></main>
  );


  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <Link to="/cart" className="text-sm font-medium text-blue-700 hover:text-blue-900">← Back to your bag</Link>
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Secure checkout</p><h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Complete your booking</h1></div>
          <p className="text-sm text-slate-500">Your payment details are encrypted by Stripe.</p>
        </div>


        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <form onSubmit={handlePayment} className="space-y-6">
            {paymentMethod === "card" && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6"><h2 className="text-xl font-semibold text-slate-900">Guest and billing details</h2><p className="mt-1 text-sm text-slate-500">Enter the details associated with your card.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Full name<input autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} className={inputClass} placeholder="Name on card" required /></label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Street address<input autoComplete="street-address" value={address.line1} onChange={addressField("line1")} className={inputClass} placeholder="House number and street" required /></label>
                <label className="text-sm font-medium text-slate-700">City<input autoComplete="address-level2" value={address.city} onChange={addressField("city")} className={inputClass} placeholder="City" required /></label>
                <label className="text-sm font-medium text-slate-700">State or region<input autoComplete="address-level1" value={address.state} onChange={addressField("state")} className={inputClass} placeholder="State or region" /></label>
                <label className="text-sm font-medium text-slate-700">Postal code<input autoComplete="postal-code" value={address.postalCode} onChange={addressField("postalCode")} className={inputClass} placeholder="Postal code" /></label>
                <label className="text-sm font-medium text-slate-700">Country<select autoComplete="country" value={address.country} onChange={addressField("country")} className={inputClass} required><option value="IN">India</option><option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option><option value="AU">Australia</option><option value="SG">Singapore</option><option value="AE">United Arab Emirates</option></select><span className="mt-1 block text-xs font-normal text-slate-500">Used for your card billing details.</span></label>
              </div>
            </section>}


            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">Payment method</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mt-1 accent-blue-600" />
                  <span><strong className="block text-slate-900">Pay online by card</strong><span className="mt-1 block text-sm text-slate-500">Secure checkout with Stripe.</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${paymentMethod === "property" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                  <input type="radio" name="paymentMethod" value="property" checked={paymentMethod === "property"} onChange={() => setPaymentMethod("property")} className="mt-1 accent-blue-600" />
                  <span><strong className="block text-slate-900">Pay at the property</strong><span className="mt-1 block text-sm text-slate-500">Reserve now and pay when you arrive.</span></span>
                </label>
              </div>
              {paymentMethod === "card" ? <>
                <p className="mt-5 text-sm text-slate-500">Enter your card details to pay securely.</p>
                <div className="mt-3 rounded-xl border border-slate-300 px-4 py-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"><CardElement options={{ style: { base: { color: "#0f172a", fontFamily: "Inter, system-ui, sans-serif", fontSize: "16px", "::placeholder": { color: "#94a3b8" } }, invalid: { color: "#dc2626" } } }} /></div>
              </> : <p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">No payment is collected now. Your stay will be reserved, and payment will be due at the property.</p>}
              <button type="submit" disabled={(paymentMethod === "card" && !stripe) || loading} className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {loading ? "Processing your booking…" : paymentMethod === "card" ? "Pay " + currency(total) : "Reserve and pay at property"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">By continuing, you confirm your billing details are correct.</p>
            </section>
          </form>


          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold text-slate-900">Booking summary</h2>
            <div className="mt-5 divide-y divide-slate-100">
              {items.map((item, index) => <div key={item.postId || index} className="flex justify-between gap-4 py-4 first:pt-0"><span className="font-medium text-slate-700">{item.title || "Your stay"}</span><span className="shrink-0 font-semibold text-slate-900">{currency(item.price)}</span></div>)}
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-5 text-lg font-bold text-slate-900"><span>Total</span><span>{currency(total)}</span></div>
            <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">{paymentMethod === "card" ? "Your reservation will be confirmed after the secure card payment completes." : "Your stay will be reserved now. Payment is due when you arrive."}</p>
          </aside>
        </div>
      </div>
    </main>
  );
};


export default Payment;
