import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, MapPin, Wheat } from "lucide-react";
import { useStore, COMPANY } from "@/context/StoreContext";

const IMG_FIELD = "https://images.unsplash.com/photo-1600721860729-d90ff446f6fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGhhcnZlc3QlMjBzdW5zZXQlMjBhZ3JpY3VsdHVyZXxlbnwwfHx8fDE3ODYyNDg5NDV8MA&ixlib=rb-4.1.0&q=85&w=1200";
const IMG_SHIP = "https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBvY2VhbiUyMGxvZ2lzdGljc3xlbnwwfHx8fDE3ODYyNDg5NDV8MA&ixlib=rb-4.1.0&q=85&w=1200";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function About() {
  const { t } = useStore();
  return (
    <div data-testid="about-page">
      <section className="mx-auto max-w-[1400px] px-6 pb-20 pt-20 md:px-10 md:pt-28">
        <motion.p {...fade()} className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("about")}</motion.p>
        <motion.h1 {...fade(0.1)} className="max-w-4xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-forest md:text-7xl">
          Rooted in Gorakhpur. <span className="italic text-harvest">Shipping to the world.</span>
        </motion.h1>
      </section>

      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 pb-24 md:grid-cols-12 md:px-10">
        <motion.div {...fade(0.1)} className="md:col-span-7">
          <img src={IMG_FIELD} alt="Harvest fields of Uttar Pradesh" className="aspect-[16/10] w-full rounded-tl-[3rem] rounded-br-[3rem] border border-forest/10 object-cover" />
        </motion.div>
        <motion.div {...fade(0.2)} className="md:col-span-5">
          <h2 className="font-serif text-3xl font-semibold text-forest md:text-4xl">Our Story</h2>
          <p className="mt-5 leading-relaxed text-forest/70">
            {COMPANY.name} was founded in the heart of Uttar Pradesh's agricultural belt with one conviction — that Indian harvests deserve a premium place on the world's tables.
          </p>
            <p className="mt-4 leading-relaxed text-forest/70">
            Today we export four product lines: aged Basmati and non-Basmati rice, compostable sugarcane bagasse tableware, hand-popped raw Phool Makhana, and food-grade disposable paper cups. Every lot is graded, lab-checked and packed to the buyer's market standard.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ["Established", "2025"],
              ["Legal Status", "Pvt. Ltd. Company"],
              ["Business Type", "Exporter · Supplier · Trader"],
              ["Team", "Up to 15 people"],
              ["Market", "Worldwide"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-forest/10 bg-white px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">{k}</p>
                <p className="mt-0.5 font-serif text-base font-semibold text-forest">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-forest/10 bg-white p-5">
            <MapPin size={18} className="mt-1 shrink-0 text-harvest" />
            <p className="text-sm leading-relaxed text-forest/75">{COMPANY.address}</p>
          </div>
        </motion.div>
      </section>

      <section className="bg-forest-deep px-6 py-24 text-bone md:px-10">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-12">
          <motion.div {...fade()} className="md:col-span-5">
            <Users size={30} className="text-harvest" />
            <h2 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">The People Behind Starvesta</h2>
            <p className="mt-4 leading-relaxed text-bone/70">
              Led by {COMPANY.contacts.join(" and ")}, our export desk handles everything from sourcing and quality inspection to documentation, freight and after-shipment support.
            </p>
            <ul className="mt-6 space-y-3">
              {COMPANY.contacts.map((c) => (
                <li key={c} className="flex items-center gap-3 rounded-xl border border-bone/10 bg-forest-surface px-5 py-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-harvest/15 text-harvest"><Users size={15} /></span>
                  <span className="font-medium">{c}</span>
                </li>
              ))}
            </ul>
            <Link data-testid="about-contact-btn" to="/contact" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-harvest px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-1 hover:bg-harvest-light">
              {t("contact")} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.div {...fade(0.15)} className="md:col-span-7">
            <img src={IMG_SHIP} alt="Global export logistics" className="aspect-[16/10] w-full rounded-tl-[3rem] rounded-br-[3rem] border border-bone/10 object-cover" />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-forest/10 bg-forest/10 sm:grid-cols-3">
          {[
            { icon: Wheat, title: "Farm-Gate Sourcing", text: "Direct procurement from grower clusters keeps quality high and costs honest." },
            { icon: Users, title: "Buyer-First Service", text: "One dedicated export manager from enquiry to delivery at your port." },
            { icon: MapPin, title: "Strategic Location", text: "Gorakhpur, UP — connected to Mundra and Nhava Sheva ports by rail and road." },
          ].map((v, i) => (
            <motion.div key={v.title} {...fade(i * 0.1)} className="bg-bone-warm p-8">
              <v.icon size={24} className="text-harvest" />
              <h3 className="mt-4 font-serif text-2xl font-semibold text-forest">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-forest/65">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
