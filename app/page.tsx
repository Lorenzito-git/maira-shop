"use client";

import { useMemo, useState } from "react";
import products from "../data/products.json";

const CATEGORY_ORDER = [
  "Protein",
  "Aminokyseliny",
  "Kreatin",
  "Pre-workout",
  "Hydratace",
  "Regenerace",
  "Vitamíny",
  "Výživa",
  "Snack",
  "Příslušenství",
  "Merch",
  "Klouby",
];

function sortCategories(cats: string[]) {
  return [...cats].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

type ProductItem = { id: string; title: string; category: string; brand?: string; image?: string; price?: number; sale_price?: number; currency?: string; inventory?: number };
function sortProducts(items: ProductItem[]) {
  return [...items].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    const ac = ai === -1 ? 999 : ai;
    const bc = bi === -1 ? 999 : bi;
    if (ac !== bc) return ac - bc;
    return a.title.localeCompare(b.title);
  });
}

export default function Home() {
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return sortCategories(Array.from(set));
  }, []);

  const [activeCat, setActiveCat] = useState("Vše");
  const [feedChoiceOpen, setFeedChoiceOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = activeCat === "Vše" ? products : products.filter((p) => p.category === activeCat);
    return sortProducts(base);
  }, [activeCat]);

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto", fontFamily: "Arial" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <img src="/maira-logo.png" alt="MAIRA" style={{ height: 52, width: "auto", objectFit: "contain" }} />

        <>
        <button
          type="button"
          onClick={() => setFeedChoiceOpen(true)}
          style={{
            background: "var(--maira-orange)",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 12,
            fontWeight: 900,
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          FEED.XML
        </button>

        {feedChoiceOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setFeedChoiceOpen(false)}
          >
            <div
              style={{
                background: "var(--maira-card)",
                border: "1px solid var(--maira-border)",
                borderRadius: 18,
                padding: 24,
                maxWidth: 360,
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontWeight: 900, marginBottom: 8 }}>XML feed</div>
              <div style={{ color: "var(--maira-muted)", fontSize: 14, marginBottom: 20 }}>
                Chceš feed stáhnout, nebo jen adresu?
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch("/feed.xml");
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "feed.xml";
                    a.click();
                    URL.revokeObjectURL(url);
                    setFeedChoiceOpen(false);
                  }}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid var(--maira-border)",
                    background: "var(--maira-orange)",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  Stáhnout feed
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const feedUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/feed.xml`;
                    try {
                      await navigator.clipboard.writeText(feedUrl);
                      setFeedChoiceOpen(false);
                    } catch {
                      window.prompt("Adresa feedu (zkopíruj):", feedUrl);
                      setFeedChoiceOpen(false);
                    }
                  }}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid var(--maira-border)",
                    background: "rgba(255,255,255,.06)",
                    color: "var(--foreground)",
                    fontWeight: 900,
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  Zkopírovat adresu
                </button>
                <button
                  type="button"
                  onClick={() => setFeedChoiceOpen(false)}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid var(--maira-border)",
                    background: "transparent",
                    color: "var(--maira-muted)",
                    fontWeight: 900,
                    cursor: "pointer",
                    font: "inherit",
                  }}
                >
                  Zrušit
                </button>
              </div>
            </div>
          </div>
        )}
      </>
      </div>

      {/* HERO */}
      <div
        style={{
          border: "1px solid var(--maira-border)",
          background: "rgba(255,255,255,.03)",
          borderRadius: 20,
          padding: 34,
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: 1 }}>WE MAKE IT RAIN.</div>

        <div style={{ marginTop: 14, color: "var(--maira-muted)", maxWidth: 760, lineHeight: 1.6 }}>
          Prémiové doplňky stravy a gym vybavení pod značkou MAIRA. Performance mindset. Žádné zbytečnosti. Jen výsledky.
        </div>
      </div>

      {/* CATEGORIES FILTER */}
      <div
        style={{
          border: "1px solid var(--maira-border)",
          background: "rgba(255,255,255,.03)",
          borderRadius: 18,
          padding: 14,
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={() => setActiveCat("Vše")}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid var(--maira-border)",
              background: activeCat === "Vše" ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.03)",
              fontWeight: 900,
              color: activeCat === "Vše" ? "var(--foreground)" : "var(--maira-muted)",
              cursor: "pointer",
            }}
          >
            Vše
          </button>

          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid var(--maira-border)",
                background: activeCat === c ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.03)",
                fontWeight: 900,
                color: activeCat === c ? "var(--foreground)" : "var(--maira-muted)",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}

          <div style={{ marginLeft: "auto", color: "var(--maira-muted)", fontSize: 13, fontWeight: 900 }}>
            Zobrazeno: {filtered.length}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
        {filtered.map((p) => {
          const inStock = (p.inventory ?? 0) > 0;

          return (
            <a
              key={p.id}
              href={`/product/${p.id}`}
              style={{
                textDecoration: "none",
                border: "1px solid var(--maira-border)",
                background: "var(--maira-card)",
                borderRadius: 16,
                padding: 14,
                display: "block",
              }}
            >
              <img src={p.image} alt={p.title} style={{ width: "100%", borderRadius: 12 }} />

              <div style={{ marginTop: 10, fontWeight: 900 }}>{p.title}</div>

              <div style={{ marginTop: 6, color: "var(--maira-muted)", fontSize: 14 }}>
                {p.category} • {p.brand}
              </div>

              <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  {p.sale_price != null ? (
                    <>
                      <span style={{ fontSize: 14, color: "var(--maira-muted)", textDecoration: "line-through", fontWeight: 700 }}>
                        {p.price} {p.currency}
                      </span>
                      <span style={{ fontWeight: 900 }}>
                        {p.sale_price} {p.currency}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontWeight: 900 }}>
                      {p.price} {p.currency}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: inStock ? "rgba(255,255,255,.10)" : "rgba(255,74,32,.18)",
                    border: "1px solid var(--maira-border)",
                  }}
                >
                  {inStock ? "Skladem" : "Vyprodáno"}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <div style={{ marginTop: 22, color: "var(--maira-muted)", fontSize: 12 }}>
        * Demo feed a demo e-shop pro ukázky nástrojů. Neprobíhá reálný prodej.
      </div>
    </main>
  );
}
