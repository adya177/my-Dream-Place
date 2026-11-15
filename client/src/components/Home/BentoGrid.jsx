import { motion } from "framer-motion";
import { ArrowUpRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { indianStates } from "../../data/indianStates";

const places = [
  { city: "Kyoto", country: "Japan", vibe: "Quiet mornings, neon nights", tag: "CULTURE RESET", image: "photo-1493976040374-85c8e12f0c0e", shape: "large" },
  { city: "Bali", country: "Indonesia", vibe: "Your out-of-office era", tag: "SLOW LIVING", image: "photo-1530789253388-582c481c54b0", shape: "wide" },
  { city: "Goa", country: "India", vibe: "Salt in your hair", tag: "BEACH MODE", image: "photo-1512343879784-a960bf40e7f2", shape: "small" },
  { city: "Paris", country: "France", vibe: "Get lost on purpose", tag: "CITY CRUSH", image: "photo-1502602898657-3e91760cbb34", shape: "small" },
  { city: "Santorini", country: "Greece", vibe: "Blue hour, all day", tag: "POSTCARD IRL", image: "photo-1533105079780-92b9be482077", shape: "wide" },
];
const imageUrl = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;
const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } };
const cardVariants = { hidden: { opacity: 0, y: 24, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } };

export default function BentoGrid() {
  return (
    <section id="destinations" className="home-destinations px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="home-section-heading"><div><span className="home-section-kicker"><Compass size={15}/> THE WHERE-TO-NEXT BOARD</span><h2>Pick your <em>plot twist.</em></h2><p>Five places, five completely different versions of you.</p></div><Link to="/discover" className="home-view-link">All destinations <ArrowUpRight size={17}/></Link></div>
        <motion.div className="home-bento-grid" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
          {places.map((place, index) => (
            <motion.div key={place.city} variants={cardVariants} className={`home-bento-card home-bento-card--${place.shape}`} whileHover={{ y: -6, transition: { type: "spring", stiffness: 280, damping: 22 } }}>
              <Link to={`/search?city=${encodeURIComponent(place.city)}`} aria-label={`Find stays in ${place.city}, ${place.country}`}>
                <img src={imageUrl(place.image)} alt={`${place.city}, ${place.country}`} loading="lazy" />
                <span className="home-bento-card__shade" />
                <span className="home-bento-card__tag"><span>{index === 0 ? "✳" : "✦"}</span>{place.tag}</span>
                <span className="home-bento-card__arrow"><ArrowUpRight size={17}/></span>
                <span className="home-bento-card__copy"><small>{place.country}</small><strong>{place.city}</strong><span>{place.vibe}</span></span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <div className="home-india-states">
          <div><span className="home-section-kicker">✦ 28 STATES · 100 STAYS EACH</span><h3>Explore India, your way.</h3><p>Find a fresh favourite in every state.</p></div>
          <div className="home-india-states__chips">{indianStates.map((state) => <Link key={state} to={`/search?state=${encodeURIComponent(state)}`}>{state}<span>100+</span></Link>)}</div>
        </div>
        <motion.div className="home-after-grid" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span>Different city, different lore.</span><Link to="/search">Let&apos;s find your stay <ArrowUpRight size={16}/></Link>
        </motion.div>
      </div>
    </section>
  );
}
