import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div data-testid="payment-cancel-page" className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <XCircle size={52} className="text-harvest" />
      <h1 className="mt-6 font-serif text-4xl font-medium text-forest">Payment Cancelled</h1>
      <p className="mt-3 text-forest/60">
        No amount was charged. You can try again anytime, or request a quote for bulk orders instead.
      </p>
      <div className="mt-8 flex gap-4">
        <Link data-testid="cancel-retry-btn" to="/samples" className="rounded-full bg-harvest px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark">
          Back to Sample Store
        </Link>
        <Link data-testid="cancel-home-btn" to="/" className="rounded-full border border-forest/25 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-forest transition-colors hover:bg-forest hover:text-bone">
          Home
        </Link>
      </div>
    </div>
  );
}
