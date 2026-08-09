import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { X, ShoppingBasket } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, API } from "@/context/StoreContext";

const INCOTERMS = ["EXW", "FOB", "CIF", "CFR", "DAP", "DDP"];

export default function CartDrawer() {
  const { cart, removeFromCart, clearCart, cartOpen, setCartOpen, t } = useStore();
  const [form, setForm] = useState({ name: "", email: "", company: "", country: "", incoterm: "FOB", destination: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/enquiries`, {
        type: "bulk_rfq",
        items: cart.map((i) => ({ id: i.id, name: i.name, category: i.category })),
        ...form,
      });
      toast.success(t("successEnquiry"));
      clearCart();
      setCartOpen(false);
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent data-testid="cart-drawer" className="w-full overflow-y-auto border-l-forest/15 bg-bone-warm sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif text-2xl text-forest">
            <ShoppingBasket size={20} className="text-harvest" /> {t("basket")} ({cart.length})
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-forest/60">{t("emptyBasket")}</p>
            <Link
              data-testid="basket-browse-link"
              to="/products"
              onClick={() => setCartOpen(false)}
              className="mt-4 inline-block rounded-full bg-forest px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:bg-harvest"
            >
              {t("browseProducts")}
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-3">
              {cart.map((item) => (
                <li key={item.id} data-testid={`basket-item-${item.id}`} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-white p-3">
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${item.id}`} onClick={() => setCartOpen(false)} className="block truncate font-serif text-base font-semibold text-forest hover:text-harvest">
                      {item.name}
                    </Link>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-forest/50">{t("moq")}: {item.moq}</span>
                  </div>
                  <button data-testid={`basket-remove-${item.id}`} onClick={() => removeFromCart(item.id)} aria-label={t("remove")} className="rounded-full p-1.5 text-forest/40 transition-colors hover:bg-red-50 hover:text-red-600">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={submit} className="mt-6 space-y-3" data-testid="basket-quote-form">
              <p className="font-serif text-lg font-semibold text-forest">{t("quoteForBasket")}</p>
              <Input data-testid="basket-name" required placeholder={t("name")} value={form.name} onChange={set("name")} className="border-forest/20 bg-white" />
              <Input data-testid="basket-email" required type="email" placeholder={t("email")} value={form.email} onChange={set("email")} className="border-forest/20 bg-white" />
              <div className="grid grid-cols-2 gap-3">
                <Input data-testid="basket-company" placeholder={t("company")} value={form.company} onChange={set("company")} className="border-forest/20 bg-white" />
                <Input data-testid="basket-country" required placeholder={t("country")} value={form.country} onChange={set("country")} className="border-forest/20 bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.incoterm} onValueChange={set("incoterm")}>
                  <SelectTrigger data-testid="basket-incoterm" className="border-forest/20 bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>{INCOTERMS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
                <Input data-testid="basket-destination" placeholder={t("destination")} value={form.destination} onChange={set("destination")} className="border-forest/20 bg-white" />
              </div>
              <Textarea data-testid="basket-message" placeholder={t("message")} rows={2} value={form.message} onChange={set("message")} className="border-forest/20 bg-white" />
              <button
                data-testid="basket-submit"
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-harvest px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark disabled:opacity-60"
              >
                {sending ? "..." : t("submitRequest")}
              </button>
            </form>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
