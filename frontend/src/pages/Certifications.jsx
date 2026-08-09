import { motion } from "framer-motion";
import { ShieldCheck, FileBadge, Leaf, Landmark, Globe2, BadgeCheck, Stamp, ExternalLink } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const DOCS = [
  { icon: Landmark, name: "Certificate of Incorporation", no: "CIN U47721UP2025PTC236679",
    desc: "Incorporated 18 Nov 2025 under the Companies Act, 2013 — Ministry of Corporate Affairs, Govt. of India.",
    img: "/certs/incorporation-certificate.png" },
  { icon: Stamp, name: "GST Registration", no: "GSTIN 09ABRCS8427N1Z9",
    desc: "Form GST REG-06 · Regular registration · Issued 20 Dec 2025, Uttar Pradesh.",
    img: "/certs/gst-certificate.jpg" },
  { icon: Globe2, name: "Importer-Exporter Code", no: "IEC ABRCS8427N",
    desc: "Issued 22 Dec 2025 by DGFT, Ministry of Commerce & Industry, Govt. of India.",
    img: "/certs/iec-certificate.jpg" },
  { icon: BadgeCheck, name: "GMP Certified", no: "GMP/230620/9489",
    desc: "Good Manufacturing Practice — scope: Poped & Flavoured Makhana, Disposable Paper Cups, Sugarcane Bagasse Tableware. Valid 02 Dec 2025 – 01 Dec 2028.",
    img: "/certs/gmp-certificate.png" },
  { icon: ShieldCheck, name: "SA 8000:2014", no: "ICI/1119441/25",
    desc: "Social Accountability — International Certification & Inspection UK Ltd. Registered 05 Dec 2025, valid to 04 Dec 2028.",
    img: "/certs/sa8000-certificate.jpg" },
  { icon: Leaf, name: "HACCP Certified", no: "HACCP/230620/9490",
    desc: "Hazard Analysis & Critical Control Point — International Standards Certification (ISC). Valid 02 Dec 2025 – 01 Dec 2028.",
    img: "/certs/haccp-certificate.jpg" },
  { icon: FileBadge, name: "PAN & TAN", no: "PAN ABRCS8427N · TAN ALDS13935F",
    desc: "Income Tax Department, Govt. of India — statutory tax identities of the company.",
    img: "/certs/tan-letter.jpg" },
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
        Starvesta Worldwide Pvt. Ltd. is a Government of India registered private limited company with GST, IEC, GMP and SA 8000 certifications. Click any document to view the original certificate — every consignment ships with the paperwork your market requires.
      </motion.p>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DOCS.map((c, i) => (
          <motion.div
            key={c.name}
            {...fade(i * 0.07)}
            data-testid={`cert-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white transition-all hover:-translate-y-1 hover:border-harvest/50"
          >
            {c.img && (
              <a href={c.img} target="_blank" rel="noopener noreferrer" data-testid={`cert-doc-${i}`} className="relative block h-52 overflow-hidden border-b border-forest/10">
                <img src={c.img} alt={`${c.name} document`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-forest/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-bone backdrop-blur">
                  View Document <ExternalLink size={11} />
                </span>
              </a>
            )}
            <div className="flex flex-1 flex-col p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest text-harvest transition-colors group-hover:bg-harvest group-hover:text-white">
                <c.icon size={22} />
              </span>
              <h3 className="mt-4 font-serif text-2xl font-semibold text-forest">{c.name}</h3>
              <p className="mt-1.5 font-mono text-sm font-bold tracking-wide text-harvest-dark">{c.no}</p>
              <p className="mt-3 text-sm leading-relaxed text-forest/65">{c.desc}</p>
            </div>
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
