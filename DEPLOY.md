# Nasazení MAIRA Shop na GitHub a Vercel

## 1. Uložení do GitHubu

### A) Vytvoř nový repozitář na GitHubu
1. Otevři [github.com](https://github.com) a přihlas se.
2. Klikni na **„+”** v pravém horním rohu → **„New repository”**.
3. Nastav:
   - **Repository name:** např. `maira-shop`
   - **Visibility:** Public
   - **Nechat prázdné** „Add a README“ ani „.gitignore“ (projekt už má obsah)
4. Klikni **„Create repository”**.

### B) Propojení a odeslání kódu
V terminálu v adresáři projektu (`/Users/filda/maira-shop`) spusť (nahraď `TVUJ_GITHUB_USER` svým uživatelským jménem na GitHubu):

```bash
git remote add origin https://github.com/TVUJ_GITHUB_USER/maira-shop.git
git push -u origin main
```

Pokud používáš SSH:
```bash
git remote add origin git@github.com:TVUJ_GITHUB_USER/maira-shop.git
git push -u origin main
```

Při prvním pushu se může zeptat na přihlášení do GitHubu (případně Personal Access Token).

---

## 2. Spuštění na Vercelu

### A) Účet a import projektu
1. Jdi na [vercel.com](https://vercel.com) a přihlas se (ideálně **„Continue with GitHub”**).
2. Klikni **„Add New…”** → **„Project”**.
3. V seznamu repozitářů vyber **maira-shop** (nebo ho napřed „Import” z GitHubu).
4. Klikni **„Import”**.

### B) Nastavení buildu
- **Framework Preset:** Next.js (Vercel ho většinou detekuje sám).
- **Root Directory:** nech prázdné.
- **Build Command:** `npm run build` (výchozí).
- **Output Directory:** výchozí (`.next`).
- **Install Command:** `npm install` (výchozí).

Klikni **„Deploy”**.

### C) Po nasazení
- Vercel ti dá adresu typu **`https://maira-shop-xxx.vercel.app`**.
- Každý push do `main` na GitHubu spustí nový deploy automaticky.
- Feed bude dostupný na **`https://tvoje-adresa.vercel.app/feed.xml`**.

---

## Rychlý checklist
- [ ] Repozitář na GitHubu vytvořen
- [ ] `git remote add origin ...` a `git push` proběhly
- [ ] Vercel účet (přes GitHub)
- [ ] Import projektu z GitHubu na Vercel
- [ ] Deploy dokončen a adresa otevřená v prohlížeči
