import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/context/StoreContext";

export default function WhatsAppFloat() {
  return (
    <motion.a
      data-testid="whatsapp-float"
      href={whatsappLink("Hello Starvesta Worldwide, I have an export enquiry.")}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" style={{ animationDuration: "2.4s" }} />
    </motion.a>
  );
}
