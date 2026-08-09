import { useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/context/StoreContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import QuoteModal from "@/components/QuoteModal";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import CategoryPage from "@/pages/CategoryPage";
import About from "@/pages/About";
import ExportMarkets from "@/pages/ExportMarkets";
import Certifications from "@/pages/Certifications";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";

function SmoothScroll() {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <SmoothScroll />
        <div className="min-h-screen bg-bone-warm text-forest font-sans">
          <div className="grain-overlay" aria-hidden="true" />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/rice" element={<CategoryPage category="rice" />} />
              <Route path="/bagasse-products" element={<CategoryPage category="bagasse" />} />
              <Route path="/foxnut-makhana" element={<CategoryPage category="makhana" />} />
              <Route path="/about" element={<About />} />
              <Route path="/export-markets" element={<ExportMarkets />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
          <CartDrawer />
          <WishlistDrawer />
          <QuoteModal />
          <Toaster position="top-center" richColors />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
