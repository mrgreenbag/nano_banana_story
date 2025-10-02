# 🚀 QUICKSTART - Picture Book Production Agent

## Hiter start v 5 minutah! ⏱️

---

## 1️⃣ Preveri demo knjigo (že ustvarjena!)

Projekt že vsebuje pripravljeno demo knjigo **"Luna in Mavrica Barv"**:

```bash
# Prikaži povzetek knjige
npm run manifest

# Odpri web preview v brskalniku
open book/export/preview/index.html
# (ali ročno odpri datoteko)

# Preveri PDF
open book/export/interior_kdp.pdf
```

**Rezultat:** Vidiš demo slikanico z 16 stranmi! 📚

---

## 2️⃣ Generiraj PRAVE AI ilustracije (potreben API ključ)

### A) Pridobi Gemini API ključ

1. Pojdi na: https://ai.google.dev/
2. Klikni "Get API Key"
3. Ustvari nov ključ za svoj projekt

### B) Nastavi ključ

```bash
export GEMINI_API_KEY="AIza..."
```

### C) Regeneriraj slike

```bash
npm run render
```

**Trajanje:** ~30-60 sekund za 16 slik

### D) Re-izvozi PDF

```bash
npm run pdf
npm run preview
```

**Rezultat:** Prave akvarel AI ilustracije namesto placeholderjev! 🎨

---

## 3️⃣ Ustvari nov projekt

### AUTO način (najhitrejši)

```bash
# Zaženi agenta
node book_cli.js /new-book

# Ko te vpraša: AUTO ali CUSTOM?
> AUTO

# Ko te vpraša za starostno skupino:
> 3-5   (ali 4-7, ali 6-8)
```

Agent samodejno ustvari:
- ✅ Naslov
- ✅ Zgodbo
- ✅ Like
- ✅ Vizualni slog
- ✅ Vse strani

Nato:
```bash
npm run render   # Generiraj slike
npm run pdf      # Izvozi PDF
npm run preview  # Ustvari preview
```

### CUSTOM način (popoln nadzor)

```bash
node book_cli.js /new-book

# Ko te vpraša:
> CUSTOM

# Odgovori na vprašanja:
- Naslov?
- Starost?
- Število strani?
- Tema?
- Liki?
- Vizualni slog?
```

---

## 4️⃣ Uporabni ukazi

```bash
# MANIFEST - prikaži povzetek knjige
npm run manifest

# STYLE - prikaži style card
npm run style

# COVER - navodila za ovitek
npm run cover

# DEMO - generiraj placeholder slike (brez API)
npm run demo

# RENDER - generiraj prave AI slike (z API)
npm run render

# PDF - izvozi KDP-ready PDF
npm run pdf

# PREVIEW - ustvari web preview
npm run preview
```

---

## 5️⃣ Upload na Amazon KDP

### A) Pripravi interior (že narejen!)

✅ `book/export/interior_kdp.pdf`

### B) Ustvari ovitek

```bash
npm run cover
```

Sledil navodilom:
1. KDP Cover Calculator
2. Vnesi dimenzije (8.5" × 8.5", 16 strani)
3. Prenesi template
4. Oblikuj ovitek
5. Izvozi @ 300 DPI

### C) Upload na KDP

1. Prijava: https://kdp.amazon.com
2. Create New Title → Paperback
3. Upload:
   - Interior: `book/export/interior_kdp.pdf`
   - Cover: `book/cover/cover-wrap.pdf`
4. Preview
5. Publish! 🎉

---

## 📁 Struktura projekta

```
/workspace/
├── book/
│   ├── book_manifest.json       ← Single source of truth
│   ├── images/                  ← Generirane slike (32 datotek)
│   ├── export/
│   │   ├── interior_kdp.pdf     ← KDP-ready PDF ✅
│   │   └── preview/
│   │       └── index.html       ← Web preview ✅
│   └── cover/                   ← (tvoj ovitek)
├── generate_images.js           ← Gemini API (produkcija)
├── generate_images_demo.js      ← Demo mode (brez API)
├── export_pdf.js                ← PDF generator
├── build_preview.js             ← Web preview builder
├── book_cli.js                  ← CLI tools
└── package.json
```

