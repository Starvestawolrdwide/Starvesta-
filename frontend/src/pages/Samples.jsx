import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Minus, Plus, CreditCard, ShieldCheck, Truck, PackageCheck } from "lucide-react";
import { useStore, API } from "@/context/StoreContext";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

function KitCard({ kit, index }) {
  const { currency, t } = useStore();
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);
  const isINR = currency === "INR";
  const price = isINR ? kit.inr : kit.usd;
  const fmt = (v) =>
    isINR ? `₹${v.toLocaleString("en-IN")}` : `$${v.toFixed(0)}`;

  const buy = async () => {
    setBuying(true);
    try {
      const r = await axios.post(`${API}/samples/checkout`, {
        sample_id: kit.id,
        quantity: qty,
        currency: isINR ? "inr" : "usd",
        origin_url: window.location.origin,
      });
      window.location.href = r.data.checkout_url;
    } catch {
      toast.error("Checkout failed. Please try WhatsApp.");
      setBuying(false);
    }
  };

  return (
    <motion.article
      {...fade((index % 2) * 0.1)}
      data-testid={`sample-kit-${kit.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={kit.image} alt={kit.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-harvest px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Sample Kit
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl font-semibold text-forest">{kit.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-forest/65">{kit.tagline}</p>
        <ul className="mt-4 space-y-1.5">
          {kit.contents.map((c) => (
            <li key={c} className="flex items-center gap-2 text-xs text-forest/70">
              <PackageCheck size={13} className="shrink-0 text-harvest" /> {c}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">Price {isINR ? "(INR)" : "(USD)"}</p>
              <p data-testid={`sample-price-${kit.id}`} className="font-serif text-3xl font-semibold text-forest">{fmt(price)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-forest/15 px-2 py-1">
              <button data-testid={`qty-minus-${kit.id}`} onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-1 text-forest/60 hover:text-forest" aria-label="Decrease quantity"><Minus size={14} /></button>
              <span data-testid={`qty-value-${kit.id}`} className="w-6 text-center text-sm font-bold">{qty}</span>
              <button data-testid={`qty-plus-${kit.id}`} onClick={() => setQty((q) => Math.min(20, q + 1))} className="p-1 text-forest/60 hover:text-forest" aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
          </div>
          <button
            data-testid={`buy-sample-${kit.id}`}
            onClick={buy}
            disabled={buying}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-harvest px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark disabled:opacity-60"
          >
            <CreditCard size={16} /> {buying ? "Redirecting..." : `${t("buyNow")} — ${fmt(price * qty)}`}
          </button>
          <p className="mt-2.5 text-center text-[11px] text-forest/45">Secure card payment · Worldwide courier included</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Samples() {
  const { t } = useStore();
  const [kits, setKits] = useState([]);

  useEffect(() => {
    axios.get(`${API}/samples`).then((r) => setKits(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="samples-page" className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <motion.p {...fade()} className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("sampleStore")}</motion.p>
      <motion.h1 {...fade(0.1)} className="max-w-3xl font-serif text-5xl font-medium tracking-tight text-forest md:text-6xl">
        {t("samplesTitle")}
      </motion.h1>
      <motion.p {...fade(0.2)} className="mt-5 max-w-2xl leading-relaxed text-forest/70">
        {t("samplesSub")}
      </motion.p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {kits.map((k, i) => <KitCard key={k.id} kit={k} index={i} />)}
      </div>

      <motion.div {...fade(0.2)} className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-forest/10 bg-forest/10 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Secure Payment", text: "Card payments processed by Stripe. We never see your card details." },
          { icon: Truck, title: "Courier Included", text: "DHL / FedEx express courier to your door is included in the price." },
          { icon: CreditCard, title: "Credited on Bulk Order", text: "Sample cost is adjusted against your first container order." },
        ].map((f) => (
          <div key={f.title} className="bg-white p-7">
            <f.icon size={22} className="text-harvest" />
            <h3 className="mt-3 font-serif text-xl font-semibold text-forest">{f.title}</h3>
            <p className="mt-2 text-sm text-forest/65">{f.text}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
