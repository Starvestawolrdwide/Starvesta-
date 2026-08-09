import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, ShieldCheck, Globe2, Leaf, PackageCheck, Wheat, Sprout, Nut } from "lucide-react";
import { useStore, API } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

const HERO_IMG = "https://images.unsplash.com/photo-1600721860729-d90ff446f6fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGhhcnZlc3QlMjBzdW5zZXQlMjBhZ3JpY3VsdHVyZXxlbnwwfHx8fDE3ODYyNDg5NDV8MA&ixlib=rb-4.1.0&q=85&w=2000";
const IMG_RICE = "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHByZW1pdW18ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85&w=1200";
const IMG_BAGASSE = "https://images.unsplash.com/photo-1727021024931-90c226e8448d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhZ2Fzc2UlMjBwbGF0ZXMlMjBzdWdhcmNhbmV8ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85&w=1200";
const IMG_MAKHANA = "https://images.unsplash.com/photo-1710421576768-ff985fa63b60?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHx3YXRlciUyMGxpbHklMjBzZWVkcyUyMGZveG51dCUyMG1ha2hhbmF8ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85&w=1200";
const IMG_SHIP = "https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBvY2VhbiUyMGxvZ2lzdGljc3xlbnwwfHx8fDE3ODYyNDg5NDV8MA&ixlib=rb-4.1.0&q=85&w=1600";

const MARQUEE_ITEMS = ["United Arab Emirates", "Saudi Arabia", "United States", "United Kingdom", "Netherlands", "Singapore", "Australia", "Qatar", "Oman", "Kenya", "Germany", "Canada", "Malaysia", "South Africa"];

const RevealLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const chapters = [
  { num: "01", icon: Wheat, title: "Rice", to: "/rice", img: IMG_RICE,
    text: "Aged Basmati and high-volume non-Basmati — 1121, 1509, Sella, Golden Sella and Broken Rice, milled and sorted to export specification." },
  { num: "02", icon: Sprout, title: "Bagasse Disposables", to: "/bagasse-products", img: IMG_BAGASSE,
    text: "Plates, bowls, trays, clamshells and meal boxes pressed from sugarcane fibre — compostable, food-grade and plastic-free." },
  { num: "03", icon: Nut, title: "Foxnut / Makhana", to: "/foxnut-makhana", img: IMG_MAKHANA,
    text: "Hand-popped Mithila makhana in every suta grade — from everyday 4 Suta to rare Jumbo lots and flavoured retail lines." },
];

const whyItems = [
  { icon: ShieldCheck, title: "Verified Quality", text: "Lot-wise inspection, lab reports and certification support on every shipment." },
  { icon: PackageCheck, title: "Export-Grade Packing", text: "PP/jute bags, retail private labelling and container-optimised carton packing." },
  { icon: Globe2, title: "End-to-End Logistics", text: "EXW to DDP — documentation, customs and freight handled by our export desk." },
  { icon: Leaf, title: "Sustainable Sourcing", text: "Compostable bagasse and farm-gate sourcing that supports Indian growers." },
];

