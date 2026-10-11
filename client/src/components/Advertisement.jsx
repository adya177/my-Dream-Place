import backgroundImage from "../assets/Rectangle 18.png";
import smartphoneImage from "../assets/Isolated_right_hand_with_smartphone 2.png";
import { Link } from "react-router-dom";

const Advertisement = () => (
  <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-6 lg:px-8">
    <div className="relative isolate flex min-h-64 items-center overflow-hidden rounded-3xl bg-cover bg-center px-6 py-10 shadow-lg sm:px-10 md:min-h-[18rem]" style={{ backgroundImage: "url(" + backgroundImage + ")" }}>
      <div className="absolute inset-0 -z-10 bg-slate-950/55" />
      <div className="max-w-xl text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Make the next trip yours</p>
        <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">A little inspiration can take you somewhere wonderful.</h2>
        <p className="mt-3 max-w-lg leading-6 text-slate-100">Explore destination ideas and find a place to stay for your next escape.</p>
        <Link to="/discover" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-blue-50">Explore destinations <span aria-hidden="true" className="ml-2">→</span></Link>
      </div>
      <img src={smartphoneImage} alt="Travel planning app preview on a smartphone" className="absolute -right-10 bottom-0 hidden h-full max-h-[19rem] w-[38%] object-contain object-bottom md:block" />
    </div>
  </section>
);

export default Advertisement;
