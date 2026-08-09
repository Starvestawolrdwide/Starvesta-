import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../data/translations";

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const read = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const COMPANY = {
  name: "Starvesta Worldwide Pvt. Ltd.",
  address: "Ward No. 16, Pauhari Maharaj Nagar, Gaji Ruja, New Colony, Barhalganj, Gorakhpur, Uttar Pradesh – 273402, India",
  phones: ["+91 9214315956", "+91 7706005679"],
  whatsapp: "919214315956",
  email: "starvestaworldwide@gmail.com",
  contacts: ["Mr. Suraj Panday", "Mr. Prajapati Raviprakash Ramsuresh"],
};

export const whatsappLink = (text) =>
  `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`;

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => read("sw_cart", []));
  const [wishlist, setWishlist] = useState(() => read("sw_wishlist", []));
  const [lang, setLang] = useState(() => read("sw_lang", "en"));
  const [currency, setCurrency] = useState(() => read("sw_currency", "USD"));
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(null);

  useEffect(() => { localStorage.setItem("sw_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("sw_wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("sw_lang", JSON.stringify(lang)); }, [lang]);
  useEffect(() => { localStorage.setItem("sw_currency", JSON.stringify(currency)); }, [currency]);

  const addToCart = (p) =>
    setCart((c) => (c.find((i) => i.id === p.id) ? c : [...c, { id: p.id, name: p.name, image: p.image, category: p.category, moq: p.moq }]));
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);
  const toggleWishlist = (p) =>
    setWishlist((w) =>
      w.find((i) => i.id === p.id)
        ? w.filter((i) => i.id !== p.id)
        : [...w, { id: p.id, name: p.name, image: p.image, category: p.category }]
    );

  const value = useMemo(
    () => ({
      cart, addToCart, removeFromCart, clearCart,
      wishlist, toggleWishlist,
      lang, setLang, currency, setCurrency,
      cartOpen, setCartOpen, wishlistOpen, setWishlistOpen,
      quoteProduct, setQuoteProduct,
      t: (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    }),
    [cart, wishlist, lang, currency, cartOpen, wishlistOpen, quoteProduct]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
