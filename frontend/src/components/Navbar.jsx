import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBasket, Heart, Globe, Menu, X, Coins } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const LogoOrnament = ({ className = "" }) => (
  <svg viewBox="0 0 40 24" fill="none" className={className} aria-hidden="true">
    <path d="M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    <path d="M28 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    <path d="M20 4l2.2 4.4L27 9l-3.5 3 .8 4.6L20 14l-4.3 2.6.8-4.6L13 9l4.8-.6L20 4z" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.7" />
    <circle cx="25" cy="12" r="1" fill="currentColor" opacity="0.7" />
  </svg>
);

export default function Navbar() {
  const { cart, wishlist, lang, setLang, currency, setCurrency, setCartOpen, setWishlistOpen, t } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("home") },
    { to: "/products", label: t("products") },
    { to: "/samples", label: t("sampleStore") },
    { to: "/rice", label: t("rice") },
    { to: "/bagasse-products", label: t("bagasse") },
    { to: "/foxnut-makhana", label: t("makhana") },
    { to: "/paper-cups", label: t("papercups") },
    { to: "/about", label: t("about") },
    { to: "/export-markets", label: t("markets") },
    { to: "/certifications", label: t("certifications") },
    { to: "/contact", label: t("contact") },
  ];

  const navCls = ({ isActive }) =>
    `whitespace-nowrap text-xs font-semibold tracking-wide transition-colors hover:text-harvest ${isActive ? "text-harvest" : "text-bone/90"}`;

  return (
    <header data-testid="main-navbar" className="sticky top-0 z-50 border-b border-bone/10 bg-forest/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8">
        <Link to="/" data-testid="logo-link" className="flex shrink-0 items-center gap-3">
          <img src="/logo.png" alt="Starvesta Worldwide logo" className="h-11 w-11 rounded-full bg-white object-contain p-0.5 ring-2 ring-harvest/60" />
          <span className="hidden leading-none sm:block">
            <span className="flex items-center gap-2">
              <span className="whitespace-nowrap font-serif text-[22px] font-bold tracking-[0.06em] text-bone">STARVESTA</span>
              <LogoOrnament className="h-4 w-7 text-harvest" />
            </span>
            <span className="mt-1 block whitespace-nowrap text-[9px] font-extrabold uppercase tracking-[0.3em] text-harvest">Worldwide Pvt. Ltd.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex" data-testid="desktop-nav">
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
