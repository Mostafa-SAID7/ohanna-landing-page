import { motion } from "framer-motion";

const GLYPHS = ["𓂀", "𓅃", "𓋹", "𓊖", "𓏃", "𓁿", "𓇯", "𓆣"];

const GLYPH_POSITIONS = [
  { top: "8%", left: "6%", size: "1.4rem", delay: 0 },
  { top: "12%", right: "8%", size: "1.1rem", delay: 0.6 },
  { top: "32%", left: "3%", size: "1rem", delay: 1.1 },
  { top: "60%", left: "5%", size: "1.3rem", delay: 0.3 },
  { top: "78%", right: "6%", size: "1.1rem", delay: 0.9 },
  { bottom: "10%", left: "12%", size: "1rem", delay: 1.4 },
  { top: "48%", right: "4%", size: "1.2rem", delay: 0.5 },
  { bottom: "20%", right: "14%", size: "0.9rem", delay: 1.7 },
];

export default function BrandHeroVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1B1B1B]">
      {/* Egyptian geometric background grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="eg-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C89D29" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1.5" fill="#C89D29" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#eg-grid)" />
      </svg>

      {/* Gold corner accents */}
      {[
        "top-0 left-0",
        "top-0 right-0 rotate-90",
        "bottom-0 left-0 -rotate-90",
        "bottom-0 right-0 rotate-180",
      ].map((pos, i) => (
        <svg key={i} className={`absolute w-12 h-12 ${pos}`} viewBox="0 0 40 40">
          <path d="M0,0 L24,0 L24,3 L3,3 L3,24 L0,24 Z" fill="#C89D29" opacity="0.6" />
        </svg>
      ))}

      {/* Floating hieroglyphs */}
      {GLYPH_POSITIONS.map((pos, i) => (
        <motion.span
          key={i}
          className="absolute text-[#C89D29]/40 select-none pointer-events-none font-light"
          style={{ fontSize: pos.size, ...pos } as React.CSSProperties}
          animate={{ y: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
        >
          {GLYPHS[i % GLYPHS.length]}
        </motion.span>
      ))}

      {/* Central product image with frame */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-4 pb-6">
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-2 mb-3"
        >
          <div className="h-px w-8 bg-[#C89D29]/60" />
          <span className="text-[#C89D29] text-[9px] tracking-[0.28em] font-black uppercase">Sacred Collection</span>
          <div className="h-px w-8 bg-[#C89D29]/60" />
        </motion.div>

        {/* Product frame with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative flex-1 w-full max-w-[240px]"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{ boxShadow: ["0 0 20px rgba(200,157,41,0.15)", "0 0 40px rgba(200,157,41,0.3)", "0 0 20px rgba(200,157,41,0.15)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Gold border frame */}
          <div className="relative border border-[#C89D29]/40 rounded-xl overflow-hidden h-full">
            {/* Corner dots */}
            {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-1.5 h-1.5 rounded-full bg-[#C89D29]/70 z-10`} />
            ))}

            <img
              src="/HORUS-HOODIE.jpg"
              alt="OHANNA Horus Hoodie"
              className="w-full h-full object-cover"
              loading="eager"
              style={{ minHeight: 220 }}
            />

            {/* Product label overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1B1B1B]/90 to-transparent px-3 pb-2 pt-6">
              <p className="text-[#C89D29] text-[10px] font-black tracking-widest">HORUS HOODIE</p>
              <p className="text-[#FDF8EF]/50 text-[9px] tracking-wider">BESTSELLER · DROP 01</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom brand strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-[#C89D29]/20" />
          <span className="text-[#FDF8EF]/30 text-[8px] tracking-[0.22em] font-bold">ANCIENT POWER · MODERN FORM</span>
          <div className="h-px flex-1 bg-[#C89D29]/20" />
        </motion.div>
      </div>
    </div>
  );
}