export default function Home() {
  const { t } = useStore();
  const [featured, setFeatured] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  useEffect(() => {
    axios.get(`${API}/products?featured=true`).then((r) => setFeatured(r.data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[92vh] items-end overflow-hidden bg-forest-deep">
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <img src={HERO_IMG} alt="Indian harvest at sunrise" className="h-[115%] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest-deep/25" />
        </motion.div>

        <motion.div style={{ y: textY }} className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 pt-40 md:px-10">
          <RevealLine delay={0.15}>
            <span data-testid="hero-badge" className="mb-6 inline-flex items-center gap-2 rounded-full border border-harvest/40 bg-forest-deep/50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-harvest backdrop-blur">
              {t("heroBadge")}
            </span>
          </RevealLine>
          <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight text-bone sm:text-6xl lg:text-[5.5rem]">
            <RevealLine delay={0.3}>{t("heroLine1")}</RevealLine>
            <RevealLine delay={0.45} className="italic text-harvest">{t("heroLine2")}</RevealLine>
            <RevealLine delay={0.6}>{t("heroLine3")}</RevealLine>
          </h1>
          <RevealLine delay={0.8}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-bone/75 md:text-lg">{t("heroSub")}</p>
          </RevealLine>
          <RevealLine delay={0.95}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                data-testid="hero-explore-btn"
                to="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-harvest px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-1 hover:bg-harvest-light"
              >
                {t("exploreProducts")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                data-testid="hero-contact-btn"
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-bone transition-all hover:-translate-y-1 hover:border-harvest hover:text-harvest"
              >
                {t("sendEnquiry")}
              </Link>
            </div>
          </RevealLine>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute bottom-8 right-8 z-10 hidden text-bone/60 md:block"
        >
          <ArrowDown size={22} />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-harvest/25 bg-forest py-4" data-testid="markets-marquee">
        <div className="animate-marquee-slow flex w-max items-center">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((m, i) => (
            <span key={i} className="flex items-center font-serif text-lg italic text-bone/70">
              <span className="px-6">{m}</span>
              <span className="text-harvest">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* MANIFESTO CHAPTERS */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32" data-testid="manifesto-section">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest"
        >
          {t("categoriesSub")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 font-serif text-4xl font-medium tracking-tight text-forest md:mb-24 md:text-6xl"
        >
          {t("categoriesTitle")}
        </motion.h2>

        <div className="space-y-20 md:space-y-28">
          {chapters.map((c, i) => (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 === 1 ? "" : ""}`}
            >
              <div className={`relative md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <span className="pointer-events-none absolute -top-10 left-0 z-10 font-serif text-[6rem] font-semibold leading-none text-harvest/25 md:text-[9rem]">
                  {c.num}
                </span>
                <Link to={c.to} className="group block overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] border border-forest/10">
                  <img src={c.img} alt={c.title} loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1 md:pr-8 md:text-right" : "md:pl-8"}`}>
                <c.icon size={28} className={`mb-4 text-harvest ${i % 2 === 1 ? "md:ml-auto" : ""}`} />
                <h3 className="font-serif text-3xl font-semibold text-forest md:text-4xl">{c.title}</h3>
                <p className="mt-4 leading-relaxed text-forest/70">{c.text}</p>
                <Link
                  data-testid={`chapter-link-${c.num}`}
                  to={c.to}
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-harvest transition-colors hover:text-forest"
                >
                  {t("viewDetails")}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-bone px-6 py-24 md:py-28" data-testid="featured-section">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("featuredSub")}</p>
              <h2 className="font-serif text-4xl font-medium tracking-tight text-forest md:text-5xl">{t("featuredTitle")}</h2>
            </div>
            <Link data-testid="featured-view-all" to="/products" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-forest transition-colors hover:text-harvest">
              {t("browseProducts")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* WHY STARVESTA — dark */}
      <section className="bg-forest-deep px-6 py-24 text-bone md:py-32" data-testid="why-section">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-16 max-w-2xl font-serif text-4xl font-medium tracking-tight md:text-5xl">
            {t("whyTitle")}
          </h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-forest-deep p-8 transition-colors hover:bg-forest-surface"
              >
                <span className="font-serif text-5xl font-medium text-harvest/30 transition-colors group-hover:text-harvest">0{i + 1}</span>
                <w.icon size={26} className="mt-6 text-harvest" />
                <h3 className="mt-4 font-serif text-2xl font-semibold">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-28 md:py-36" data-testid="home-cta">
        <img src={IMG_SHIP} alt="Cargo ship at sea" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-deep/75" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-bone md:text-6xl">
            Ready to import from India?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-bone/75">
            Share your requirement — our export desk replies with pricing, specs and shipping plan within 24 hours.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link data-testid="cta-quote-btn" to="/contact" className="rounded-full bg-harvest px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-1 hover:bg-harvest-light">
              {t("requestQuote")}
            </Link>
            <Link data-testid="cta-register-btn" to="/register" className="rounded-full border border-bone/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-bone transition-all hover:-translate-y-1 hover:border-harvest hover:text-harvest">
              {t("register")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
