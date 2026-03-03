# Jak nahrát MAIRA Shop na internet – krok za krokem

Níže jsou **jen 3 krátké kroky**. Stačí je udělat v pořadí.

---

## KROK 1: Přihlášení do GitHubu (jednou)

1. Otevři **Terminál** (v Cursoru dole, nebo Spotlight: Cmd+Mezerník → napiš „Terminál“).
2. Zadej a potvrď Enterem:

```bash
gh auth login
```

3. Postupuj podle dotazů:
   - **„What is your preferred protocol?“** → zvol **GitHub.com**
   - **„What is your preferred protocol for Git operations?“** → zvol **HTTPS**
   - **„Authenticate Git with your GitHub credentials?“** → **Yes**
   - Otevře se prohlížeč → **přihlas se do GitHubu** (nebo vytvoř účet) a povol přístup.

Až uvidíš „Logged in as …“, jsi hotový. Tohle stačí udělat jen jednou.

---

## KROK 2: Vytvoření repozitáře a nahrání kódu

V terminálu se ujisti, že jsi ve složce projektu:

```bash
cd /Users/filda/maira-shop
```

Pak spusť **jeden** z těchto příkazů:

**A) Chceš repozitář veřejný (doporučeno):**
```bash
gh repo create maira-shop --public --source=. --remote=origin --push
```

**B) Chceš repozitář soukromý:**
```bash
gh repo create maira-shop --private --source=. --remote=origin --push
```

- Pokud se zeptá „Create a local project directory?“, zvol **No** (projekt už máme).
- Po chvíli uvidíš odkaz na repozitář, např. `https://github.com/TVOJE_USERNAME/maira-shop`.

Hotovo – kód je na GitHubu.

---

## KROK 3: Spuštění na Vercelu (aby to měli všichni na internetu)

1. Otevři v prohlížeči: **https://vercel.com**
2. Klikni na **„Sign Up“** nebo **„Log In“**.
3. Zvol **„Continue with GitHub“** a přihlas se (povol přístup k účtu, pokud se zeptá).
4. Po přihlášení klikni na **„Add New…“** (nebo „Create“) → **„Project“**.
5. V seznamu repozitářů najdi **maira-shop** a vedle něj klikni **„Import“**.
6. Na další obrazovce nic neměň (Framework: Next.js, Build Command: `npm run build`) a klikni **„Deploy“**.
7. Počkej cca 1–2 minuty. Až uvidíš **„Congratulations!“**, klikni na odkaz typu **„maira-shop-xxx.vercel.app“**.

Tím máš aplikaci na internetu – odkaz můžeš poslat komukoliv.

---

## Shrnutí

| Krok | Kde | Co udělat |
|------|-----|-----------|
| 1 | Terminál | `gh auth login` a přihlásit se v prohlížeči |
| 2 | Terminál | `cd /Users/filda/maira-shop` a pak `gh repo create maira-shop --public --source=. --remote=origin --push` |
| 3 | vercel.com | Přihlásit se přes GitHub → Add New → Project → Import „maira-shop“ → Deploy |

---

## Když něco nejde

- **„gh: command not found“** → Nainstaluj GitHub CLI: `brew install gh`, pak znovu Krok 1.
- **„repository already exists“** → Repozitář máš už vytvořený. Stačí přidat remote a pushnout:
  ```bash
  cd /Users/filda/maira-shop
  git remote add origin https://github.com/TVOJE_USERNAME/maira-shop.git
  git push -u origin main
  ```
  (Nahraď TVOJE_USERNAME svým GitHub jménem.)
- **Vercel nevidí repozitář** → Na GitHubu zkontroluj, že je repozitář **Public**, nebo při importu na Vercelu povol přístup k organizaci/účtu.

Kdybys narazil na konkrétní chybovou hlášku, napiš ji sem a doladíme to.
