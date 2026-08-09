import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, API } from "@/context/StoreContext";

export default function Register() {
  const { t } = useStore();
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", country: "", interest: "Rice", volume: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/buyers`, form);
      toast.success(t("successBuyer"));
      setDone(true);
    } catch {
      toast.error("Something went wrong. Please try WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="register-page" className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-harvest">
          <UserPlus size={24} />
        </span>
        <h1 className="mt-5 font-serif text-5xl font-medium tracking-tight text-forest">{t("register")}</h1>
        <p className="mx-auto mt-4 max-w-lg text-forest/70">
          Join our verified buyer network to receive the full export catalogue, seasonal price lists and priority allocation on premium lots.
        </p>
      </motion.div>

      {done ? (
        <motion.div data-testid="register-success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-12 rounded-2xl bg-forest p-10 text-center text-bone">
          <h2 className="font-serif text-3xl font-medium">{t("successBuyer")}</h2>
          <p className="mt-3 text-bone/70">Registered as {form.email}</p>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          onSubmit={submit} data-testid="register-form"
          className="mt-12 space-y-4 rounded-2xl border border-forest/10 bg-white p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input data-testid="register-name" required placeholder={t("name")} value={form.name} onChange={set("name")} className="border-forest/20" />
            <Input data-testid="register-email" required type="email" placeholder={t("email")} value={form.email} onChange={set("email")} className="border-forest/20" />
            <Input data-testid="register-company" placeholder={t("company")} value={form.company} onChange={set("company")} className="border-forest/20" />
            <Input data-testid="register-phone" placeholder={t("phone")} value={form.phone} onChange={set("phone")} className="border-forest/20" />
            <Input data-testid="register-country" required placeholder={t("country")} value={form.country} onChange={set("country")} className="border-forest/20" />
            <Select value={form.interest} onValueChange={set("interest")}>
              <SelectTrigger data-testid="register-interest" className="border-forest/20"><SelectValue placeholder={t("productInterest")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Rice">{t("rice")}</SelectItem>
                <SelectItem value="Bagasse Products">{t("bagasse")}</SelectItem>
                <SelectItem value="Foxnut / Makhana">{t("makhana")}</SelectItem>
                <SelectItem value="All Product Lines">All Product Lines</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input data-testid="register-volume" placeholder={`${t("volume")} (e.g. 2 containers / month)`} value={form.volume} onChange={set("volume")} className="border-forest/20" />
          <Textarea data-testid="register-message" placeholder={t("message")} rows={3} value={form.message} onChange={set("message")} className="border-forest/20" />
          <button data-testid="register-submit" type="submit" disabled={sending}
            className="w-full rounded-full bg-harvest px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark disabled:opacity-60">
            {sending ? "..." : t("register")}
          </button>
        </motion.form>
      )}
    </div>
  );
}
