import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, API } from "@/context/StoreContext";

const INCOTERMS = ["EXW", "FOB", "CIF", "CFR", "DAP", "DDP"];
const empty = { name: "", email: "", company: "", country: "", quantity: "", incoterm: "FOB", destination: "", message: "" };

export default function QuoteModal() {
  const { quoteProduct, setQuoteProduct, t } = useStore();
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);

  useEffect(() => { if (quoteProduct) setForm(empty); }, [quoteProduct]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/enquiries`, {
        type: "rfq",
        product_id: quoteProduct.id,
        product_name: quoteProduct.name,
        ...form,
      });
      toast.success(t("successEnquiry"));
      setQuoteProduct(null);
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={!!quoteProduct} onOpenChange={(o) => !o && setQuoteProduct(null)}>
      <DialogContent data-testid="quote-modal" className="max-h-[90vh] overflow-y-auto border-forest/15 bg-bone-warm sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-forest">{t("requestQuote")}</DialogTitle>
          <DialogDescription className="text-forest/60">
            {quoteProduct?.name} — {t("moq")}: {quoteProduct?.moq}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="quote-form">
          <Input data-testid="quote-name" required placeholder={t("name")} value={form.name} onChange={set("name")} className="border-forest/20 bg-white" />
          <Input data-testid="quote-email" required type="email" placeholder={t("email")} value={form.email} onChange={set("email")} className="border-forest/20 bg-white" />
          <Input data-testid="quote-company" placeholder={t("company")} value={form.company} onChange={set("company")} className="border-forest/20 bg-white" />
          <Input data-testid="quote-country" required placeholder={t("country")} value={form.country} onChange={set("country")} className="border-forest/20 bg-white" />
          <Input data-testid="quote-quantity" placeholder={`${t("quantity")} (e.g. 25 MT)`} value={form.quantity} onChange={set("quantity")} className="border-forest/20 bg-white" />
          <Select value={form.incoterm} onValueChange={set("incoterm")}>
            <SelectTrigger data-testid="quote-incoterm" className="border-forest/20 bg-white"><SelectValue placeholder={t("incoterm")} /></SelectTrigger>
            <SelectContent>
              {INCOTERMS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input data-testid="quote-destination" placeholder={t("destination")} value={form.destination} onChange={set("destination")} className="border-forest/20 bg-white sm:col-span-2" />
          <Textarea data-testid="quote-message" placeholder={t("message")} value={form.message} onChange={set("message")} rows={3} className="border-forest/20 bg-white sm:col-span-2" />
          <button
            data-testid="quote-submit"
            type="submit"
            disabled={sending}
            className="rounded-full bg-harvest px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark disabled:opacity-60 sm:col-span-2"
          >
            {sending ? "..." : t("submitRequest")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
