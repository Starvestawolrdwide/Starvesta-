import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBasket, MessageCircle, Package, BadgeCheck, MapPin, Hash } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore, API, whatsappLink } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, setQuoteProduct, t } = useStore();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    axios.get(`${API}/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        axios.get(`${API}/products?category=${r.data.category}`).then((rr) =>
          setRelated(rr.data.filter((x) => x.id !== id).slice(0, 3))
        );
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound)
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center" data-testid="product-not-found">
        <h1 className="font-serif text-4xl text-forest">Product not found</h1>
        <Link to="/products" className="mt-6 inline-block text-sm font-bold uppercase tracking-wider text-harvest">{t("backToProducts")}</Link>
      </div>
    );

  if (!product)
    return <div className="mx-auto max-w-[1400px] px-6 py-24"><div className="h-[60vh] animate-pulse rounded-2xl bg-forest/5" /></div>;

  return (
    <div data-testid="product-detail-page" className="mx-auto max-w-[1400px] px-6 py-12 md:px-10">
      <Link data-testid="back-to-products" to="/products" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest/60 transition-colors hover:text-harvest">
        <ArrowLeft size={14} /> {t("backToProducts")}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] border border-forest/10">
            <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-bone">
                <BadgeCheck size={13} className="text-harvest" /> {b}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-harvest">{product.category}</p>
          <h1 data-testid="product-title" className="mt-2 font-serif text-4xl font-semibold tracking-tight text-forest md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-forest/70">{product.tagline}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-forest/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">{t("moq")}</p>
              <p data-testid="product-moq" className="mt-1 font-serif text-lg font-semibold text-forest">{product.moq}</p>
            </div>
            <div className="rounded-xl border border-forest/10 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">{t("availability")}</p>
              <p className="mt-1 font-serif text-lg font-semibold text-forest">{product.availability}</p>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-forest/10 bg-white p-4">
              <MapPin size={16} className="text-harvest" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">{t("origin")}</p>
                <p className="text-sm font-semibold text-forest">{product.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-forest/10 bg-white p-4">
              <Hash size={16} className="text-harvest" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45">{t("hsn")}</p>
                <p data-testid="product-hsn" className="text-sm font-semibold text-forest">{product.hsn}</p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              data-testid="detail-quote-btn"
              onClick={() => setQuoteProduct(product)}
              className="rounded-full bg-harvest px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-1 hover:bg-harvest-dark"
            >
              {t("getBestPrice")}
            </button>
            <button
              data-testid="detail-basket-btn"
              onClick={() => { addToCart(product); toast.success(t("addedToBasket")); }}
              className="inline-flex items-center gap-2 rounded-full border border-forest/25 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-forest transition-all hover:-translate-y-1 hover:bg-forest hover:text-bone"
            >
              <ShoppingBasket size={16} /> {t("addToBasket")}
            </button>
            <a
              data-testid="detail-whatsapp-btn"
              href={whatsappLink(`Hello Starvesta, I am interested in: ${product.name} (MOQ: ${product.moq}). Please share your best export price.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-1 hover:brightness-95"
            >
              <MessageCircle size={16} /> {t("whatsappNow")}
            </a>
          </div>

          <Tabs defaultValue="specs" className="mt-10" data-testid="product-tabs">
            <TabsList className="w-full justify-start rounded-full border border-forest/15 bg-white p-1">
              <TabsTrigger data-testid="tab-specs" value="specs" className="rounded-full data-[state=active]:bg-forest data-[state=active]:text-bone">{t("specifications")}</TabsTrigger>
              <TabsTrigger data-testid="tab-packaging" value="packaging" className="rounded-full data-[state=active]:bg-forest data-[state=active]:text-bone">{t("packaging")}</TabsTrigger>
              <TabsTrigger data-testid="tab-trade" value="trade" className="rounded-full data-[state=active]:bg-forest data-[state=active]:text-bone">{t("tradeInfo")}</TabsTrigger>
            </TabsList>
            <TabsContent value="specs" className="mt-5 overflow-hidden rounded-xl border border-forest/10 bg-white">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <tr key={k} className={i % 2 ? "bg-bone/60" : ""}>
                      <td className="px-5 py-3.5 font-semibold text-forest/70">{k}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-forest">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="packaging" className="mt-5 rounded-xl border border-forest/10 bg-white p-6">
              <ul className="space-y-3">
                {product.packaging.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-forest/80">
                    <Package size={15} className="shrink-0 text-harvest" /> {p}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="trade" className="mt-5 rounded-xl border border-forest/10 bg-white p-6">
              <ul className="space-y-3 text-sm text-forest/80">
                <li className="flex justify-between"><span className="font-semibold">{t("hsn")}</span><span>{product.hsn}</span></li>
                <li className="flex justify-between"><span className="font-semibold">{t("moq")}</span><span>{product.moq}</span></li>
                <li className="flex justify-between"><span className="font-semibold">{t("origin")}</span><span>{product.origin}</span></li>
                <li className="flex justify-between"><span className="font-semibold">Incoterms</span><span>EXW / FOB / CIF / DAP / DDP</span></li>
                <li className="flex justify-between"><span className="font-semibold">Payment</span><span>TT / LC (as per contract)</span></li>
                <li className="flex justify-between"><span className="font-semibold">Lead Time</span><span>7–21 days by product</span></li>
                <li className="flex justify-between"><span className="font-semibold">Samples</span><span>Paid samples, worldwide courier</span></li>
                <li className="flex justify-between"><span className="font-semibold">Quotes in</span><span>USD / INR</span></li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {product.certifications.map((c) => (
                  <span key={c} className="rounded-full bg-harvest/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-harvest-dark">{c}</span>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" data-testid="related-products">
          <h2 className="mb-8 font-serif text-3xl font-medium text-forest md:text-4xl">{t("relatedProducts")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
