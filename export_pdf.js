import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

/**
 * Export KDP-ready interior PDF
 * Following KDP specs: https://kdp.amazon.com/en_US/help/topic/G201834180
 */

const manifestPath = "/workspace/book/book_manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const outputPath = "/workspace/book/export/interior_kdp.pdf";

// Calculate dimensions
const { pdf_w_in, pdf_h_in } = manifest.dimensions;
const dpi = manifest.kdp.print_dpi;

// Convert inches to points (72 points per inch)
const pageWidth = pdf_w_in * 72;
const pageHeight = pdf_h_in * 72;

console.log("\n📄 Creating KDP-ready interior PDF\n");
console.log(`📐 Page size: ${pdf_w_in}" × ${pdf_h_in}" (${pageWidth} × ${pageHeight} points)`);
console.log(`📏 Trim size: ${manifest.kdp.trim_in.w}" × ${manifest.kdp.trim_in.h}"`);
console.log(`🎨 Bleed: ${manifest.kdp.bleed_in}" on all sides`);
console.log(`🖨️  DPI: ${dpi}\n`);

// Create PDF
const doc = new PDFDocument({
  size: [pageWidth, pageHeight],
  margins: 0,
  autoFirstPage: false,
  info: {
    Title: manifest.title,
    Author: "Auto-generated Picture Book",
    Subject: `Children's book for ages ${manifest.age_band}`,
    Keywords: manifest.theme,
    Language: manifest.meta.language,
  }
});

// Pipe to file
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Add each page
for (const page of manifest.pages) {
  console.log(`📄 Adding page ${page.index}/${manifest.pages_count}: "${page.text}"`);
  
  if (!page.image_path || !fs.existsSync(page.image_path)) {
    console.log(`   ⚠️  Image not found, skipping`);
    continue;
  }
  
  // Add new page
  doc.addPage({
    size: [pageWidth, pageHeight],
    margins: 0,
  });
  
  // Add image (full bleed - covers entire page including bleed area)
  doc.image(page.image_path, 0, 0, {
    width: pageWidth,
    height: pageHeight,
    align: "center",
    valign: "center",
  });
  
  console.log(`   ✅ Added`);
}

// Finalize PDF
doc.end();

stream.on("finish", () => {
  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`\n✅ PDF export complete!`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`📊 File size: ${sizeMB} MB`);
  console.log(`📚 Pages: ${manifest.pages.length}`);
  console.log(`\n💡 This PDF is ready for KDP upload as the interior file.`);
  console.log(`📖 Next: Create your cover using KDP Cover Calculator`);
  console.log(`   (https://kdp.amazon.com/en_US/cover-templates)\n`);
  
  // Update manifest
  manifest.meta.log.push({
    timestamp: new Date().toISOString(),
    action: "PDF export completed",
    details: `Exported ${manifest.pages.length} pages to interior_kdp.pdf (${sizeMB} MB)`
  });
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
});

stream.on("error", (err) => {
  console.error(`\n❌ PDF export failed: ${err.message}`);
});
