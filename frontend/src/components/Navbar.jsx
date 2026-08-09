import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Heart, Globe, Menu, X, Coins, Wheat } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function Navbar() {
  const { cart, wishlist, lang, setLang, currency, setCurrency, setCartOpen, setWishlistOpen, t } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("home") },
    { to: "/products", label: t("products") },
    { to: "/rice", label: t("rice") },
    { to: "/bagasse-products", label: t("bagasse") },
    { to: "/foxnut-makhana", label: t("makhana") },
    { to: "/about", label: t("about") },
    { to: "/export-markets", label: t("markets") },
    { to: "/certifications", label: t("certifications") },
    { to: "/contact", label: t("contact") },
  ];

  const navCls = ({ isActive }) =>
    `text-[13px] font-semibold tracking-wide transition-colors hover:text-harvest ${isActive ? "text-harvest" : "text-bone/90"}`;

  return (
    <header data-testid="main-navbar" className="sticky top-0 z-50 border-b border-bone/10 bg-forest/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-harvest text-forest">
            <Wheat size={18} strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-xl font-semibold tracking-wide text-bone">STARVESTA</span>
            <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-harvest">Worldwide Pvt. Ltd.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" data-testid="desktop-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navCls} data-testid={`nav-${l.to.replace(/\//g, "") || "home"}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            data-testid="language-toggle"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-bone/20 px-3 py-1.5 text-xs font-bold text-bone transition-colors hover:border-harvest hover:text-harvest"
          >
            <Globe size={14} /> {lang === "en" ? "EN" : "हिं"}
          </button>
          <button
            data-testid="currency-toggle"
            onClick={() => setCurrency(currency === "USD" ? "INR" : "USD")}
            className="hidden items-center gap-1.5 rounded-full border border-bone/20 px-3 py-1.5 text-xs font-bold text-bone transition-colors hover:border-harvest hover:text-harvest sm:flex"
          >
            <Coins size={14} /> {currency}
          </button>
          <button
            data-testid="wishlist-button"
            onClick={() => setWishlistOpen(true)}
            className="relative rounded-full p-2 text-bone transition-colors hover:text-harvest"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span data-testid="wishlist-count" className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-harvest text-[10px] font-bold text-forest">
                {wishlist.length}
              </span>
            )}
          </button>
          <button
            data-testid="cart-button"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full p-2 text-bone transition-colors hover:text-harvest"
            aria-label="Enquiry basket"
          >
            <ShoppingBasket size={19} />
            {cart.length > 0 && (
              <span data-testid="cart-count" className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-harvest text-[10px] font-bold text-forest">
                {cart.length}
              </span>
            )}
          </button>
          <button
            data-testid="mobile-menu-button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-full p-2 text-bone xl:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            data-testid="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-bone/10 bg-forest xl:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <button
                  key={l.to}
                  data-testid={`mobile-nav-${l.to.replace(/\//g, "") || "home"}`}
                  onClick={() => { setMobileOpen(false); navigate(l.to); }}
                  className="py-2.5 text-left font-serif text-lg text-bone transition-colors hover:text-harvest"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
