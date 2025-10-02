#!/usr/bin/env node

import fs from "node:fs";
import { execSync } from "node:child_process";

/**
 * CLI helper for Picture Book Production Agent
 */

const manifestPath = "/workspace/book/book_manifest.json";

function loadManifest() {
  if (!fs.existsSync(manifestPath)) {
    console.error("❌ No book manifest found. Run /new-book first.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function showHelp() {
  console.log(`
📚 Picture Book Production Agent - Commands

Usage: node book_cli.js <command>

Commands:

  /new-book      Start a new book project (AUTO or CUSTOM mode)
  /render        Generate all page images (requires GEMINI_API_KEY)
  /pdf           Export KDP-ready interior PDF
  /preview       Build web preview HTML
  /cover         Show instructions for creating cover
  /style         Display the Style Card
  /manifest      Show book manifest summary
  /help          Show this help message

Examples:

  node book_cli.js /manifest
  npm run render
  npm run pdf
  npm run preview

Environment:

  GEMINI_API_KEY    Required for /render (get from https://ai.google.dev/)

Files:

  book/book_manifest.json          Single source of truth
  book/images/                     Generated images
  book/export/interior_kdp.pdf     KDP-ready PDF
  book/export/preview/index.html   Web preview
`);
}

function showManifest() {
  const manifest = loadManifest();
  
  console.log(`
📖 Book Manifest Summary
${"=".repeat(50)}

Title:           ${manifest.title}
Age Band:        ${manifest.age_band} years
Language:        ${manifest.meta.language}
Pages:           ${manifest.pages_count}
Theme:           ${manifest.theme}

📐 KDP Specifications:
   Trim:         ${manifest.kdp.trim_in.w}" × ${manifest.kdp.trim_in.h}"
   Bleed:        ${manifest.kdp.bleed_in}" on all sides
   PDF Size:     ${manifest.dimensions.pdf_w_in}" × ${manifest.dimensions.pdf_h_in}"
   Print DPI:    ${manifest.kdp.print_dpi}
   Image Size:   ${manifest.dimensions.img_w_px} × ${manifest.dimensions.img_h_px} px
   Aspect:       ${manifest.dimensions.aspect_ratio}

👥 Characters:
${manifest.character_bible.map(char => 
  `   - ${char.name} (${char.species}, ${char.age})`
).join('\n')}

📊 Status:
   Images:       ${manifest.pages.filter(p => p.image_path).length}/${manifest.pages_count} generated
   Prompts:      ${manifest.pages.filter(p => p.image_prompt).length}/${manifest.pages_count} ready
   Alt-text:     ${manifest.pages.filter(p => p.alt).length}/${manifest.pages_count} completed

📝 Recent Activity:
${manifest.meta.log.slice(-3).map(entry => 
  `   ${entry.timestamp.split('T')[0]} - ${entry.action}`
).join('\n')}

📁 Files:
   Manifest:     ${manifestPath}
   PDF:          book/export/interior_kdp.pdf
   Preview:      book/export/preview/index.html
${"=".repeat(50)}
`);
}

function showStyle() {
  const manifest = loadManifest();
  
  console.log(`
🎨 Style Card
${"=".repeat(50)}

${manifest.style_card}

${"=".repeat(50)}

This style card is used verbatim in every image prompt to ensure
visual consistency across all pages.
`);
}

function showCover() {
  const manifest = loadManifest();
  
  console.log(`
📗 Cover Creation Instructions
${"=".repeat(50)}

Your interior is ready! Now create the cover:

1️⃣  Go to KDP Cover Calculator:
   https://kdp.amazon.com/en_US/cover-templates

2️⃣  Enter your specifications:
   - Trim Size:      ${manifest.kdp.trim_in.w}" × ${manifest.kdp.trim_in.h}"
   - Page Count:     ${manifest.pages_count}
   - Paper:          White or Cream
   - Bleed:          Yes (0.125" on all edges)

3️⃣  Download the template (PDF or PNG)

4️⃣  Design your cover with:
   - Front cover:    ${manifest.title}
   - Spine:          Title + Author
   - Back cover:     Description + Barcode area
   - Bleed:          Extend art 0.125" beyond trim

5️⃣  Export at 300 DPI as PDF

6️⃣  Save to: book/cover/cover-wrap.pdf

📝 Cover text suggestions:

   Title:     ${manifest.title}
   Subtitle:  A colorful adventure for ages ${manifest.age_band}
   Back:      ${manifest.pages.slice(0, 3).map(p => p.text).join(' ')}...

🎨 Use the same style card colors:
   ${manifest.style_card.split('Palette:')[1]?.split('.')[0] || 'See style card'}

${"=".repeat(50)}
`);
}

function runRender() {
  console.log("\n🎨 Starting image generation...\n");
  
  if (!process.env.GEMINI_API_KEY) {
    console.log("⚠️  GEMINI_API_KEY not set - using DEMO mode\n");
    execSync("node generate_images_demo.js", { stdio: "inherit" });
  } else {
    console.log("✅ GEMINI_API_KEY found - generating real AI images\n");
    execSync("node generate_images.js", { stdio: "inherit" });
  }
}

function runPdf() {
  console.log("\n📄 Exporting KDP PDF...\n");
  execSync("node export_pdf.js", { stdio: "inherit" });
}

function runPreview() {
  console.log("\n🌐 Building web preview...\n");
  execSync("node build_preview.js", { stdio: "inherit" });
}

// Parse command
const command = process.argv[2];

switch (command) {
  case "/help":
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;
    
  case "/manifest":
    showManifest();
    break;
    
  case "/style":
    showStyle();
    break;
    
  case "/cover":
    showCover();
    break;
    
  case "/render":
    runRender();
    break;
    
  case "/pdf":
    runPdf();
    break;
    
  case "/preview":
    runPreview();
    break;
    
  case "/new-book":
    console.log("\n📚 Starting new book project...\n");
    console.log("This feature is interactive. Please follow the prompts in the main agent.\n");
    break;
    
  default:
    console.error(`\n❌ Unknown command: ${command}\n`);
    showHelp();
    process.exit(1);
}
