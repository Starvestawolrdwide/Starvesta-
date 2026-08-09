import { motion } from "framer-motion";
import { ShieldCheck, FileBadge, Leaf, Award, ClipboardCheck, Stamp } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const CERTS = [
  { icon: ShieldCheck, name: "FSSAI", desc: "Food Safety and Standards Authority of India licence for all food product lines." },
  { icon: FileBadge, name: "APEDA", desc: "Registered with the Agricultural & Processed Food Products Export Development Authority." },
  { icon: Award, name: "ISO 22000", desc: "Food safety management system across sourcing, processing and packing partners." },
  { icon: ClipboardCheck, name: "HACCP", desc: "Hazard analysis and critical control point compliance for processing facilities." },
  { icon: Leaf, name: "EN 13432 Compostability", desc: "Bagasse tableware certified industrially compostable — plastic-free by design." },
  { icon: Stamp, name: "IEC · GST · COO", desc: "Import-Export Code, GST registration and Certificate of Origin support on every shipment." },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Certifications() {
  const { t } = useStore();
  return (
    <div data-testid="certifications-page" className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
      <motion.p {...fade()} className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("certifications")}</motion.p>
      <motion.h1 {...fade(0.1)} className="max-w-3xl font-serif text-5xl font-medium tracking-tight text-forest md:text-6xl">
        {t("certsTitle")}
      </motion.h1>
      <motion.p {...fade(0.2)} className="mt-5 max-w-2xl leading-relaxed text-forest/70">
        Every consignment ships with the documentation your market requires. Copies of certificates and third-party lab reports are shared on request with your quote.
      </motion.p>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c, i) => (
          <motion.div
            key={c.name}
            {...fade(i * 0.07)}
            data-testid={`cert-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="group rounded-2xl border border-forest/10 bg-white p-8 transition-all hover:-translate-y-1 hover:border-harvest/50"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-harvest transition-colors group-hover:bg-harvest group-hover:text-white">
              <c.icon size={24} />
            </span>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-forest">{c.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-forest/65">{c.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div {...fade(0.2)} className="mt-16 rounded-2xl bg-forest p-10 text-bone md:p-14">
        <h2 className="font-serif text-3xl font-medium md:text-4xl">Need a specific certification for your market?</h2>
        <p className="mt-4 max-w-2xl text-bone/70">
          We regularly arrange third-party inspections (SGS, Intertek, Bureau Veritas) and market-specific documentation. Mention your requirement in the enquiry and we will confirm feasibility with the quote.
        </p>
      </motion.div>
    </div>
  );
}
