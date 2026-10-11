import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import RelatedProduct from "./RelatedProduct";
import Spinner from "../Spinner";
import { useCart } from "../../context/Cart";
import { toast } from "react-toastify";
import { useAuth } from "../../context/UserContext";

const Product = () => {
  const params = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [auth] = useAuth();

  const handleCheckIn = () => {
    if (!auth?.token) {
      toast.error("Authentication required to proceed!");
      return navigate("/login");
    }
    navigate("/payment", {
      state: {
        price: postDetails?.price,
        product: postDetails?.title,
        postId: postDetails?._id,
      },
    });
  };

  useEffect(() => {
    if (params?.slug) getPostBySlug();
  }, [params?.slug]);

  const getPostBySlug = async (e) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/get-post/${params.slug}`
      );
      const product = res.data.product;
      setPostDetails(product);
      getRelatedPost(product?._id, product?.category?._id);
    } catch (error) {
      console.error("Error fetching post details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedPost = async (pid, cid) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/post/related-post/${pid}/${cid}`
      );
      setRelatedProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    if (postDetails.isDemo || postDetails.isAvailable) {
      setCart([...cart, postDetails]);
      localStorage.setItem("cart", JSON.stringify([...cart, postDetails]));
      toast.success("Item Added to cart");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Spinner />
      </div>
    );
  }

  if (!postDetails) {
    return <main className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-2xl font-bold text-slate-900">We couldn’t find this stay</h1><p className="mt-3 text-slate-600">It may have been removed or is temporarily unavailable.</p><button type="button" onClick={() => navigate("/search")} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Search stays</button></main>;
  }

  const facilities = (postDetails.nearArea || []).flatMap((area) => area.split(",")).concat((postDetails.facilities || []).flatMap((facility) => facility.split(","))).map((item) => item.trim()).filter(Boolean);
  const canBook = Boolean(postDetails.isDemo || postDetails.isAvailable);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 text-sm font-semibold text-blue-700 hover:text-blue-900">← Back to stays</button>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
            {postDetails.images?.[0] ? <img src={postDetails.images[0]} alt={postDetails.title || "Stay"} className="h-[340px] w-full rounded-2xl object-cover sm:h-[460px]" /> : <div className="flex h-[340px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500">Stay photo coming soon</div>}
            {postDetails.images?.length > 1 && <div className="mt-2 grid grid-cols-3 gap-2">{postDetails.images.slice(1, 4).map((img, idx) => <img key={img + idx} src={img} alt={`${postDetails.title} view ${idx + 2}`} loading="lazy" className="h-24 w-full rounded-xl object-cover sm:h-32" />)}</div>}
          </section>
          <section className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-24">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${canBook ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{postDetails.isDemo ? "Demo stay · available to book" : canBook ? "Available to book" : "Currently unavailable"}</span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{postDetails.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-slate-600"><MdLocationOn className="text-xl text-blue-600" />{postDetails.hotelLocation || "Location unavailable"}</p>
            <div className="mt-4 flex items-center gap-2 text-sm"><FaStar className="text-amber-400" /><span className="font-bold text-slate-900">4.8</span><span className="text-slate-500">Guest favourite</span></div>
            <p className="mt-6 border-t border-slate-100 pt-6 leading-7 text-slate-600">{postDetails.description || "Settle into a comfortable stay and explore everything this destination has to offer."}</p>
            <div className="mt-6 rounded-2xl bg-blue-50 p-5"><p className="text-sm text-slate-600">Starting from</p><p className="mt-1 text-3xl font-extrabold text-slate-900">{Number(postDetails.price || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}<span className="ml-1 text-sm font-medium text-slate-500">/ night</span></p></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"><button type="button" className="rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-slate-300" disabled={!canBook} onClick={handleCheckIn}>Book this stay</button><button type="button" className="rounded-xl border border-slate-300 px-5 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50" disabled={!canBook} onClick={handleAddToCart}>Save to trips ♡</button></div>
            <p className="mt-3 text-center text-xs text-slate-500">Choose card or pay at the property at checkout.</p>
          </section>
        </div>
        {facilities.length > 0 && <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-900">Around the stay</h2><div className="mt-5 flex flex-wrap gap-2">{facilities.map((item, index) => <span key={`${item}-${index}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{item}</span>)}</div></section>}
        <section className="mt-12"><h2 className="mb-6 text-2xl font-bold text-slate-900">You may also like</h2><RelatedProduct relatedProducts={relatedProducts} /></section>
      </div>
    </main>
  );
};

export default Product;
