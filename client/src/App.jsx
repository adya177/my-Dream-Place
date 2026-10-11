import Advertisement from "./components/Advertisement";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import UserDashboard from "./pages/User/UserDashboard";
import DashBoard from "./pages/Admin/DashBoard";
import CreatePost from "./pages/Admin/CreatePost";
import Register from "./pages/Register";
import Details from "./pages/Admin/Details";
import PrivateRoute from "./components/Routes/Admin";
import UserRoutes from "./components/Routes/Private";
import CreateCategory from "./pages/Admin/CreateCategory";
import AllPost from "./pages/Admin/AllPost";
import AllTrip from "./pages/Admin/AllTrip";
import UpdatePost from "./pages/Admin/UpdatePost";
import CartPage from "./pages/CartPage";
import Payment from "./pages/Payment";
import YourOrder from "./pages/YourOrder";
import ThankYou from "./components/ThankYou";
import SelectedCategory from "./pages/SelectedCategory";
import DreamVacation from "./components/DreamVacation";
import NextTrip from "./components/NextTrip";
import Hotels from "./components/Hotels";
import DestinationGuide from "./pages/DestinationGuide.jsx/DestinationGuide.jsx";
import contourPattern from "./assets/contour-pattern.svg";


const PageIntro = ({ eyebrow, title, children }) => (
  <section className="bg-gradient-to-br from-blue-50 via-white to-sky-100 px-6 py-16 sm:py-20">
    <div className="mx-auto max-w-6xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">{title}</h1>
      <div className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{children}</div>
    </div>
  </section>
);


const DiscoverPage = () => (
  <main>
    <section className="relative isolate overflow-hidden border-b border-slate-200 px-5 py-14 sm:px-8 sm:py-20 lg:px-10" style={{ backgroundImage: `linear-gradient(110deg, rgba(244,249,248,.85), rgba(248,250,252,.78)), url(${contourPattern})`, backgroundSize: "cover, 420px 360px", backgroundPosition: "center, right top", backgroundRepeat: "no-repeat, repeat" }}>
      <div className="pointer-events-none absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-teal-900/10" /><div className="pointer-events-none absolute -right-8 -top-16 -z-10 h-56 w-56 rounded-full border border-teal-900/10" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="max-w-3xl"><p className="inline-flex items-center gap-2 rounded-full border border-teal-900/10 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-teal-800 shadow-sm"><span className="h-2 w-2 rounded-full bg-teal-600" />The places behind the plans</p><h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Find a place that <span className="text-teal-800">feels like somewhere.</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">From slow island mornings to streets that stay lively after dark, discover a destination worth making time for.</p><div className="mt-8 flex flex-wrap items-center gap-3"><Link to="/search" className="inline-flex items-center rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-teal-900">Find your stay <span className="ml-3" aria-hidden="true">→</span></Link><span className="text-sm font-medium text-slate-500">Thoughtful guides. Places to stay. Your kind of trip.</span></div></div>
        <div className="relative mx-auto w-full max-w-sm rotate-1 rounded-[1.8rem] border border-white/80 bg-white p-2 shadow-[0_24px_70px_-28px_rgba(15,23,42,.35)] lg:mr-8"><img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85" alt="A quiet lantern-lit lane in Kyoto" className="h-64 w-full rounded-[1.35rem] object-cover sm:h-72" /><div className="absolute bottom-5 left-5 rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-teal-700">A slower kind of escape</p><p className="mt-1 text-lg font-extrabold text-slate-900">Kyoto, Japan</p></div><span className="absolute right-5 top-5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Editor's pick</span></div>
      </div>
    </section>
    <DreamVacation />
    <Hotels />
  </main>
);


