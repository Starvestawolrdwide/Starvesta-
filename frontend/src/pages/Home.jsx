import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, ShieldCheck, Globe2, Leaf, PackageCheck, Wheat, Sprout, Nut, CupSoda, MessageSquare, FileText, Package, FileCheck, Ship, ClipboardCheck, SearchCheck, Tag, Headset, BadgeCheck } from "lucide-react";
import { useStore, API } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

const HERO_IMG = "https://images.unsplash.com/photo-1600721860729-d90ff446f6fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGhhcnZlc3QlMjBzdW5zZXQlMjBhZ3JpY3VsdHVyZXxlbnwwfHx8fDE3ODYyNDg5NDV8MA&ixlib=rb-4.1.0&q=85&w=2000";
const IMG_RICE = "/products/hq/rice-golden-sella.jpg";
const IMG_BAGASSE = "/products/hq/bag-mealbox.jpg";
const IMG_MAKHANA = "/products/hq/mk-12mm.jpg";
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
  { num: "03", icon: Nut, title: "Foxnut / Makhana", to: "/foxnut-makhana", img: "/products/mk-19mm.jpg",
    text: "Hand-popped raw phool makhana in every grade — 4/5/6 Sutta, 12/15/19 mm, premium Phool and flavoured retail lines." },
  { num: "04", icon: CupSoda, title: "Paper Cups", to: "/paper-cups", img: "/products/cup-double-wall.jpg",
    text: "Food-grade disposable paper cups from 110 ml to 710 ml — single wall, double wall, plain and custom printed for your brand." },
];

const whyItems = [
  { icon: ShieldCheck, title: "Verified Quality", text: "Lot-wise inspection, lab reports and certification support on every shipment." },
  { icon: PackageCheck, title: "Export-Grade Packing", text: "PP/jute bags, retail private labelling and container-optimised carton packing." },
  { icon: Globe2, title: "End-to-End Logistics", text: "EXW to DDP — documentation, customs and freight handled by our export desk." },
  { icon: Leaf, title: "Sustainable Sourcing", text: "Compostable bagasse and farm-gate sourcing that supports Indian growers." },
];

const steps = [
  { icon: MessageSquare, title: "Enquiry & Specs", text: "Share product, grade, quantity and destination port — by form or WhatsApp." },
  { icon: FileText, title: "Quotation in 24h", text: "Itemised quote with specs, packing, Incoterm pricing and validity." },
  { icon: Package, title: "Sampling", text: "Paid samples couriered worldwide so you approve quality before the lot." },
  { icon: ShieldCheck, title: "Quality Inspection", text: "Lot-wise QC with photos, videos and optional SGS / Intertek inspection." },
  { icon: FileCheck, title: "Documentation", text: "Invoice, packing list, COO, phytosanitary and fumigation — handled for you." },
  { icon: Ship, title: "Shipment & Updates", text: "FCL/LCL booking via Mundra & Nhava Sheva with tracking till your port." },
];

const assurance = [
  { icon: ClipboardCheck, title: "Pre-Shipment QC", text: "Photo and video evidence of your actual lot before it leaves India." },
  { icon: SearchCheck, title: "Third-Party Inspection", text: "SGS, Intertek or Bureau Veritas inspections welcomed on any order." },
  { icon: Tag, title: "Private Label & OEM", text: "Your brand, your bags — retail pouches to bulk private labelling." },
  { icon: Globe2, title: "Flexible Incoterms", text: "EXW, FOB, CIF, DAP, DDP — buy the way your supply chain works." },
  { icon: ShieldCheck, title: "Cargo Insurance", text: "Marine insurance arranged on request for full transit peace of mind." },
  { icon: Headset, title: "Dedicated Manager", text: "One export manager from first enquiry to delivery — no call centres." },
];

const certPills = ["FSSAI", "APEDA", "ISO 22000", "HACCP", "EN 13432 Compostable", "IEC Registered"];

const showroom = [
  { img: "/products/hq/rice-1121.jpg", title: "1121 Basmati Rice", sub: "The Grain" },
  { img: "/products/hq/mk-5sutta.jpg", title: "Raw Phool Makhana", sub: "The Pop" },
  { img: "/products/hq/plate-round.jpg", title: "Bagasse Tableware", sub: "The Fibre" },
  { img: "/products/hq/cup-printed.jpg", title: "Printed Paper Cups", sub: "The Cup" },
  { img: "/products/hq/rice-golden-sella.jpg", title: "Golden Sella Basmati", sub: "The Grain" },
  { img: "/products/hq/bag-mealbox.jpg", title: "Bagasse Meal Boxes", sub: "The Fibre" },
];

