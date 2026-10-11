import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../context/UserContext";
import { useCart } from "../context/Cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  const handleCheckIn = () => {
    if (!auth?.token) {
      toast.error("Authentication required to proceed!");
      return navigate("/login");
    }

    if (!cart.length) {
      toast.error("Your cart is empty.");
      return;
    }

    navigate("/payment", {
      state: {
        totalPrice: totalPrice(),
        products: cart.map((product) => ({
          title: product.title,
          postId: product._id,
          price: product.price,
        })),
      },
    });
  };

  const handleRemove = (id) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === id);
      if (index !== -1) {
        myCart.splice(index, 1);
        setCart(myCart);
        localStorage.setItem("cart", JSON.stringify(myCart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = () => {
    try {
      return cart
        .reduce((total, item) => total + item.price, 0)
        .toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
    } catch (error) {
      console.log(error);
      return "$0.00";
    }
  };

  return (
    <main className="min-h-[55vh] bg-slate-50 px-5 py-10 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Your getaway</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Saved stays</h1>
        <p className="mt-2 text-slate-600">Review your choices and continue when you’re ready.</p>
        {cart.length ? (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section aria-label="Saved stays" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="font-semibold text-slate-900">{cart.length} {cart.length === 1 ? "stay" : "stays"} saved</h2></div>
              <ul className="divide-y divide-slate-100 px-5 sm:px-6">
                {cart.map((product) => (
                  <li key={product._id} className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap">
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.title || "Stay"} className="h-24 w-28 shrink-0 rounded-xl object-cover sm:h-28 sm:w-36" /> : <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500 sm:h-28 sm:w-36">Photo coming soon</div>}
                    <div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-900">{product.title}</h3><p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{product.description || "A place to make your next trip memorable."}</p><p className="mt-2 text-sm font-bold text-slate-900">${Number(product.price || 0).toLocaleString("en-US")}</p></div>
                    <button type="button" onClick={() => handleRemove(product._id)} aria-label={`Remove ${product.title} from saved stays`} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"><FaTrashAlt size={16} /></button>
                  </li>
                ))}
              </ul>
            </section>
            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-slate-900">Price summary</h2>
              <div className="mt-5 space-y-3">{cart.map((product) => <div key={product._id} className="flex justify-between gap-4 text-sm text-slate-600"><span className="truncate">{product.title}</span><span className="shrink-0 font-medium text-slate-800">${Number(product.price || 0).toLocaleString("en-US")}</span></div>)}</div>
              <div className="mt-5 flex justify-between border-t border-slate-200 pt-5 text-lg font-bold text-slate-900"><span>Total</span><span>{totalPrice()}</span></div>
              <button type="button" className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700" onClick={auth?.token ? handleCheckIn : () => navigate("/login")}>{auth?.token ? "Continue to checkout" : "Sign in to continue"}<span aria-hidden="true" className="ml-2">→</span></button>
              <p className="mt-3 text-center text-xs leading-5 text-slate-500">You can choose card payment or pay at the property during checkout.</p>
            </aside>
          </div>
        ) : (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">♡</div><h2 className="mt-5 text-2xl font-bold text-slate-900">Your saved stays will appear here</h2><p className="mx-auto mt-2 max-w-lg leading-7 text-slate-600">Explore destinations and save the places you’d love to stay.</p><button type="button" onClick={() => navigate("/search")} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">Explore stays <span aria-hidden="true" className="ml-2">→</span></button></section>
        )}
      </div>
    </main>
  );
};

export default CartPage;
