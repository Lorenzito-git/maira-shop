<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" doctype-system="about:legacy-compat" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="cs">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>
          <xsl:value-of select="/rss/channel/title"/>
        </title>
        <style>
          :root { --bg: #0f0f0f; --card: #161616; --border: rgba(255,255,255,.1); --text: #f5f5f5; --muted: #888; --accent: #ff4a20; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 24px; line-height: 1.5; }
          .wrap { max-width: 900px; margin: 0 auto; }
          h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 8px; letter-spacing: .02em; }
          .meta { color: var(--muted); font-size: 0.9rem; margin-bottom: 24px; }
          a { color: var(--accent); text-decoration: none; font-weight: 700; }
          a:hover { text-decoration: underline; }
          .channel-desc { color: var(--muted); margin-bottom: 28px; padding: 16px; border: 1px solid var(--border); border-radius: 12px; background: rgba(255,255,255,.03); }
          .list { display: grid; gap: 12px; }
          .item { border: 1px solid var(--border); border-radius: 14px; background: var(--card); padding: 16px; display: grid; grid-template-columns: 80px 1fr; gap: 16px; align-items: start; }
          .item img { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; background: rgba(255,255,255,.05); }
          .item-body { min-width: 0; }
          .item-title { font-weight: 800; margin-bottom: 4px; }
          .item-desc { color: var(--muted); font-size: 0.9rem; margin-bottom: 8px; }
          .item-meta { font-size: 0.85rem; color: var(--muted); }
          .item-meta .price { color: var(--accent); font-weight: 700; }
          .dl { margin-top: 24px; padding: 14px; border: 1px dashed var(--border); border-radius: 12px; color: var(--muted); font-size: 0.9rem; }
          .dl a { color: var(--text); }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>
            <xsl:value-of select="/rss/channel/title"/>
          </h1>
          <div class="meta">
            <xsl:value-of select="/rss/channel/lastBuildDate"/> · 
            <a href="{/rss/channel/link}">Otevřít e‑shop</a>
          </div>
          <div class="channel-desc">
            <xsl:value-of select="/rss/channel/description"/>
          </div>
          <div class="list">
            <xsl:for-each select="/rss/channel/item">
              <div class="item">
                <xsl:if test="enclosure[@url]">
                  <img src="{enclosure/@url}" alt="" loading="lazy"/>
                </xsl:if>
                <xsl:if test="not(enclosure[@url])">
                  <div style="width:80px;height:80px;border-radius:10px;background:rgba(255,255,255,.05);"/>
                </xsl:if>
                <div class="item-body">
                  <div class="item-title">
                    <a href="{link}">
                      <xsl:value-of select="title"/>
                    </a>
                  </div>
                  <div class="item-desc">
                    <xsl:value-of select="description"/>
                  </div>
                  <div class="item-meta">
                    <xsl:if test="category">
                      <span>
                        <xsl:value-of select="category"/>
                      </span>
                      <xsl:if test="price"> · </xsl:if>
                    </xsl:if>
                    <xsl:if test="price">
                      <span class="price">
                        <xsl:value-of select="price"/>
                      </span>
                    </xsl:if>
                  </div>
                </div>
              </div>
            </xsl:for-each>
          </div>
          <div class="dl">
            Tento feed lze stáhnout jako soubor: <a href="/feed.xml">feed.xml</a> (RSS 2.0). Demo e‑shop, neprobíhá reálný prodej.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
