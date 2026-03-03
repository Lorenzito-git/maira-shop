"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import products from "../../../data/products.json";

const TABS = [
  { key: "popis", label: "Popis" },
  { key: "detail", label: "Detail produktu" },
  { key: "recenze", label: "Recenze" },
  { key: "otazky", label: "Otázky k produktu" },
  { key: "blog", label: "Blog" },
];

function Badge({ children }) {
  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        border: "1px solid var(--maira-border)",
        background: "rgba(255,255,255,.06)",
        color: "var(--foreground)",
      }}
    >
      {children}
    </span>
  );
}

function StarRow({ rating = 4.6 }) {
  const full = Math.round(rating);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ opacity: i < full ? 1 : 0.3 }}>★</span>
      ))}
      <span style={{ marginLeft: 8, color: "var(--maira-muted)", fontSize: 13, fontWeight: 900 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  const p = useMemo(() => products.find((x) => x.id === id), [id]);
  const [tab, setTab] = useState("popis");
  const [feedChoiceOpen, setFeedChoiceOpen] = useState(false);

  if (!p) {
    return (
      <main style={{ padding: 32, maxWidth: 1000, margin: "0 auto", fontFamily: "Arial" }}>
        <a href="/" style={{ color: "var(--maira-muted)", textDecoration: "none", fontWeight: 900 }}>
          ← Zpět
        </a>
        <h1 style={{ marginTop: 18 }}>Produkt nenalezen.</h1>
        <p style={{ color: "var(--maira-muted)" }}>ID z URL: <b>{String(id)}</b></p>
      </main>
    );
  }

  const inStock = (p.inventory ?? 0) > 0;
  const imgs = p.images?.length ? p.images : [p.image];
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 6);

  return (
    <main style={{ padding: 32, maxWidth: 1200, margin: "0 auto", fontFamily: "Arial" }}>
      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <a href="/" style={{ color: "var(--maira-muted)", textDecoration: "none", fontWeight: 900 }}>
          ← Zpět na produkty
        </a>

        <>
        <button
          type="button"
          onClick={() => setFeedChoiceOpen(true)}
          style={{
            background: "var(--maira-orange)",
            color: "#fff",
            padding: "10px 14px",
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

      {/* BREADCRUMB */}
      <div style={{ color: "var(--maira-muted)", fontSize: 14, marginBottom: 14 }}>
        Home / {p.category} / <span style={{ color: "var(--foreground)", fontWeight: 900 }}>{p.title}</span>
      </div>

      {/* MAIN */}
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 420px", gap: 18, alignItems: "start" }}>
        {/* Thumbnails */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {imgs.slice(0, 5).map((src, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--maira-border)",
                borderRadius: 14,
                padding: 10,
                background: "rgba(255,255,255,.03)",
              }}
            >
              <img src={src} alt={`${p.title} ${i}`} style={{ width: "100%", borderRadius: 10 }} />
            </div>
          ))}
        </div>

        {/* Big image */}
        <div
          style={{
            border: "1px solid var(--maira-border)",
            borderRadius: 18,
            padding: 18,
            background: "rgba(255,255,255,.03)",
          }}
        >
          <img src={p.image} alt={p.title} style={{ width: "100%", borderRadius: 14, display: "block" }} />
        </div>

        {/* Info card */}
        <div
          style={{
            border: "1px solid var(--maira-border)",
            borderRadius: 18,
            padding: 20,
            background: "rgba(255,255,255,.03)",
          }}
        >
          <div style={{ color: "var(--maira-muted)", fontWeight: 900 }}>
            {p.brand} • {p.category}
          </div>

          <h1 style={{ marginTop: 10, fontSize: 28, lineHeight: 1.15 }}>{p.title}</h1>

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <StarRow rating={p.rating ?? 4.6} />
            <div style={{ color: "var(--maira-muted)", fontSize: 13, fontWeight: 900 }}>
              ({p.reviews_count ?? 0})
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Badge>{inStock ? "SKLADEM" : "VYPRODÁNO"}</Badge>
            <span style={{ color: "var(--maira-muted)", fontSize: 13 }}>
              {inStock ? `Dostupné: ${p.inventory} ks` : "Aktuálně není k dispozici"}
            </span>
            {(p.badges || []).map((b) => <Badge key={b}>{b}</Badge>)}
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            {p.sale_price != null ? (
              <>
                <span style={{ fontSize: 20, color: "var(--maira-muted)", textDecoration: "line-through", fontWeight: 700 }}>
                  {p.price} {p.currency}
                </span>
                <span style={{ fontSize: 30, fontWeight: 900 }}>
                  {p.sale_price} {p.currency}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 30, fontWeight: 900 }}>
                {p.price} {p.currency}
              </span>
            )}
          </div>

          <p style={{ marginTop: 12, color: "var(--maira-muted)", lineHeight: 1.65 }}>
            {p.short || p.description}
          </p>

          {/* options */}
          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--maira-muted)", marginBottom: 6 }}>Balení</div>
              <select
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid var(--maira-border)",
                  background: "rgba(255,255,255,.06)",
                  color: "var(--foreground)",
                }}
                defaultValue="Standard"
              >
                <option>Standard</option>
                <option>XL balení</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--maira-muted)", marginBottom: 6 }}>Množství</div>
              <div style={{ display: "flex", borderRadius: 12, border: "1px solid var(--maira-border)", overflow: "hidden" }}>
                <button style={{ flex: "0 0 44px", background: "rgba(255,255,255,.06)", color: "var(--foreground)", border: 0 }}>-</button>
                <div style={{ flex: 1, textAlign: "center", padding: 12, background: "rgba(255,255,255,.03)" }}>1</div>
                <button style={{ flex: "0 0 44px", background: "rgba(255,255,255,.06)", color: "var(--foreground)", border: 0 }}>+</button>
              </div>
            </div>
          </div>

          <button
            disabled={!inStock}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "14px 16px",
              borderRadius: 14,
              border: 0,
              fontWeight: 900,
              fontSize: 14,
              cursor: inStock ? "pointer" : "not-allowed",
              background: inStock ? "var(--maira-orange)" : "rgba(255,255,255,.10)",
              color: inStock ? "#fff" : "var(--maira-muted)",
            }}
          >
            {inStock ? "PŘIDAT DO KOŠÍKU (DEMO)" : "NELZE PŘIDAT (VYPRODÁNO)"}
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: "var(--maira-muted)" }}>
            * Demo e-shop. Neprobíhá reálný prodej.
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ marginTop: 26 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid var(--maira-border)",
                background: tab === t.key ? "var(--maira-orange)" : "rgba(255,255,255,.03)",
                color: tab === t.key ? "#fff" : "var(--maira-muted)",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            border: "1px solid var(--maira-border)",
            background: "rgba(255,255,255,.03)",
            borderRadius: 18,
            padding: 18,
          }}
        >
          {/* POPIS */}
          {tab === "popis" && (
            <div style={{ color: "var(--foreground)", lineHeight: 1.8 }}>
              <h2 style={{ marginTop: 0 }}>{p.title} – v kostce</h2>
              <p style={{ color: "var(--maira-muted)" }}>
                {p.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                  gap: 18,
                  marginTop: 18,
                }}
              >
                {/* Levý sloupec – benefity */}
                <div>
                  <h3 style={{ marginTop: 0 }}>Pro koho to je</h3>
                  <p style={{ color: "var(--maira-muted)" }}>
                    Ideální volba pro každého, kdo chce mít jednoduchý, funkční produkt bez zbytečností – ať už řešíš{" "}
                    výkon, regeneraci, zdraví nebo jen pohodlnější režim během dne.
                  </p>

                  {(p.highlights || []).length > 0 && (
                    <>
                      <h3>Hlavní benefity</h3>
                      <ul style={{ color: "var(--maira-muted)", paddingLeft: 20 }}>
                        {(p.highlights || []).map((h, i) => (
                          <li key={i} style={{ marginBottom: 4 }}>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Pravý sloupec – jak používat */}
                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid var(--maira-border)",
                    background: "rgba(255,255,255,.02)",
                    padding: 14,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 900, color: "var(--maira-muted)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                    Jak z produktu vytěžit maximum
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gap: 6, fontSize: 14, color: "var(--maira-muted)" }}>
                    <div>
                      <span style={{ fontWeight: 900 }}>Kdy:</span> {p.usage?.when || "podle tvého režimu během dne"}
                    </div>
                    <div>
                      <span style={{ fontWeight: 900 }}>Dávka:</span> {p.usage?.dose || "viz etiketa produktu"}
                    </div>
                    <div>
                      <span style={{ fontWeight: 900 }}>Míchání / způsob:</span> {p.usage?.mix || "voda, nápoj nebo jídlo, se kterým ti to sedí"}
                    </div>
                    {p.usage?.notes && (
                      <div style={{ marginTop: 6 }}>
                        <span style={{ fontWeight: 900 }}>Tip:</span> {p.usage.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 22,
                  padding: 14,
                  borderRadius: 16,
                  border: "1px dashed rgba(255,255,255,.16)",
                  background: "rgba(255,255,255,.02)",
                  color: "var(--maira-muted)",
                  fontSize: 13,
                }}
              >
                <b>Reality check:</b> žádný suplement sám o sobě nezmění všechno. Ber ho jako nástroj – základ je pořád
                strava, spánek a konzistentní trénink. Tohle je příjemný upgrade, ne zkratka.
              </div>
            </div>
          )}

          {/* DETAIL – ušité na míru: potraviny = nutriční hodnoty, oblečení = velikosti, ostatní = parametry + materiál */}
          {tab === "detail" && (
            <div style={{ lineHeight: 1.8 }}>
              <h2 style={{ marginTop: 0 }}>Detail produktu</h2>

              {/* Oblečení / merch s velikostní tabulkou */}
              {p.size_guide && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
                    gap: 18,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3>Velikostní tabulka</h3>
                    <p style={{ color: "var(--maira-muted)", fontSize: 14, marginBottom: 10 }}>
                      {p.size_guide.caption || "Rozměry v cm. Doporučujeme měřit oblečený kus, který ti sedí."}
                    </p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                        <thead>
                          <tr>
                            {(p.size_guide.columns || []).map((col, i) => (
                              <th
                                key={i}
                                style={{
                                  textAlign: "left",
                                  padding: 10,
                                  borderBottom: "1px solid var(--maira-border)",
                                  fontSize: 13,
                                  color: "var(--maira-muted)",
                                }}
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody style={{ color: "var(--maira-muted)", fontSize: 14 }}>
                          {(p.size_guide.rows || []).map((row, ri) => (
                            <tr key={ri}>
                              {(Array.isArray(row) ? row : Object.values(row)).map((cell, ci) => (
                                <td
                                  key={ci}
                                  style={{
                                    padding: 10,
                                    borderBottom: "1px solid rgba(255,255,255,.06)",
                                    fontWeight: ci === 0 ? 700 : 400,
                                    color: ci === 0 ? "var(--foreground)" : undefined,
                                  }}
                                >
                                  {String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {p.material && (
                      <>
                        <h3 style={{ marginTop: 18 }}>Materiál</h3>
                        <div style={{ color: "var(--maira-muted)" }}>{p.material}</div>
                      </>
                    )}
                  </div>
                  <div>
                    {p.care && (
                      <>
                        <h3>Údržba</h3>
                        <div style={{ color: "var(--maira-muted)", whiteSpace: "pre-line" }}>{p.care}</div>
                      </>
                    )}
                    {Object.keys(p.attributes || {}).length > 0 && (
                      <>
                        <h3 style={{ marginTop: 18 }}>Parametry</h3>
                        <div style={{ display: "grid", gap: 8, color: "var(--maira-muted)" }}>
                          {Object.entries(p.attributes).map(([k, v]) => (
                            <div
                              key={k}
                              style={{
                                padding: 10,
                                borderRadius: 12,
                                border: "1px solid var(--maira-border)",
                                background: "rgba(255,255,255,.02)",
                              }}
                            >
                              <span style={{ fontSize: 12, opacity: 0.9 }}>{k}</span>
                              <div style={{ fontWeight: 900, color: "var(--foreground)" }}>
                                {Array.isArray(v) ? v.join(", ") : String(v)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Potraviny / suplementy – parametry, složení, nutriční hodnoty */}
              {!p.size_guide && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: p.nutrition ? "minmax(0, 1.2fr) minmax(0, 1.1fr)" : "1fr",
                    gap: 18,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    {Object.keys(p.attributes || {}).length > 0 && (
                      <>
                        <h3>Parametry</h3>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 10,
                            color: "var(--maira-muted)",
                          }}
                        >
                          {Object.entries(p.attributes).map(([k, v]) => (
                            <div
                              key={k}
                              style={{
                                padding: 12,
                                borderRadius: 14,
                                border: "1px solid var(--maira-border)",
                                background: "rgba(255,255,255,.02)",
                              }}
                            >
                              <div style={{ fontSize: 12, opacity: 0.9 }}>{k}</div>
                              <div style={{ fontWeight: 900, color: "var(--foreground)" }}>
                                {Array.isArray(v) ? v.join(", ") : String(v)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <h3 style={{ marginTop: 18 }}>{p.nutrition ? "Složení" : "Materiál / Složení"}</h3>
                    <div style={{ color: "var(--maira-muted)" }}>
                      {p.ingredients || p.material || "Složení bude doplněno (demo produkt)."}
                    </div>
                  </div>

                  {p.nutrition && (
                    <div>
                      <h3>Nutriční hodnoty</h3>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid var(--maira-border)", fontSize: 13 }}>Hodnota</th>
                              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid var(--maira-border)", fontSize: 13 }}>Na 100 g</th>
                              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid var(--maira-border)", fontSize: 13 }}>Na porci</th>
                            </tr>
                          </thead>
                          <tbody style={{ color: "var(--maira-muted)", fontSize: 14 }}>
                            {[
                              ["Energie (kcal)", p.nutrition?.per_100g?.energy_kcal, p.nutrition?.per_serving?.energy_kcal],
                              ["Bílkoviny (g)", p.nutrition?.per_100g?.protein_g, p.nutrition?.per_serving?.protein_g],
                              ["Sacharidy (g)", p.nutrition?.per_100g?.carbs_g, p.nutrition?.per_serving?.carbs_g],
                              ["Tuky (g)", p.nutrition?.per_100g?.fat_g, p.nutrition?.per_serving?.fat_g],
                            ].map(([label, a, b]) => (
                              <tr key={label}>
                                <td style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{label}</td>
                                <td style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{a ?? "—"}</td>
                                <td style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{b ?? "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ marginTop: 10, fontSize: 12, color: "var(--maira-muted)", opacity: 0.8 }}>
                        Hodnoty jsou orientační a mohou se lišit podle příchuti / varianty (demo prostředí).
                      </div>
                    </div>
                  )}

                  {/* Ostatní (vybavení) – jen parametry + materiál, bez nutriční tabulky */}
                  {!p.nutrition && Object.keys(p.attributes || {}).length > 0 && (
                    <div>
                      {p.care && (
                        <>
                          <h3>Údržba / použití</h3>
                          <div style={{ color: "var(--maira-muted)", whiteSpace: "pre-line" }}>{p.care}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RECENZE */}
          {tab === "recenze" && (
            <div>
              <h2 style={{ marginTop: 0 }}>Recenze</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 900 }}>
                    {(p.rating ?? 4.6).toFixed(1)}
                  </div>
                  <StarRow rating={p.rating ?? 4.6} />
                </div>
                <div style={{ color: "var(--maira-muted)", fontSize: 14 }}>
                  Na základě <b>{p.reviews_count ?? 0} hodnocení</b> v demo feedu.
                  <br />
                  V reálném e‑shopu by tady běžely skutečné recenze zákazníků + filtry (např. podle typu cíle).
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr)",
                  gap: 14,
                }}
              >
                {(p.reviews && p.reviews.length > 0 ? p.reviews : [
                  { author: "Demo zákazník", text: "Stabilní kvalita, žádné překvapení. Přidal jsem do režimu, nic dalšího jsem neměnil – a prostě to funguje tak, jak má.", rating: 5 },
                  { author: "Demo zákaznice", text: "Beru dlouhodobě. Oceňuju hlavně jednoduchost – nemusím řešit složení na stránku dlouhé etikety. Otevřeš, použiješ, ideálně každý den stejně.", rating: 5 },
                ]).slice(0, 6).map((rev, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 16,
                      border: "1px solid var(--maira-border)",
                      background: "rgba(255,255,255,.02)",
                      padding: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <StarRow rating={rev.rating ?? 5} />
                    </div>
                    <div style={{ fontWeight: 900 }}>{rev.title ? `„${rev.title}"` : null}</div>
                    <div style={{ marginTop: 6, color: "var(--maira-muted)", fontSize: 14 }}>
                      {rev.text}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: "var(--maira-muted)" }}>— {rev.author}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, color: "var(--maira-muted)", fontSize: 13 }}>
                (Demo) Sem můžeš napojit reálné recenze z e‑shopu nebo marketplace, pracovat se sentimentem, hvězdičkami,
                tagy typu „síla“, „regenerace“, „spánek“ atd.
              </div>
            </div>
          )}

          {/* OTÁZKY – qa + faq v jednom seznamu */}
          {tab === "otazky" && (
            <div>
              <h2 style={{ marginTop: 0 }}>Otázky k produktu</h2>

              <p style={{ color: "var(--maira-muted)", fontSize: 14, marginBottom: 14 }}>
                Řešíš, jestli se ti tenhle produkt hodí do režimu? Časté dotazy a odpovědi:
              </p>

              {(() => {
                const allQa = [
                  ...(p.qa || []).map((x) => ({ q: x.q, a: x.a })),
                  ...(p.faq || []).map((f) => ({ q: f.q, a: f.a })),
                ];
                if (allQa.length === 0) return <div style={{ color: "var(--maira-muted)" }}>Zatím žádné dotazy (demo).</div>;
                return (
                  <div style={{ display: "grid", gap: 10 }}>
                    {allQa.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid var(--maira-border)",
                          borderRadius: 14,
                          padding: 14,
                          background: "rgba(255,255,255,.02)",
                        }}
                      >
                        <div style={{ fontWeight: 900 }}>{item.q}</div>
                        <div style={{ color: "var(--maira-muted)", marginTop: 8 }}>{item.a}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* BLOG */}
          {tab === "blog" && (
            <div>
              <h2 style={{ marginTop: 0 }}>{p.blog?.title || "Jak z toho vymačkat maximum"}</h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "var(--maira-muted)",
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                <span>MAIRA Performance Notes</span>
                <span>•</span>
                <span>Odhadem 3–5 min čtení</span>
              </div>

              <div style={{ color: "var(--maira-muted)", marginBottom: 14 }}>
                {p.blog?.excerpt ||
                  "Nejen co koupíš, ale hlavně jak to zapadne do tvého režimu. Níž máš jednoduchý návod, jak s produktem pracovat dlouhodobě bez zbytečného micromanagementu."}
              </div>

              <div style={{ color: "var(--maira-muted)", lineHeight: 1.9, fontSize: 14 }}>
                {p.blog?.content || (
                  <>
                    <p>
                      Většina lidí suplementy vezme, zkusí týden a čeká instantní zázrak. Realita: funguje to podobně
                      jako trénink – efekt se sčítá v čase. Tvoje výhoda je v tom, že máš jednoduchý produkt, který jde
                      snadno držet dlouhodobě.
                    </p>
                    <p>
                      Základní princip: <b>najdi si pevné místo v režimu</b>. Pro někoho je to hned po tréninku, pro
                      jiného večer k poslednímu jídlu. Čím míň nad tím musíš přemýšlet, tím větší šance, že u toho
                      zůstaneš.
                    </p>
                    <p>
                      Pokud máš jasný cíl (síla, objem, redukce, zdraví), můžeš produkt brát jako „pojistku“, že neřešíš
                      všechny detaily jídla na 100 %, ale klíčové věci máš pokryté. To ti uvolní mentální kapacitu na
                      to, co se počítá nejvíc – progres v tréninku, kvalitní spánek a konzistenci.
                    </p>
                  </>
                )}
              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 16,
                  border: "1px solid var(--maira-border)",
                  background: "rgba(255,255,255,.02)",
                  color: "var(--maira-muted)",
                  fontSize: 13,
                }}
              >
                <b>Praktický takeaway:</b>{" "}
                <span>
                  nastav si jednoduchý trigger – „když {p.usage?.when?.toLowerCase() || "jdu po tréninku domů"},{" "}
                  {p.title} je automaticky součást hry“. Bez notifikací, bez zbytečného stresu.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Zákazníci si také dokoupili</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {related.map((r) => (
              <a
                key={r.id}
                href={`/product/${r.id}`}
                style={{
                  textDecoration: "none",
                  border: "1px solid var(--maira-border)",
                  background: "var(--maira-card)",
                  borderRadius: 16,
                  padding: 14,
                  display: "block",
                }}
              >
                <img src={r.image} alt={r.title} style={{ width: "100%", borderRadius: 12 }} />
                <div style={{ marginTop: 10, fontWeight: 900 }}>{r.title}</div>
                <div style={{ marginTop: 6, color: "var(--maira-muted)", fontSize: 14, display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
                  {r.sale_price != null ? (
                    <>
                      <span style={{ textDecoration: "line-through", fontSize: 12 }}>{r.price} {r.currency}</span>
                      <span style={{ color: "var(--foreground)", fontWeight: 900 }}>{r.sale_price} {r.currency}</span>
                    </>
                  ) : (
                    <span>{r.price} {r.currency}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}