import fs from "node:fs";
import path from "node:path";

/**
 * Build a beautiful web preview of the picture book
 */

const manifestPath = "/workspace/book/book_manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const outputPath = "/workspace/book/export/preview/index.html";

console.log("\n🌐 Building web preview\n");

// Select preview pages (first 5 pages)
const previewPages = manifest.pages.slice(0, 5);

// Copy preview images to preview folder
console.log("📋 Copying preview images...");
for (const page of previewPages) {
  if (page.image_path) {
    const previewImagePath = page.image_path.replace(".png", "-preview-1024.png");
    if (fs.existsSync(previewImagePath)) {
      const destPath = `/workspace/book/export/preview/page-${String(page.index).padStart(3, "0")}.png`;
      fs.copyFileSync(previewImagePath, destPath);
      console.log(`   ✅ Copied page ${page.index}`);
    }
  }
}

// Build HTML
const html = `<!DOCTYPE html>
<html lang="${manifest.meta.language === 'Slovenian' ? 'sl' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${manifest.title} - Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    header {
      text-align: center;
      color: white;
      padding: 40px 20px;
      margin-bottom: 40px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-top: 10px;
    }
    
    .book-info {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    
    .info-item {
      background: rgba(255, 255, 255, 0.2);
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 0.9rem;
    }
    
    .preview-notice {
      background: rgba(255, 255, 255, 0.95);
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      margin-bottom: 30px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .preview-notice h2 {
      color: #667eea;
      margin-bottom: 10px;
    }
    
    .pages-grid {
      display: grid;
      gap: 30px;
      margin-bottom: 40px;
    }
    
    .page-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .page-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
    }
    
    .page-image {
      width: 100%;
      height: auto;
      display: block;
      background: #f8f9fa;
    }
    
    .page-content {
      padding: 25px;
    }
    
    .page-number {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .page-text {
      font-size: 1.4rem;
      line-height: 1.6;
      color: #333;
      margin-bottom: 15px;
      font-weight: 500;
    }
    
    .page-alt {
      font-size: 0.95rem;
      color: #666;
      font-style: italic;
      border-left: 3px solid #667eea;
      padding-left: 15px;
      margin-top: 15px;
    }
    
    footer {
      text-align: center;
      color: white;
      padding: 40px 20px;
      margin-top: 40px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
    }
    
    .specs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
      text-align: left;
    }
    
    .spec-item {
      background: rgba(255, 255, 255, 0.15);
      padding: 15px;
      border-radius: 10px;
    }
    
    .spec-label {
      font-weight: bold;
      opacity: 0.8;
      font-size: 0.85rem;
      margin-bottom: 5px;
    }
    
    .spec-value {
      font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }
      
      .page-text {
        font-size: 1.2rem;
      }
      
      .book-info {
        gap: 10px;
      }
    }
    
    .loading {
      opacity: 0;
      animation: fadeIn 0.5s ease-in forwards;
    }
    
    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📚 ${manifest.title}</h1>
      <p class="subtitle">Otroška slikanica za starost ${manifest.age_band} let</p>
      <div class="book-info">
        <div class="info-item">📄 ${manifest.pages_count} strani</div>
        <div class="info-item">📐 ${manifest.kdp.trim_in.w}" × ${manifest.kdp.trim_in.h}"</div>
        <div class="info-item">🎨 ${manifest.theme}</div>
      </div>
    </header>
    
    <div class="preview-notice">
      <h2>👀 Predogled prvih ${previewPages.length} strani</h2>
      <p>Celotna knjiga vsebuje ${manifest.pages_count} čudovito ilustriranih strani.</p>
    </div>
    
    <div class="pages-grid">
      ${previewPages.map(page => `
        <article class="page-card loading" style="animation-delay: ${(page.index - 1) * 0.1}s">
          <img 
            src="page-${String(page.index).padStart(3, "0")}.png" 
            alt="${page.alt || page.text}"
            class="page-image"
            loading="lazy"
          >
          <div class="page-content">
            <span class="page-number">Stran ${page.index}</span>
            <p class="page-text">${page.text}</p>
            ${page.alt ? `<div class="page-alt">🎨 ${page.alt}</div>` : ''}
          </div>
        </article>
      `).join('')}
    </div>
    
    <footer>
      <h3>📊 Tehnične specifikacije</h3>
      <div class="specs">
        <div class="spec-item">
          <div class="spec-label">Trim velikost</div>
          <div class="spec-value">${manifest.kdp.trim_in.w}" × ${manifest.kdp.trim_in.h}"</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Bleed</div>
          <div class="spec-value">${manifest.kdp.bleed_in}" na vseh straneh</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">DPI</div>
          <div class="spec-value">${manifest.kdp.print_dpi}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Slikovna velikost</div>
          <div class="spec-value">${manifest.dimensions.img_w_px} × ${manifest.dimensions.img_h_px} px</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Starost</div>
          <div class="spec-value">${manifest.age_band} let</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Jezik</div>
          <div class="spec-value">${manifest.meta.language}</div>
        </div>
      </div>
      <p style="margin-top: 30px; opacity: 0.8;">
        🤖 Avtomatsko generirano s Picture Book Production Agent<br>
        ✨ Pripravljeno za Amazon KDP
      </p>
    </footer>
  </div>
</body>
</html>`;

// Write HTML file
fs.writeFileSync(outputPath, html);

console.log(`\n✅ Web preview created!`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`🌐 Open in browser to view\n`);

// Update manifest
manifest.meta.log.push({
  timestamp: new Date().toISOString(),
  action: "Web preview generated",
  details: `Created HTML preview with ${previewPages.length} pages`
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
