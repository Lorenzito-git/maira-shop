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
    .map(
      (p: {
        id: string;
        title: string;
        short?: string;
        description?: string;
        price?: number;
        sale_price?: number;
        currency?: string;
        image?: string;
        images?: string[];
        category?: string;
        brand?: string;
        inventory?: number;
      }) => {
        const link = `${base}/product/${p.id}`;
        const title = escapeXml(p.title);
        const desc = escapeXml(p.short || p.description || "");
        const img = p.image ? `${base}${p.image.startsWith("/") ? "" : "/"}${p.image}` : "";
        const additionalImages =
          (p.images || [])
            .filter((src) => src && src !== p.image)
            .map((src) => `${base}${src.startsWith("/") ? "" : "/"}${src}`) || [];
        const priceNumber = p.sale_price != null ? p.sale_price : p.price;
        if (priceNumber == null) return "";
        const priceStr = `${priceNumber.toFixed(2)} ${p.currency || "CZK"}`;
        const salePriceStr =
          p.sale_price != null ? `${p.sale_price.toFixed(2)} ${p.currency || "CZK"}` : "";
        const category = escapeXml(p.category || "");
        const brand = escapeXml(p.brand || "MAIRA");
        const availability = (p.inventory ?? 0) > 0 ? "in stock" : "out of stock";

        const imageLink = img ? `<g:image_link>${escapeXml(img)}</g:image_link>` : "";
        const additionalImageLinks = additionalImages
          .map((u) => `    <g:additional_image_link>${escapeXml(u)}</g:additional_image_link>`)
          .join("\n");

        return `  <item>
    <g:id>${escapeXml(p.id)}</g:id>
    <title>${title}</title>
    <link>${escapeXml(link)}</link>
    <description>${desc}</description>
    <g:price>${escapeXml(priceStr)}</g:price>
    ${salePriceStr ? `<g:sale_price>${escapeXml(salePriceStr)}</g:sale_price>` : ""}
    <g:availability>${availability}</g:availability>
    <g:condition>new</g:condition>
    <g:brand>${brand}</g:brand>
    <g:product_type>${category}</g:product_type>
${imageLink ? "    " + imageLink + "\n" : ""}${additionalImageLinks}
  </item>`;
      },
    )
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
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
