import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";

const CAT_LABEL = { rice: "Rice", bagasse: "Bagasse", makhana: "Makhana" };

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, wishlist, setQuoteProduct, t } = useStore();
  const wished = wishlist.some((i) => i.id === product.id);

  return (
    <motion.article
      data-testid={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-forest/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-bone backdrop-blur">
          {CAT_LABEL[product.category]}
        </span>
        <button
          data-testid={`wishlist-toggle-${product.id}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Toggle wishlist"
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors ${
            wished ? "bg-harvest text-white" : "bg-bone/80 text-forest hover:bg-harvest hover:text-white"
          }`}
        >
          <Heart size={16} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold leading-snug text-forest">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-forest/65">{product.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(product.badges || []).slice(0, 2).map((b) => (
            <span key={b} className="rounded-full bg-harvest/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-harvest-dark">
              {b}
            </span>
          ))}
        </div>
        <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-forest/50">
          {t("moq")}: <span className="text-forest/80">{product.moq}</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <button
            data-testid={`get-quote-${product.id}`}
            onClick={() => setQuoteProduct(product)}
            className="flex-1 rounded-full bg-harvest px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark"
          >
            {t("getBestPrice")}
          </button>
          <button
            data-testid={`add-to-basket-${product.id}`}
            onClick={() => { addToCart(product); toast.success(t("addedToBasket")); }}
            aria-label="Add to enquiry basket"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest transition-all hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-bone"
          >
            <ShoppingBasket size={16} />
          </button>
          <Link
            data-testid={`view-details-${product.id}`}
            to={`/products/${product.id}`}
            aria-label="View details"
            className="flex h-10 items-center rounded-full border border-forest/20 px-4 text-xs font-bold uppercase tracking-wider text-forest transition-all hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-bone"
          >
            {t("viewDetails")}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
