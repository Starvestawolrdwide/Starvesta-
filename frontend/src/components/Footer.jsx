import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useStore, COMPANY } from "@/context/StoreContext";

export default function Footer() {
  const { t } = useStore();
  return (
    <footer data-testid="site-footer" className="bg-forest-deep text-bone">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 md:px-10">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img src="/logo.png" alt="Starvesta Worldwide logo" className="h-12 w-12 rounded-full bg-white object-contain p-0.5 ring-2 ring-harvest/60" />
            <span className="leading-none">
              <span className="flex items-center gap-2">
                <span className="whitespace-nowrap font-serif text-[26px] font-bold tracking-[0.06em]">STARVESTA</span>
                <svg viewBox="0 0 40 24" fill="none" className="h-4 w-7 text-harvest" aria-hidden="true">
                  <path d="M2 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
                  <path d="M28 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
                  <path d="M20 4l2.2 4.4L27 9l-3.5 3 .8 4.6L20 14l-4.3 2.6.8-4.6L13 9l4.8-.6L20 4z" fill="currentColor" />
                  <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.7" />
                  <circle cx="25" cy="12" r="1" fill="currentColor" opacity="0.7" />
                </svg>
              </span>
              <span className="mt-1 block whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.3em] text-harvest">Worldwide Pvt. Ltd.</span>
            </span>
          </div>
          <p className="font-serif text-lg italic text-bone/70">{t("footerTagline")}</p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-harvest">{t("products")}</h4>
          <ul className="space-y-2.5 text-sm text-bone/75">
            <li><Link data-testid="footer-rice" className="transition-colors hover:text-harvest" to="/rice">{t("rice")}</Link></li>
            <li><Link data-testid="footer-bagasse" className="transition-colors hover:text-harvest" to="/bagasse-products">{t("bagasse")}</Link></li>
            <li><Link data-testid="footer-makhana" className="transition-colors hover:text-harvest" to="/foxnut-makhana">{t("makhana")}</Link></li>
            <li><Link data-testid="footer-papercups" className="transition-colors hover:text-harvest" to="/paper-cups">{t("papercups")}</Link></li>
            <li><Link data-testid="footer-all-products" className="transition-colors hover:text-harvest" to="/products">{t("products")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-harvest">{t("about")}</h4>
          <ul className="space-y-2.5 text-sm text-bone/75">
            <li><Link data-testid="footer-about" className="transition-colors hover:text-harvest" to="/about">{t("about")}</Link></li>
            <li><Link data-testid="footer-markets" className="transition-colors hover:text-harvest" to="/export-markets">{t("markets")}</Link></li>
            <li><Link data-testid="footer-certs" className="transition-colors hover:text-harvest" to="/certifications">{t("certifications")}</Link></li>
            <li><Link data-testid="footer-register" className="transition-colors hover:text-harvest" to="/register">{t("register")}</Link></li>
            <li><Link data-testid="footer-samples" className="transition-colors hover:text-harvest" to="/samples">{t("sampleStore")}</Link></li>
          </ul>
          <h4 className="mb-3 mt-6 text-xs font-bold uppercase tracking-[0.25em] text-harvest">{t("businessProfiles")}</h4>
          <ul className="space-y-2.5 text-sm text-bone/75">
            <li><span className="inline-flex items-center gap-1.5">ExportersIndia <ExternalLink size={12} /></span></li>
            <li><span className="inline-flex items-center gap-1.5">IndianYellowPages <ExternalLink size={12} /></span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-harvest">{t("contact")}</h4>
          <ul className="space-y-3 text-sm text-bone/75">
            <li className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 shrink-0 text-harvest" />{COMPANY.phones.join("  |  ")}</li>
            <li className="flex items-start gap-2.5"><Mail size={15} className="mt-0.5 shrink-0 text-harvest" />{COMPANY.email}</li>
            <li className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0 text-harvest" />{COMPANY.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10 py-6 text-center text-xs tracking-wide text-bone/50">
        © {new Date().getFullYear()} {COMPANY.name} — {t("rights")}
      </div>
    </footer>
  );
}
