import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X, Filter, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/product-skeleton";
import WaveDivider from "@/components/ui/wave-divider";
import PageHeader from "@/components/layout/page-header";
import { CATEGORIES, FALLBACK_PRODUCTS, setProducts } from "@/lib/products-data";
import { translations } from "@/i18n";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types";
import { SEO } from "@/components/seo/seo";
import { SEO_DATA } from "@/lib/seo-data";
import { useLang } from "@/contexts/lang-context";

const PAGE_SIZE = 6;

function useDebounce<T>(val: T, ms: number) {
  const [deb, setDeb] = useState(val);
  useEffect(() => {
    const timer = setTimeout(() => setDeb(val), ms);
    return () => clearTimeout(timer);
  }, [val, ms]);
  return deb;
}

function getInitialCategory() {
  if (typeof window === "undefined") return "All";
  return new URLSearchParams(window.location.search).get("category") ?? "All";
}

export default function CollectionPage() {
  const { t, lang } = useLang();
  const collT = translations[lang].collection;
  const [category, setCategory] = useState(getInitialCategory);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [products, setLocalProducts] = useState<Product[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await apiClient.products.list();
        if (data && data.length > 0) {
          setLocalProducts(data);
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const debouncedSearch = useDebounce(searchInput, 300);

  const filtered = useMemo<Product[]>(() => {
    let results = category === "All"
      ? products
      : products.filter((p) => p.category === category);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return results;
  }, [category, debouncedSearch, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [category, debouncedSearch]);

  const handleCategory = useCallback((cat: string) => {
    setCategory(cat);
    const url = new URL(window.location.href);
    if (cat === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", cat);
    window.history.replaceState(null, "", url.toString());
  }, []);

  return (
    <div className="min-h-screen section-paper flex flex-col">
      <SEO {...SEO_DATA.collection} />
      <Navbar />

      {/* ── HEADER ── */}
      <PageHeader
        Icon={Eye}
        title={t("collection.heroTitle")}
        titleGold={t("collection.heroTitleGold")}
        subtitle={`${filtered.length} ${filtered.length !== 1 ? t("collection.piecesPlural") : t("collection.pieces")}${category !== "All" ? ` ${t("collection.inCategory")} ${category}` : ""}`}
        variant="sand"
      />

      {/* Wave: Header → Filters/Products */}
      <WaveDivider from="sand" to="paper" variant={1} />

      {/* ── FILTER BAR ── */}
      <div className="sticky top-[61px] z-20 section-paper border-b border-[#1B1B1B]/8 dark:border-[#FDF8EF]/8 py-3 shadow-sm backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 space-y-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 section-faint pointer-events-none" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("collection.searchPlaceholder")}
              className="w-full pl-9 pr-8 py-2 text-sm border-2 border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 rounded-lg section-paper focus:outline-none focus:border-[#C89D29] transition-colors section-muted placeholder:section-faint"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 section-faint hover:section-heading"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <Filter className="h-4 w-4 section-faint shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`shrink-0 px-4 py-1.5 text-xs font-black hieroglyph-font border-2 rounded-md transition-all ${
                  category === cat
                    ? "bg-[#1B1B1B] dark:bg-[#FDF8EF] text-[#FDF8EF] dark:text-[#1B1B1B] border-[#1B1B1B] dark:border-[#FDF8EF]"
                    : "section-paper border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 section-faint hover:border-[#C89D29] hover:text-[#C89D29]"
                }`}
              >
                {(collT.categories as Record<string, string>)[cat] ?? cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <main className="flex-1 py-10 section-paper">
        <div className="container mx-auto px-4">
          {loading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl block mb-4 text-[#C89D29]/30">𓋹</span>
              <p className="font-black hieroglyph-font section-faint text-xs tracking-widest mb-2">{t("collection.noPiecesFound")}</p>
              <button
                onClick={() => { setSearchInput(""); handleCategory("All"); }}
                className="mt-4 text-xs font-black hieroglyph-font text-[#C89D29] hover:underline"
              >
                {t("collection.clearFilters")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-black hieroglyph-font border-2 border-[#1B1B1B]/15 dark:border-[#FDF8EF]/15 rounded-lg hover:border-[#C89D29] hover:text-[#C89D29] disabled:opacity-30 disabled:cursor-not-allowed transition-all section-heading"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />{t("collection.prev")}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 text-xs font-black hieroglyph-font rounded-lg border-2 transition-all ${
                        n === page
                          ? "bg-[#C89D29] border-[#C89D29] text-[#1B1B1B]"
                          : "border-[#1B1B1B]/12 dark:border-[#FDF8EF]/12 section-faint hover:border-[#C89D29] hover:text-[#C89D29]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-black hieroglyph-font border-2 border-[#1B1B1B]/15 dark:border-[#FDF8EF]/15 rounded-lg hover:border-[#C89D29] hover:text-[#C89D29] disabled:opacity-30 disabled:cursor-not-allowed transition-all section-heading"
                  >
                    {t("collection.next")}<ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Wave: Products → Footer */}
      <WaveDivider from="paper" to="ink" variant={3} />

      <Footer />
    </div>
  );
}