const ActivitiesPage = () => (
  <main>
    <PageIntro eyebrow="Travel inspiration" title="Make the journey part of the adventure">
      Get ideas for your next trip, from memorable city breaks to slower, more thoughtful escapes.
    </PageIntro>
    <div className="mx-auto max-w-6xl px-6 py-12">
      <NextTrip />
      <div className="mt-12 rounded-2xl bg-slate-900 px-8 py-10 text-white sm:flex sm:items-center sm:justify-between">
        <div><h2 className="text-2xl font-semibold">Ready to plan your next stay?</h2><p className="mt-2 text-slate-300">Browse available places and start shaping your itinerary.</p></div>
        <Link to="/search" className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-blue-50 sm:mt-0">Browse stays <span className="ml-2">→</span></Link>
      </div>
    </div>
  </main>
);


const AboutPage = () => (
  <main>
    <PageIntro eyebrow="About My Dream Place" title="Good trips start with a little inspiration">
      My Dream Place brings travel ideas and accommodation discovery together, making it easier to explore destinations and plan a stay that feels right for you.
    </PageIntro>
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
      <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Travel, your way</p><h2 className="mt-3 text-3xl font-bold text-slate-900">From the first idea to your next favourite place</h2><p className="mt-5 leading-7 text-slate-600">Explore destination guides, discover places to stay, and keep your trip planning in one convenient place. Whether you already know where you are going or are still looking for inspiration, start with what excites you.</p><Link to="/discover" className="mt-7 inline-flex font-semibold text-blue-700 hover:text-blue-900">Discover destinations <span className="ml-2">→</span></Link></div>
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white shadow-lg sm:p-12"><span className="text-5xl" aria-hidden="true">✈</span><p className="mt-8 text-2xl font-semibold">Find somewhere that feels like your kind of place.</p><p className="mt-3 leading-7 text-blue-50">A little inspiration can turn an ordinary search into a trip to remember.</p></div>
    </section>
  </main>
);


const ContactPage = () => (
  <main>
    <PageIntro eyebrow="We're here to help" title="How can we help with your trip?">
      Find your booking, browse available stays, or sign in to manage your account.
    </PageIntro>
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { title: "Find a place to stay", text: "Search the available destinations and accommodation listings.", to: "/search", action: "Browse stays" },
          { title: "Manage your account", text: "Sign in to access your profile and account features.", to: "/login", action: "Go to sign in" },
          { title: "Need inspiration?", text: "Explore destination ideas and guides for your next getaway.", to: "/activities", action: "Explore ideas" },
        ].map((item) => <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><h2 className="text-xl font-semibold text-slate-900">{item.title}</h2><p className="mt-3 min-h-14 leading-6 text-slate-600">{item.text}</p><Link className="mt-5 inline-flex font-semibold text-blue-700 hover:text-blue-900" to={item.to}>{item.action} <span className="ml-2">→</span></Link></article>)}
      </div>
      <p className="mt-8 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">For booking changes, sign in and check your account for the available booking options. A direct customer-support contact channel is not configured on this site yet.</p>
    </section>
  </main>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};


function App() {
  const { pathname } = useLocation();
  const showTravelPromo = ["/", "/discover", "/activities"].includes(pathname);
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/destination/:slug" element={<DestinationGuide />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/category/:slug" element={<SelectedCategory />} />
        <Route path="/user" element={<UserRoutes />}>
          <Route path="" element={<UserDashboard />} />
          <Route path="your-order" element={<YourOrder />} />
        </Route>
        <Route path="/admin" element={<PrivateRoute />}>
          <Route path="" element={<DashBoard />} />
          <Route path="/admin/create-post" element={<CreatePost />} />
          <Route path="/admin/create-category" element={<CreateCategory />} />
          <Route path="/admin/all-post" element={<AllPost />} />
          <Route path="/admin/details" element={<Details />} />
          <Route path="/admin/all-booking" element={<AllTrip />} />
          <Route path="/admin/post/:slug" element={<UpdatePost />} />
        </Route>
      </Routes>
      {showTravelPromo && <Advertisement />}
      <Footer />
    </>
  );
}


export default App;
