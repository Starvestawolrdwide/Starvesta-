import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { API } from "@/context/StoreContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("checking");
  const tries = useRef(0);

  useEffect(() => {
    if (!sessionId) { setState("error"); return; }
    const poll = async () => {
      try {
        const r = await axios.get(`${API}/samples/status/${sessionId}`);
        setOrder(r.data);
        if (r.data.payment_status === "paid") { setState("paid"); return; }
      } catch { /* keep polling */ }
      tries.current += 1;
      if (tries.current < 12) setTimeout(poll, 2000);
      else setState("pending");
    };
    poll();
  }, [sessionId]);

  return (
    <div data-testid="payment-success-page" className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      {state === "checking" && (
        <>
          <Loader2 size={44} className="animate-spin text-harvest" />
          <h1 className="mt-6 font-serif text-4xl font-medium text-forest">Confirming your payment...</h1>
          <p className="mt-3 text-forest/60">Please wait while we verify with Stripe.</p>
        </>
      )}
      {state === "paid" && order && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle2 size={52} className="mx-auto text-green-600" />
          <h1 className="mt-6 font-serif text-4xl font-medium text-forest">Payment Successful</h1>
          <p className="mt-3 text-forest/65">
            Thank you! Your <strong>{order.sample_name}</strong> (x{order.quantity}) order of{" "}
            <strong>{order.currency === "inr" ? `₹${order.amount.toLocaleString("en-IN")}` : `$${order.amount}`}</strong> is confirmed.
            Our export desk will share the courier tracking within 24 hours.
          </p>
          <p data-testid="order-session" className="mt-2 text-xs text-forest/40">Reference: {order.session_id}</p>
          <Link data-testid="success-home-btn" to="/" className="mt-8 inline-block rounded-full bg-harvest px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-harvest-dark">
            Back to Home
          </Link>
        </motion.div>
      )}
      {(state === "pending" || state === "error") && (
        <>
          <XCircle size={52} className="mx-auto text-harvest" />
          <h1 className="mt-6 font-serif text-4xl font-medium text-forest">
            {state === "pending" ? "Payment is being processed" : "Could not verify payment"}
          </h1>
          <p className="mt-3 text-forest/60">
            If amount was deducted, it will reflect shortly. Contact us on WhatsApp +91 9214315956 with reference {sessionId}.
          </p>
          <Link data-testid="pending-home-btn" to="/" className="mt-8 inline-block rounded-full border border-forest/25 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-forest transition-colors hover:bg-forest hover:text-bone">
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
}
