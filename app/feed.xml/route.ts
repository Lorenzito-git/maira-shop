import { NextRequest } from "next/server";
import products from "../../data/products.json";

const escapeXml = (str: string) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host") || "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const base = getBaseUrl(request);
  const channelTitle = "MAIRA Shop – Katalog produktů";
  const channelDesc =
    "Prémiové doplňky stravy a gym vybavení pod značkou MAIRA. Performance mindset. Žádné zbytečnosti. Jen výsledky.";

  const items = products
    .map((p: { id: string; title: string; short?: string; description?: string; price?: number; sale_price?: number; currency?: string; image?: string; category?: string }) => {
      const link = `${base}/product/${p.id}`;
      const title = escapeXml(p.title);
      const desc = escapeXml(p.short || p.description || "");
      const img = p.image ? `${base}${p.image.startsWith("/") ? "" : "/"}${p.image}` : "";
      const price = p.sale_price != null ? p.sale_price : p.price;
      const priceStr = price != null ? `${price} ${p.currency || "CZK"}` : "";
      const category = escapeXml(p.category || "");
      const pubDate = new Date().toUTCString();

      return `  <item>
    <title>${title}</title>
    <link>${escapeXml(link)}</link>
    <description>${desc}</description>
    <pubDate>${pubDate}</pubDate>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <category>${category}</category>
    ${img ? `<enclosure url="${escapeXml(img)}" type="image/png" />` : ""}
    <price>${escapeXml(priceStr)}</price>
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${base}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>cs</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Disposition": 'attachment; filename="feed.xml"',
    },
  });
}
