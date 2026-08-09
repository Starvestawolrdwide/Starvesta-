import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useStore, API } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

const CONFIG = {
  rice: {
    title: "Rice",
    subtitle: "Chapter 01 — The Grain",
    description: "From the world's longest 1121 Basmati to high-volume IR64 and industrial Broken Rice — milled, sorted and aged to export specification in India's finest rice belts.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxiYXNtYXRpJTIwcmljZSUyMGdyYWlucyUyMHByZW1pdW18ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85&w=2000",
  },
  bagasse: {
    title: "Bagasse Products",
    subtitle: "Chapter 02 — The Fibre",
    description: "Eco-friendly, compostable and food-grade tableware pressed from sugarcane bagasse — plates, bowls, trays, containers, cups, meal boxes and clamshells for a plastic-free world.",
    image: "https://images.unsplash.com/photo-1727021024931-90c226e8448d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGJhZ2Fzc2UlMjBwbGF0ZXMlMjBzdWdhcmNhbmV8ZW58MHx8fHwxNzg2MjQ4OTQ1fDA&ixlib=rb-4.1.0&q=85&w=2000",
  },
  makhana: {
    title: "Foxnut / Makhana",
    subtitle: "Chapter 03 — The Pop",
    description: "Hand-popped raw phool makhana — graded 4/5/6 Sutta and 12/15/19 mm, premium Phool and flavoured lines, sorted bright and packed in airtight eco-friendly pouches.",
    image: "/products/mk-19mm.jpg",
  },
  papercups: {
    title: "Disposable Paper Cups",
    subtitle: "Chapter 04 — The Cup",
    description: "Food-grade disposable paper cups from 110 ml to 710 ml — single wall, double wall, plain and custom printed, packed for high-volume beverage service.",
    image: "/products/cup-printed.jpg",
  },
};

export default function CategoryPage({ category }) {
  const { t } = useStore();
  const cfg = CONFIG[category];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products?category=${category}`)
      .then((r) => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div data-testid={`category-page-${category}`}>
      <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-forest-deep">
        <img src={cfg.image} alt={cfg.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-forest-deep/20" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-14 pt-32 md:px-10">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">
            {cfg.subtitle}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl font-medium tracking-tight text-bone md:text-7xl"
          >
            {cfg.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-5 max-w-2xl leading-relaxed text-bone/75">
            {cfg.description}
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <p className="mb-8 text-xs font-semibold uppercase tracking-wider text-forest/50">{products.length} {t("results")}</p>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-forest/5" />)}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
