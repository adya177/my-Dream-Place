import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const headline = ["Your next", "somewhere."].map((line) => line.split(" "));
const wordVariants = {
  hidden: { opacity: 0, y: 35, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section className="home-hero relative isolate overflow-hidden px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pb-24 lg:pt-28">
      <div className="home-hero__glow home-hero__glow--one" aria-hidden="true" />
      <div className="home-hero__glow home-hero__glow--two" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }} className="home-kicker">
            <Sparkles size={14} /> Independent stays for curious people <span className="home-kicker__pulse" />
          </motion.div>
          <h1 className="home-hero__title" aria-label="Your next somewhere is closer than you think">
            {headline.map((words, lineIndex) => (
              <span className="home-hero__line" key={lineIndex}>
                {words.map((word, wordIndex) => (
                  <motion.span key={word} variants={wordVariants} initial="hidden" animate="show" transition={{ delay: 0.2 + lineIndex * 0.2 + wordIndex * 0.1 }} className={lineIndex === 1 ? "home-hero__gradient-word" : ""}>
                    {word}{" "}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p className="home-hero__copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.65 }}>
            Less scrolling. More stories to tell. Find the stay that turns a trip into your thing.
          </motion.p>
          <motion.div className="home-hero__actions" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.78, duration: 0.55 }}>
            <Link to="/search" className="home-primary-cta">Find your stay <ArrowUpRight size={17} /></Link>
            <a href="#destinations" className="home-text-cta">Get inspired <ArrowDownRight size={16} /></a>
          </motion.div>
          <motion.div className="home-social-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
            <div className="home-avatar-stack" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>R</span></div>
            <p><strong>4.9/5</strong> from people with good taste <span>✦ ✦ ✦ ✦ ✦</span></p>
          </motion.div>
        </div>

        <motion.div className="home-hero-art" initial={{ opacity: 0, scale: 0.95, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.35, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <div className="home-hero-art__frame">
            <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1500&q=90" alt="A sunlit pool overlooking the mountains in Bali" fetchPriority="high" />
            <div className="home-hero-art__veil" />
            <div className="home-hero-art__caption"><span className="home-hero-art__label">ON OUR MOODBOARD</span><strong>Bali, but make it slow.</strong><span>Ubud, Indonesia <i>·</i> 5 nights from ₹8,400</span></div>
          </div>
          <motion.div className="home-float-card home-float-card--top" animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><span className="home-float-card__emoji">🌴</span><span><small>THE GROUP CHAT PICK</small><strong>Somewhere sunny</strong></span><span className="home-float-card__sparkle">✳</span></motion.div>
          <motion.div className="home-float-card home-float-card--bottom" animate={{ y: [0, 6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}><span className="home-float-card__rating">★</span><span><small>GUEST FAVOURITE</small><strong>That main character stay</strong></span></motion.div>
          <div className="home-hero-art__orbit" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
