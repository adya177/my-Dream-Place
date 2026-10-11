import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import FilterSidebar from "../components/Serach/FilterSidebar";
import ProductList from "../components/Serach/ProductList";
import { useSearch } from "../context/Serach";


const SearchPage = () => {
  const [search, setSearch] = useSearch();
  const [searchParams] = useSearchParams();
  const [filteredResults, setFilteredResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const results = filteredResults ?? search.results ?? [];
  const guideSlug = (search.keyword || "").trim().toLowerCase().replace(/ /g, "-").replace("amalfi-coast", "amalfi");
  const hasDestinationGuide = ["bali", "kyoto", "paris", "santorini", "maldives", "sydney", "tokyo", "amalfi"].includes(guideSlug);


  const findStays = async (keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      toast.info("Enter a destination or hotel name to search.");
      return;
    }
    setLoading(true);
    setError("");
    setFilteredResults(null);
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + "/api/booking/search/" + encodeURIComponent(trimmed));
      const stays = Array.isArray(response.data) ? response.data : [];
      setSearch((current) => ({ ...current, keyword: trimmed, results: stays }));
    } catch (requestError) {
      const message = requestError.response?.data?.message || "We could not load stays right now. Please try again.";
      setSearch((current) => ({ ...current, keyword: trimmed, results: [] }));
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (!keyword) return;
    setSearch((current) => ({ ...current, keyword }));
    findStays(keyword);
  }, [searchParams]);


  const handleSubmit = (event) => {
    event.preventDefault();
    findStays(search.keyword || "");
  };


  const applyFilters = async (filters) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(import.meta.env.VITE_BASE_URL + "/api/post/product-filters", filters);
      const stays = response.data?.success ? (response.data.products ?? []) : [];
      setFilteredResults(stays);
    } catch (filterError) {
      const message = filterError.response?.data?.message || "Those filters could not be applied. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-[55vh] bg-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Find your stay</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Explore places to stay</h1>
          <p className="mt-3 leading-7 text-slate-600">Search by destination or property name, then narrow down the results to match your trip.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
          <label className="sr-only" htmlFor="stay-search">Destination or property</label>
          <input id="stay-search" type="search" placeholder="Where do you want to go?" value={search.keyword || ""} onChange={(event) => setSearch((current) => ({ ...current, keyword: event.target.value }))} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400">{loading ? "Searching…" : "Search stays"}</button>
        </form>


        {error && <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-600">Finding stays for you…</div>
          ) : results.length ? (
            <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><FilterSidebar applyFilters={applyFilters} /></aside>
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><ProductList products={results} /></section>
            </div>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-700" aria-hidden="true">⌕</div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-900">{search.keyword ? "No stays found for “" + search.keyword + "”" : "Start with a destination"}</h2>
              <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">{search.keyword ? "Try another city or hotel name, or explore our travel inspiration while new stays are being added." : "Enter a destination or property name above to see matching stays."}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3"><Link to="/discover" className="inline-flex rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50">Explore destinations</Link>{search.keyword && hasDestinationGuide && <Link to={"/destination/" + guideSlug} className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">Read the {search.keyword} guide <span className="ml-2" aria-hidden="true">→</span></Link>}</div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};


export default SearchPage;
