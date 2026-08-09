import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, API, COMPANY, whatsappLink } from "@/context/StoreContext";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Contact() {
  const { t } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", country: "", interest: "Rice", message: "" });
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/enquiries`, { type: "contact", product_name: form.interest, ...form });
      toast.success(t("successEnquiry"));
      setForm({ name: "", email: "", phone: "", company: "", country: "", interest: "Rice", message: "" });
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="contact-page" className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
      <motion.p {...fade()} className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-harvest">{t("contact")}</motion.p>
      <motion.h1 {...fade(0.1)} className="font-serif text-5xl font-medium tracking-tight text-forest md:text-6xl">
        {t("contactTitle")}
      </motion.h1>
      <motion.p {...fade(0.2)} className="mt-4 max-w-xl text-forest/70">{t("contactSub")}</motion.p>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <motion.div {...fade(0.15)} className="space-y-4">
          <div className="rounded-2xl bg-forest p-8 text-bone">
            <Users size={22} className="text-harvest" />
            <h3 className="mt-3 font-serif text-2xl font-semibold">{t("contact")}</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-harvest" />
                <span>{COMPANY.phones.join("  |  ")}<br /><span className="text-bone/60">{COMPANY.contacts.join(" & ")}</span></span>
              </li>
              <li className="flex items-start gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-harvest" />{COMPANY.email}</li>
              <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-harvest" />{COMPANY.address}</li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a data-testid="contact-whatsapp-btn" href={whatsappLink("Hello Starvesta Worldwide, I have an export enquiry.")} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5">
                <MessageCircle size={15} /> {t("whatsappNow")}
              </a>
              <a data-testid="contact-email-btn" href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-6 py-3 text-xs font-bold uppercase tracking-wider text-bone transition-all hover:-translate-y-0.5 hover:border-harvest hover:text-harvest">
                <Mail size={15} /> Email
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-forest/10">
              <iframe
                data-testid="contact-map"
                title="Starvesta location — Barhalganj, Gorakhpur"
                src="https://www.google.com/maps?q=Barhalganj,+Gorakhpur,+Uttar+Pradesh+273402,+India&output=embed"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-forest/10 bg-white p-6 text-center">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-forest/50">Scan to WhatsApp</p>
              <img
                data-testid="contact-qr"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappLink("Hello Starvesta Worldwide, I have an export enquiry."))}`}
                alt="WhatsApp QR code"
                className="h-40 w-40 rounded-lg border border-forest/10"
              />
              <p className="mt-3 text-xs font-semibold text-forest/70">+91 9214315956</p>
            </div>
          </div>
        </motion.div>

        <motion.form {...fade(0.25)} onSubmit={submit} data-testid="contact-form"
          className="h-fit space-y-4 rounded-2xl border border-forest/10 bg-white p-8">
          <h3 className="font-serif text-2xl font-semibold text-forest">{t("sendEnquiry")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input data-testid="contact-name" required placeholder={t("name")} value={form.name} onChange={set("name")} className="border-forest/20" />
            <Input data-testid="contact-email" required type="email" placeholder={t("email")} value={form.email} onChange={set("email")} className="border-forest/20" />
            <Input data-testid="contact-phone" placeholder={t("phone")} value={form.phone} onChange={set("phone")} className="border-forest/20" />
            <Input data-testid="contact-company" placeholder={t("company")} value={form.company} onChange={set("company")} className="border-forest/20" />
            <Input data-testid="contact-country" required placeholder={t("country")} value={form.country} onChange={set("country")} className="border-forest/20" />
            <Select value={form.interest} onValueChange={set("interest")}>
              <SelectTrigger data-testid="contact-interest" className="border-forest/20"><SelectValue placeholder={t("productInterest")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Rice">{t("rice")}</SelectItem>
                <SelectItem value="Bagasse Products">{t("bagasse")}</SelectItem>
                <SelectItem value="Foxnut / Makhana">{t("makhana")}</SelectItem>
                <SelectItem value="Multiple / Other">Multiple / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea data-testid="contact-message" placeholder={t("message")} rows={4} value={form.message} onChange={set("message")} className="border-forest/20" />
          <button data-testid="contact-submit" type="submit" disabled={sending}
            className="w-full rounded-full bg-harvest px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark disabled:opacity-60">
            {sending ? "..." : t("submitEnquiry")}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