function ShowroomStrip() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % showroom.length), 5200);
    return () => clearInterval(t);
  }, []);
  const current = showroom[idx];
  return (
    <section data-testid="showroom-strip" className="relative h-[70vh] overflow-hidden bg-forest-deep">
      <AnimatePresence>
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <motion.img
            src={current.img}
            alt={current.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.14 }}
            transition={{ duration: 7, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/10 to-forest-deep/40" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bone/70">Starvesta Showroom</span>
        <span data-testid="showroom-counter" className="font-serif text-sm italic text-bone/70">
          {String(idx + 1).padStart(2, "0")} / {String(showroom.length).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-8 md:px-10">
        <div key={`cap-${idx}`}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-1 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-200"
          >
            {current.sub}
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            data-testid="showroom-title"
            className="mt-1 font-serif text-4xl font-medium text-bone md:text-5xl"
          >
            {current.title}
          </motion.h3>
        </div>
        <div className="hidden gap-2 md:flex">
          {showroom.map((s, i) => (
            <button
              key={s.title}
              data-testid={`showroom-dot-${i}`}
              onClick={() => setIdx(i)}
              aria-label={`Show ${s.title}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? "w-10 bg-harvest" : "w-4 bg-bone/30 hover:bg-bone/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1600, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return <span ref={ref}>{n}{suffix}</span>;
};

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
            <div className="mb-8 flex items-center gap-4" data-testid="hero-brand">
              <img src="/logo.png" alt="Starvesta Worldwide logo" className="h-16 w-16 rounded-full bg-white object-contain p-1 ring-2 ring-harvest/60 md:h-20 md:w-20" />
              <span className="leading-tight">
                <span className="flex items-center gap-2.5">
                  <span className="whitespace-nowrap font-serif text-3xl font-bold tracking-[0.05em] text-bone md:text-4xl">STARVESTA</span>
                  <svg viewBox="0 0 40 24" fill="none" className="h-5 w-9 text-harvest" aria-hidden="true">
                    <path d="M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
                    <path d="M28 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
                    <path d="M20 4l2.2 4.4L27 9l-3.5 3 .8 4.6L20 14l-4.3 2.6.8-4.6L13 9l4.8-.6L20 4z" fill="currentColor" />
                    <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.7" />
                    <circle cx="25" cy="12" r="1" fill="currentColor" opacity="0.7" />
                  </svg>
                </span>
                <span className="mt-1.5 block whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.32em] text-blue-200 md:text-[11px]" style={{ textShadow: "0 1px 8px rgba(10,18,48,0.9)" }}>
                  Worldwide Pvt. Ltd. — Gorakhpur, India
                </span>
              </span>
            </div>
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
          <RevealLine delay={1.1}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2" data-testid="hero-trust-chips">
              {["GST Registered", "IEC Certified", "GMP Certified", "24h Response"].map((chip) => (
                <span key={chip} className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bone/60">
                  <BadgeCheck size={14} className="text-harvest" /> {chip}
                </span>
              ))}
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

      {/* STATS STRIP */}
      <section className="border-b border-forest/10 bg-bone-warm px-6 py-14" data-testid="stats-strip">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 lg:grid-cols-4">
          {[
            { value: 25, suffix: "+", label: t("statsCountries") },
            { value: 3, suffix: "", label: t("statsLines") },
            { value: 500, suffix: "+", label: t("statsCapacity") },
            { value: 24, suffix: "", label: t("statsResponse") },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-5xl font-semibold text-forest md:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-harvest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

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

      {/* SHOWROOM STRIP */}
      <ShowroomStrip />

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

      {/* EXPORT PROCESS */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32" data-testid="process-section">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("processSub")}</p>
        <h2 className="mb-16 max-w-2xl font-serif text-4xl font-medium tracking-tight text-forest md:text-5xl">
          {t("processTitle")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-forest/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-harvest/50"
            >
              <span className="pointer-events-none absolute -right-2 -top-4 font-serif text-7xl font-semibold text-forest/5 transition-colors group-hover:text-harvest/15">
                0{i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-harvest transition-colors group-hover:bg-harvest group-hover:text-white">
                <s.icon size={20} />
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-forest">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-forest/65">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BUYER ASSURANCE — dark */}
      <section className="bg-forest px-6 py-24 text-bone md:px-10 md:py-32" data-testid="assurance-section">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("assuranceSub")}</p>
          <h2 className="mb-16 max-w-2xl font-serif text-4xl font-medium tracking-tight md:text-5xl">
            {t("assuranceTitle")}
          </h2>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {assurance.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                className="border-t border-bone/15 pt-6"
              >
                <a.icon size={24} className="text-harvest" />
                <h3 className="mt-4 font-serif text-2xl font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/65">{a.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-bone/10 pt-10" data-testid="cert-strip">
            <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.25em] text-bone/50">{t("certifiedBy")}:</span>
            {certPills.map((c) => (
              <span key={c} className="rounded-full border border-harvest/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-harvest">
                {c}
              </span>
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
