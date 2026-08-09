import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/context/StoreContext";

export default function WishlistDrawer() {
  const { wishlist, toggleWishlist, wishlistOpen, setWishlistOpen, t } = useStore();

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent data-testid="wishlist-drawer" className="w-full overflow-y-auto border-l-forest/15 bg-bone-warm sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif text-2xl text-forest">
            <Heart size={20} className="text-harvest" /> {t("wishlist")} ({wishlist.length})
          </SheetTitle>
        </SheetHeader>
        {wishlist.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-forest/60">{t("emptyWishlist")}</p>
            <Link
              data-testid="wishlist-browse-link"
              to="/products"
              onClick={() => setWishlistOpen(false)}
              className="mt-4 inline-block rounded-full bg-forest px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:bg-harvest"
            >
              {t("browseProducts")}
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {wishlist.map((item) => (
              <li key={item.id} data-testid={`wishlist-item-${item.id}`} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-white p-3">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                <Link to={`/products/${item.id}`} onClick={() => setWishlistOpen(false)} className="min-w-0 flex-1 truncate font-serif text-base font-semibold text-forest hover:text-harvest">
                  {item.name}
                </Link>
                <button data-testid={`wishlist-remove-${item.id}`} onClick={() => toggleWishlist(item)} aria-label={t("remove")} className="rounded-full p-1.5 text-forest/40 transition-colors hover:bg-red-50 hover:text-red-600">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}
