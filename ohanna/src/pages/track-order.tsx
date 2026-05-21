import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle2, Truck, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { Link } from "wouter";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";

const STATUS_STEPS = [
  { key: "confirmed", labelKey: "ORDER CONFIRMED", icon: CheckCircle2, desc: "Your order has been received and payment confirmed." },
  { key: "processing", labelKey: "PROCESSING", icon: Clock, desc: "Your items are being picked and quality-checked." },
  { key: "shipped", labelKey: "SHIPPED", icon: Truck, desc: "Your order is on its way to you." },
  { key: "delivered", labelKey: "DELIVERED", icon: MapPin, desc: "Your order has been delivered." },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, confirmed: 0, processing: 1, shipped: 2, delivered: 3,
};

export default function TrackOrderPage() {
  const { t } = useLang();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      toast.error("Please enter your order ID and email.");
      return;
    }
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    try {
      const res = await fetch(`${basePath}/api/track-order?id=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setNotFound(true);
      }
    } catch {
      toast.error("Could not look up order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? (STATUS_INDEX[order.status] ?? 0) : 0;

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...(SEO_DATA.trackOrder as any)} />
      <Navbar />

      {/* ── HEADER ── */}
      <PageHeader
        Icon={Package}
        title={t("pages.trackOrder.heroTitle")}
        titleGold={t("pages.trackOrder.heroTitleGold")}
        subtitle="Enter your order ID and email address to track your package in real time."
        variant="sand"
      />

      {/* Wave: Header → Content */}
      <WaveDivider from="sand" to="paper" variant={1} />

      <main className="flex-1 py-12 section-paper">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="ohanna-card p-8 mb-8">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-black hieroglyph-font section-faint mb-1.5 tracking-wider">
                  {t("pages.trackOrder.orderId")} <span className="text-[#AE1C1C]">*</span>
                </label>
                <input
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g. OHN-1748000000000"
                  className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black hieroglyph-font section-faint mb-1.5 tracking-wider">
                  {t("pages.trackOrder.emailLabel")} <span className="text-[#AE1C1C]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="The email used at checkout"
                  className="w-full border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C89D29] transition-colors section-paper section-heading"
                  required
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] hover:bg-[#C89D29] hover:text-[#1B1B1B] dark:hover:bg-[#C89D29] py-3 font-black hieroglyph-font text-sm sketchy-button transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                {loading ? t("pages.trackOrder.tracking") : t("pages.trackOrder.trackBtn")}
              </button>
            </form>
          </div>

          {notFound && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ohanna-card p-8 text-center">
              <span className="text-4xl text-[#AE1C1C]/40 block mb-3">𓂀</span>
              <p className="font-black hieroglyph-font text-sm mb-2 section-heading">ORDER NOT FOUND</p>
              <p className="text-sm section-muted mb-4">We couldn't find an order matching that ID and email.</p>
              <Link href="/contact" className="text-xs text-[#C89D29] font-semibold hover:underline">Contact Support</Link>
            </motion.div>
          )}

          {order && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="ohanna-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#C89D29] font-black hieroglyph-font tracking-widest">ORDER ID</p>
                    <p className="font-bold text-sm section-heading">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs section-faint font-black hieroglyph-font tracking-widest">TOTAL</p>
                    <p className="font-bold text-[#C89D29]">EGP {order.total?.toLocaleString("en-EG")}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-start justify-between mb-4">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                          i <= currentStep ? "bg-[#C89D29] border-[#C89D29] text-[#1B1B1B]" : "section-paper border-[#1B1B1B]/15 dark:border-[#FDF8EF]/15 section-faint"
                        }`}>
                          <step.icon className="h-4 w-4" />
                        </div>
                        <p className="text-[9px] font-black hieroglyph-font text-center leading-tight hidden sm:block section-faint">{step.labelKey}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-2">
                    <p className="font-black hieroglyph-font text-xs text-[#C89D29] tracking-wider">{STATUS_STEPS[currentStep]?.labelKey}</p>
                    <p className="text-xs section-muted mt-1">{STATUS_STEPS[currentStep]?.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <p className="text-center text-sm section-faint mt-8">
            Need help? <Link href="/contact" className="text-[#C89D29] font-semibold hover:underline">Contact support</Link>
          </p>
        </div>
      </main>

      {/* Wave: Content → Footer */}
      <WaveDivider from="paper" to="ink" variant={3} />

      <Footer />
    </div>
  );
}
