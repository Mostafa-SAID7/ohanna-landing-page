/**
 * Product seeds
 * Initial product data for the database
 */

import { generateId } from "../../lib/id-generator";

export const PRODUCT_SEEDS = [
  {
    id: generateId(),
    name: "HORUS HOODIE",
    description:
      "Oversized hoodie with the Eye of Horus embroidered across the chest. Premium 400gsm cotton blend. Ancient power meets street comfort.",
    price: 349900, // 3499 EGP in cents
    category: "Hoodies",
    badge: "BESTSELLER",
    imageUrl: "/HORUS-HOODIE.jpg",
    stock: 50,
    slug: "horus-hoodie",
  },
  {
    id: generateId(),
    name: "ANKH TEE",
    description:
      "Relaxed fit tee with oversized Ankh symbol. Heavyweight 220gsm cotton. The symbol of eternal life on your chest.",
    price: 129900, // 1299 EGP in cents
    category: "T-Shirts",
    badge: "LIMITED",
    imageUrl: "/ANKH-TEE.jpg",
    stock: 30,
    slug: "ankh-tee",
  },
  {
    id: generateId(),
    name: "PHARAOH JACKET",
    description:
      "Bomber jacket with scarab beetle and pyramid patterns. Premium polyester with Egyptian motifs. Rule the streets like a pharaoh.",
    price: 549900, // 5499 EGP in cents
    category: "Jackets",
    badge: "NEW",
    imageUrl: "/PHARAOH-JACKET.jpg",
    stock: 20,
    slug: "pharaoh-jacket",
  },
  {
    id: generateId(),
    name: "NILE JOGGERS",
    description:
      "Streetwear joggers with Egyptian wave patterns along the sides. 300gsm fleece. Comfort from the banks of the Nile.",
    price: 219900, // 2199 EGP in cents
    category: "Bottoms",
    badge: "TRENDING",
    imageUrl: "/NILE-JOGGER.png",
    stock: 45,
    slug: "nile-joggers",
  },
  {
    id: generateId(),
    name: "CLEOPATRA CAP",
    description:
      "Structured 6-panel cap with embroidered Cleopatra profile. Premium cotton twill. Royalty on your head.",
    price: 79900, // 799 EGP in cents
    category: "Accessories",
    badge: "EXCLUSIVE",
    imageUrl: "/CLEOPATRA-CAP.jpg",
    stock: 100,
    slug: "cleopatra-cap",
  },
  {
    id: generateId(),
    name: "SPHINX SWEATPANTS",
    description:
      "Tapered sweatpants with Sphinx embroidery on the thigh. 280gsm French terry. Comfort meets mythology.",
    price: 189900, // 1899 EGP in cents
    category: "Bottoms",
    badge: "UTILITY",
    imageUrl: "/SPHINX-SWEATPANTS.jpg",
    stock: 35,
    slug: "sphinx-sweatpants",
  },
  {
    id: generateId(),
    name: "PYRAMID OVERSIZED TEE",
    description:
      "Ultra-oversized tee with geometric pyramid print. 200gsm heavyweight cotton. Architectural streetwear.",
    price: 149900, // 1499 EGP in cents
    category: "T-Shirts",
    badge: "NEW",
    imageUrl: "/PYRAMID-OVERSIZED-TEE.jpg",
    stock: 60,
    slug: "pyramid-oversized-tee",
  },
  {
    id: generateId(),
    name: "CARTOUCHE LONG SLEEVE",
    description:
      "Long sleeve tee with cartouche design wrapping around the sleeve. 220gsm cotton. Ancient script, modern style.",
    price: 169900, // 1699 EGP in cents
    category: "T-Shirts",
    badge: "BESTSELLER",
    imageUrl: "/CARTOUCHE-LONG-SLEEVE.jpg",
    stock: 55,
    slug: "cartouche-long-sleeve",
  },
  {
    id: generateId(),
    name: "SCARAB BOMBER",
    description:
      "Lightweight bomber with scarab beetle embroidery. Nylon shell with cotton lining. Insect-inspired streetwear.",
    price: 399900, // 3999 EGP in cents
    category: "Jackets",
    badge: "LIMITED",
    imageUrl: "/SCARAB-BOMBER.jpg",
    stock: 25,
    slug: "scarab-bomber",
  },
  {
    id: generateId(),
    name: "HIEROGLYPH HOODIE",
    description:
      "Pullover hoodie with all-over hieroglyph print. 350gsm cotton blend. Wear ancient language.",
    price: 329900, // 3299 EGP in cents
    category: "Hoodies",
    badge: "TRENDING",
    imageUrl: "/HIEROGLYPH-HOODIE.jpg",
    stock: 40,
    slug: "hieroglyph-hoodie",
  },
  {
    id: generateId(),
    name: "NEFERTITI CROP TOP",
    description:
      "Fitted crop top with Nefertiti profile. 180gsm cotton. Celebrate the queen of beauty.",
    price: 99900, // 999 EGP in cents
    category: "T-Shirts",
    badge: "EXCLUSIVE",
    imageUrl: "/NEFERTITI-CROP-TOP.jpg",
    stock: 50,
    slug: "nefertiti-crop-top",
  },
  {
    id: generateId(),
    name: "ANKH CHAIN NECKLACE",
    description:
      "Stainless steel Ankh pendant on chain. Adjustable length. Timeless symbol of life.",
    price: 49900, // 499 EGP in cents
    category: "Accessories",
    badge: "NEW",
    imageUrl: "/ANKH-CHAIN-NECKLACE.jpg",
    stock: 200,
    slug: "ankh-chain-necklace",
  },
];
