import Hero from "../components/Home/Hero";
import GlassSearch from "../components/Home/GlassSearch";
import BentoGrid from "../components/Home/BentoGrid";

const HomePage = () => {
  return (
    <main className="home-page">
      <Hero />
      <GlassSearch />
      <BentoGrid />
    </main>
  );
};

export default HomePage;