---

## ⚡ Hitri primeri

### Primer 1: Preveri demo knjigo

```bash
npm run manifest
open book/export/preview/index.html
```

### Primer 2: Regeneriraj z API

```bash
export GEMINI_API_KEY="AIza..."
npm run render
npm run pdf
```

### Primer 3: Ustvari novo knjigo

```bash
node book_cli.js /new-book
# Izberi AUTO, nato starost 4-7
npm run demo  # ali npm run render če imaš API
npm run pdf
npm run preview
```

---

## ❓ FAQ

### Kaj če nimam Gemini API ključa?

Uporabi demo način:
```bash
npm run demo
```

Dobil boš placeholder slike z besedilom in barvami - idealno za testiranje workflow-ja.

### Kako spremenim zgodbo?

Uredi `book/book_manifest.json`:
- Najdi `pages` array
- Spremeni `text` polja
- Shrani in `npm run pdf`

### Kako spremenim vizualni slog?

Uredi `book/book_manifest.json`:
- Najdi `style_card` polje
- Spremeni opis sloga
- Shrani in `npm run render`

### Kako dodam več strani?

1. Uredi manifest: dodaj strani v `pages` array
2. Posodobi `pages_count`
3. Dodaj scene v `generate_images_demo.js` ali `.js`
4. Zaženi `npm run render` in `npm run pdf`

### Kako spremenim format knjige?

Uredi `book/book_manifest.json`:
```json
"kdp": {
  "trim_in": { "w": 8, "h": 10 },  // portrait
  ...
}
```

Nato:
```bash
npm run render
npm run pdf
```

### KDP zavrne moj PDF?

Preveri:
- ✅ 300 DPI
- ✅ 0.125" bleed
- ✅ sRGB color
- ✅ Brez prosojnosti
- ✅ Pravilne dimenzije

Zaženi:
```bash
npm run pdf  # Ponovno izvozi
```

---

## 🎯 Naslednji koraki

1. **Preveri demo** → `npm run manifest`
2. **Dodaj API ključ** → `export GEMINI_API_KEY="..."`
3. **Generiraj slike** → `npm run render`
4. **Ustvari ovitek** → `npm run cover`
5. **Upload na KDP** → https://kdp.amazon.com

---

## 📚 Dodatna dokumentacija

- `README.md` - Kompletna dokumentacija
- `SUMMARY.md` - Povzetek projekta
- `FINAL_REPORT.md` - Tehnično poročilo
- `book/book_manifest.json` - Vsi podatki knjige

---

## 💡 Tipi & triki

### Hiter preview

```bash
# Ustvari samo prvo stran
# (v generate_images.js komentiraj loop do strani 1)
npm run render
open book/images/page-001.png
```

### Batch knjige

```bash
# Ustvari več knjig v različnih mapah
mkdir book-luna book-tim book-ana
# Kopiraj manifest template in spremeni
# Zaženi za vsako knjigo
```

### Style presets

Ustvari `styles/` folder s prednastavljenimi style card-i:
- `watercolor.txt`
- `cartoon.txt`
- `realistic.txt`
- `minimalist.txt`

Nato kopiraj v manifest.

---

## 🆘 Pomoč

### Težave z namestitvijo?

```bash
rm -rf node_modules package-lock.json
npm install
```

### API error?

- Preveri API ključ: `echo $GEMINI_API_KEY`
- Preveri kvoto: https://ai.google.dev/
- Uporabi demo: `npm run demo`

### PDF prevelik?

- Zmanjšaj število strani
- Optimiziraj slike (že se avtomatsko)
- KDP limit: 650 MB (trenutno: 3.1 MB) ✅

---

**Srečno ustvarjanje! 🎨📚✨**

*Questions? Check: README.md, SUMMARY.md, FINAL_REPORT.md*
