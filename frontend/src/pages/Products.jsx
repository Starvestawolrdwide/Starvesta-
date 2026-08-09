import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useStore, API } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

const CATS = ["all", "rice", "bagasse", "makhana", "papercups"];

export default function Products() {
  const { t } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (q) params.set("q", q);
    axios.get(`${API}/products?${params.toString()}`)
      .then((r) => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [cat, q]);

  const catLabel = useMemo(() => ({ all: t("all"), rice: t("rice"), bagasse: t("bagasse"), makhana: t("makhana"), papercups: t("papercups") }), [t]);

  return (
    <div data-testid="products-page" className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">Starvesta Worldwide</p>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-forest md:text-6xl">{t("products")}</h1>
      </motion.div>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" data-testid="category-filters">
          {CATS.map((c) => (
            <button
              key={c}
              data-testid={`filter-${c}`}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                cat === c ? "bg-forest text-bone" : "border border-forest/20 text-forest hover:border-harvest hover:text-harvest"
              }`}
            >
              {catLabel[c]}
            </button>
          ))}
        </div>
        <div className="relative md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
          <input
            data-testid="product-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-forest/20 bg-white py-3 pl-11 pr-4 text-sm text-forest outline-none transition-colors placeholder:text-forest/40 focus:border-harvest"
          />
        </div>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-forest/50" data-testid="results-count">
        {products.length} {t("results")}
      </p>

      {loading ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-forest/5" />)}
        </div>
      ) : products.length === 0 ? (
        <p data-testid="no-results" className="mt-16 text-center text-forest/60">{t("noResults")}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="products-grid">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
