# 📚 Picture Book Production Agent

Produkcijski agent za ustvarjanje popolnoma formatiranih otroških slikanic z AI-generiranimi ilustracijami in KDP-pripravljenimi izvozi.

## 🎯 Funkcionalnosti

- **AUTO način**: Samodejno generira celotno knjigo (zgodba, liki, slog, ilustracije)
- **CUSTOM način**: Popoln nadzor nad vsemi kreativnimi odločitvami
- **Vizualna konsistentnost**: Style Card + Character Bible zagotavljata enotnost
- **KDP-pripravljeni izvozi**: Interior PDF (300 DPI, bleed), slike, metadata
- **Spletni predogled**: Lepa HTML stran za ogled knjige

---

## 🚀 Hitra nastavitev

### Predpogoji

```bash
node >= 18.0.0
npm
```

### Namestitev

```bash
npm install
```

### Nastavi Gemini API ključ

```bash
export GEMINI_API_KEY="your-api-key-here"
```

Pridobi svoj API ključ: [https://ai.google.dev/](https://ai.google.dev/)

---

## 📖 Ukazi

### `/new-book`
Začni nov projekt slikanice (AUTO ali CUSTOM način)

### `/render`
Generiraj/regeneriraj vse slike preko Gemini API

```bash
npm run render
```

### `/pdf`
Izvozi KDP-pripravljeni interior PDF (300 DPI, z bleed)

```bash
npm run pdf
```

### `/preview`
Ustvari spletni HTML predogled knjige

```bash
npm run preview
```

### `/cover`
Navodila za pripravo ovitka (uporablja KDP Cover Calculator)

### `/style`
Prikaži trenutni Style Card

### `/manifest`
Prikaži povzetek book_manifest.json

---

## 📁 Struktura projekta

```
/workspace/
├── book/
│   ├── book_manifest.json       # Edini vir resnice
│   ├── text/                    # Markdown strani (opcijsko)
│   ├── images/                  # Generirane slike
│   │   ├── page-001.png         # 2625×2625px @ 300 DPI
│   │   ├── page-001-preview-1024.png
│   │   └── ...
│   ├── export/
│   │   ├── interior_kdp.pdf     # KDP-pripravljen PDF
│   │   └── preview/
│   │       └── index.html       # Spletni predogled
│   └── cover/                   # Ovitek (ročno z KDP template)
├── generate_images.js           # Gemini API generiranje
├── generate_images_demo.js      # Demo način (brez API)
├── export_pdf.js                # PDF export
├── build_preview.js             # HTML preview builder
└── package.json
```

---

## 🎨 Kako deluje

### 1️⃣ Izberi način

**AUTO**: Sam izbereš starostno skupino (3-5, 4-7, 6-8), agent ustvari vse ostalo

**CUSTOM**: Odgovoriš na vsa vprašanja (naslov, liki, tema, slog...)

### 2️⃣ Zgodba & Slog

Agent ustvari:
- Beat outline (potek zgodbe po straneh)
- **Style Card**: Globalni vizualni slog (barve, osvetlitev, kompozicija)
- **Character Bible**: Opis vsakega lika (izgled, oblačila, rekviziti)

### 3️⃣ Generiranje slik (Page Loop)

Za vsako stran:
1. Izpopolni besedilo (starostni primerno)
2. Sestavi image prompt z Style Card + Character Bible
3. Kliči Gemini API (`gemini-2.0-flash-exp` model)
4. Preveri konsistentnost (oblačila, rekv iziti, čas dneva)
5. Dodaj alt-text za dostopnost

### 4️⃣ Izvozi

- **Interior PDF**: Vse strani @ 300 DPI, z 0.125" bleed
- **Per-page PNGs**: Visoka ločljivost za ponovni izvoz
- **Preview HTML**: Elegant spletni prikaz
- **Manifest JSON**: Vsi podatki, prompti, metadata

---

## 📐 KDP specifikacije

### Podprti formati

- **8.5" × 8.5"** (kvadrat) ✅
- **8" × 10"** (portret)
- **10" × 8"** (landscape)

### Bleed

- **0.125"** na vseh zunanjih robovih
- PDF velikost = Trim + 2×Bleed

### DPI

- **300 DPI** za tisk
- Avtomatski izračun px: `(trim_in + 2*bleed_in) × 300`

### Ovitek

Uporabi KDP Cover Calculator za točne dimenzije (odvisno od števila strani):
[https://kdp.amazon.com/en_US/cover-templates](https://kdp.amazon.com/en_US/cover-templates)

---

## 🤖 Gemini API (Nano Banana)

### Model

`gemini-2.0-flash-exp` za generiranje slik

### Prompt struktura

```
[STYLE_CARD - vedno enak]

Page X of "Title". Age band Y.

Scene: [detajlen opis scene]

Character: [ime, opis, oblačila iz Character Bible]

Continuity: [ključni elementi iz prejšnje strani]

Framing: [aspect ratio, camera angle]

Mood: [razpoloženje]

Quality: [tehnične zahteve]
```

### SynthID watermark

Vse slike Gemini vključujejo neviden SynthID watermark - to je OK za KDP interiore.

---

## 🎯 Quality Gates

Agent avtomatsko preveri:

- ✅ **Konsistentnost**: Oblačila, barve, rekviziti, čas dneva
- ✅ **Berljivost**: Stavki prilagojeni starosti (≤ 18 besed)
- ✅ **Kompozicija**: Osredotočen subjekt, prostor za besedilo
- ✅ **Export**: Pravilna velikost, ločljivost, sRGB, brez prosojnosti

---

## 📝 Primer: AUTO način

```bash
$ node book_agent.js

# Vprašanje: AUTO ali CUSTOM?
> 3-5

# Agent ustvari:
✅ Naslov: "Luna in Mavrica Barv"
✅ Liki: Luna (4 leta), radovedna deklica
✅ Tema: Barve, odkrivanje, radost
✅ Slog: Mehke akvarel ilustracije
✅ 16 strani zgodbe

# Generiraj slike
$ npm run render
# → 16 slik @ 2625×2625px

# Izvozi PDF
$ npm run pdf
# → interior_kdp.pdf pripravljen za upload

# Prikaži preview
$ npm run preview
# → Odpri book/export/preview/index.html v brskalniku
```

---

## 🔧 Troubleshooting

### Canvas install errors

Če ima `canvas` težave z namestitvijo, uporabljamo `sharp` kot alternativo (že nastavljeno).

### API Key manjka

```bash
export GEMINI_API_KEY="your-key"
```

Ali uporabi demo način:
```bash
node generate_images_demo.js
```

### PDF preveč velik

- Zmanjšaj število strani
- Optimiziraj slike (že uporabljamo PNG compression)
- KDP podpira do 650 MB za interior

---

## 📚 Reference

- [Gemini Image Generation](https://ai.google.dev/gemini-api/docs/image-generation)
- [KDP Interior Specs](https://kdp.amazon.com/en_US/help/topic/G201834180)
- [KDP Bleed & Margins](https://kdp.amazon.com/en_US/help/topic/G201953020)
- [KDP Cover Templates](https://kdp.amazon.com/en_US/cover-templates)

---

## 🎉 Uspešno ustvarjena knjiga!

Tvoja slikanica **"Luna in Mavrica Barv"** je pripravljena za KDP! 🚀

**Naslednji koraki:**
1. Preveri `book/export/interior_kdp.pdf`
2. Ustvari ovitek z KDP Cover Calculator
3. Upload na KDP
4. Objavi! 📖✨

---

**Made with ❤️ by Picture Book Production Agent**
