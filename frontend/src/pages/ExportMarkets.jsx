import { motion } from "framer-motion";
import { Ship, FileCheck, Globe2, Container } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const IMG_SHIP = "https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBvY2VhbiUyMGxvZ2lzdGljc3xlbnwwfHx8fDE3ODYyNDg5NDV8MA&ixlib=rb-4.1.0&q=85&w=2000";

const REGIONS = [
  { name: "Middle East & Gulf", countries: ["UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain"] },
  { name: "Europe", countries: ["United Kingdom", "Netherlands", "Germany", "France", "Italy", "Spain"] },
  { name: "North America", countries: ["United States", "Canada", "Mexico"] },
  { name: "Asia-Pacific", countries: ["Singapore", "Malaysia", "Australia", "Japan", "South Korea"] },
  { name: "Africa", countries: ["Kenya", "South Africa", "Nigeria", "Egypt", "Morocco"] },
];

const TRADE = [
  { icon: Container, title: "Incoterms", text: "EXW, FOB, CIF, CFR, DAP and DDP — we quote the term that fits your supply chain." },
  { icon: Ship, title: "Ports & Freight", text: "Shipments via Mundra and Nhava Sheva. FCL and LCL consolidation available." },
  { icon: FileCheck, title: "Documentation", text: "Invoice, packing list, COO, phytosanitary, fumigation and lab reports per lot." },
  { icon: Globe2, title: "Payment Terms", text: "TT advance/balance and irrevocable LC at sight for established partners." },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function ExportMarkets() {
  const { t } = useStore();
  return (
    <div data-testid="export-markets-page">
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-forest-deep">
        <img src={IMG_SHIP} alt="Cargo vessel at sea" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-forest-deep/25" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-14 pt-32 md:px-10">
          <motion.p {...fade()} className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("markets")}</motion.p>
          <motion.h1 {...fade(0.1)} className="max-w-3xl font-serif text-5xl font-medium tracking-tight text-bone md:text-6xl">
            {t("marketsTitle")}
          </motion.h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r, i) => (
            <motion.div
              key={r.name}
              {...fade(i * 0.08)}
              data-testid={`region-${r.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={`rounded-2xl border border-forest/10 bg-white p-7 ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <h3 className="font-serif text-2xl font-semibold text-forest">{r.name}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.countries.map((c) => (
                  <span key={c} className="rounded-full border border-forest/15 px-3.5 py-1.5 text-xs font-semibold text-forest/70 transition-colors hover:border-harvest hover:text-harvest">
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
          <motion.div {...fade(0.4)} className="flex flex-col justify-center rounded-2xl bg-forest p-7 text-bone">
            <p className="font-serif text-5xl font-medium text-harvest">25+</p>
            <p className="mt-2 text-sm text-bone/70">Countries served — and a dedicated desk for new markets.</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-forest-deep px-6 py-24 text-bone md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.h2 {...fade()} className="mb-14 font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Trade, Terms & Logistics
          </motion.h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
            {TRADE.map((item, i) => (
              <motion.div key={item.title} {...fade(i * 0.08)} className="bg-forest-deep p-8 transition-colors hover:bg-forest-surface">
                <item.icon size={26} className="text-harvest" />
                <h3 className="mt-4 font-serif text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
