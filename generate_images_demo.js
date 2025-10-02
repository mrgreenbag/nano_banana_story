import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * DEMO MODE - Generate placeholder images to demonstrate the workflow
 * In production, this would call the real Gemini API
 */

/**
 * Generate a demo placeholder image with text
 */
async function generateDemoImage(pageNum, text, outputPath) {
  try {
    console.log(`🎨 Generating demo image: ${path.basename(outputPath)}`);
    
    // Create a colorful gradient placeholder
    const colors = [
      { r: 255, g: 179, b: 217 }, // pink
      { r: 184, g: 230, b: 255 }, // sky blue
      { r: 255, g: 244, b: 179 }, // yellow
      { r: 201, g: 255, b: 179 }, // mint green
      { r: 230, g: 204, b: 255 }, // lavender
      { r: 255, g: 212, b: 179 }, // peach
    ];
    
    const colorIndex = (pageNum - 1) % colors.length;
    const color = colors[colorIndex];
    
    // Create SVG with text
    const svg = `
      <svg width="2625" height="2625" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(${color.r},${color.g},${color.b});stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(${Math.max(0, color.r - 30)},${Math.max(0, color.g - 30)},${Math.max(0, color.b - 30)});stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="2625" height="2625" fill="url(#grad)" />
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" 
              stroke="rgba(0,0,0,0.3)" stroke-width="2">
          Stran ${pageNum}
        </text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="50" fill="rgba(255,255,255,0.9)"
              text-length="2200" lengthAdjust="spacingAndGlyphs">
          ${text}
        </text>
        <text x="50%" y="90%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="40" fill="rgba(255,255,255,0.7)"
              font-style="italic">
          [DEMO - Gemini API illustration would be here]
        </text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Saved: ${outputPath}`);
    
    // Create 1024px preview
    await createPreview(outputPath);
    return outputPath;
    
  } catch (error) {
    console.error(`❌ Error generating demo image: ${error.message}`);
    throw error;
  }
}

/**
 * Create a 1024px preview version using sharp
 */
async function createPreview(originalPath) {
  try {
    const previewPath = originalPath.replace(/\.png$/, "-preview-1024.png");
    
    await sharp(originalPath)
      .resize(1024, 1024, { fit: "cover" })
      .png()
      .toFile(previewPath);
    
    console.log(`   📐 Preview created: ${path.basename(previewPath)}`);
    
  } catch (error) {
    console.error(`   ⚠️  Preview creation failed: ${error.message}`);
  }
}

/**
 * Build complete image prompt (saved to manifest for future real generation)
 */
function buildPrompt(pageData, styleCard, characterBible) {
  const character = characterBible[0]; // Luna
  
  return `${styleCard}

Page ${pageData.index} of "Luna in Mavrica Barv". Age band 3-5 years.

Scene: ${pageData.scene_description}

Character: ${character.name} - ${character.species}, ${character.age}. ${character.colors.hair}, wearing ${character.colors.outfit}. ${character.notes}

Continuity: ${pageData.continuity}

Framing: Square format (1:1 aspect ratio), centered composition with breathing room, low camera angle (child's eye view). Keep text-safe margins at top or bottom third.

Mood: ${pageData.mood}

Quality: High-detail watercolor illustration, clean soft edges, no watermark text, no photorealism, children's book illustration style only.

Aspect ratio: 1:1 (square).`;
}

// Load manifest
const manifestPath = "/workspace/book/book_manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

// Page scene descriptions
const pageScenes = [
  {
    index: 1,
    scene_description: "Luna standing in a garden full of colorful flowers and butterflies. She is smiling widely with her arms spread open in joy. The background has soft pastel flowers in various colors.",
    continuity: "Morning light, sunny day, outdoor garden setting",
    mood: "joyful and welcoming"
  },
  {
    index: 2,
    scene_description: "Luna holding a big red apple in both hands, looking at it with wonder. A few more red items around her - a red balloon floating nearby, red flowers.",
    continuity: "Same garden, morning light, Luna in yellow dress",
    mood: "curious and delighted"
  },
  {
    index: 3,
    scene_description: "Luna looking up at a bright yellow sun in a light blue sky. Sun has a friendly smiling face. Luna is shielding her eyes with one hand, smiling.",
    continuity: "Outdoor, sunny morning, Luna's yellow dress matches the sun",
    mood: "bright and cheerful"
  },
  {
    index: 4,
    scene_description: "Luna kneeling down in grass, reaching to touch a large orange flower (like a marigold or zinnia). The flower is at her eye level.",
    continuity: "Garden setting, morning light continues, green grass visible",
    mood: "gentle and discovering"
  },
  {
    index: 5,
    scene_description: "Luna sitting cross-legged on soft green grass, running her hands through it. Grass is lush and vivid green. Small white daisies scattered around.",
    continuity: "Same garden, Luna still in yellow dress, sunny day",
    mood: "peaceful and content"
  },
  {
    index: 6,
    scene_description: "Luna lying on her back on the grass, looking up at a beautiful clear blue sky with a few fluffy white clouds drifting by.",
    continuity: "Garden, green grass beneath her, continuation of peaceful moment",
    mood: "dreamy and calm"
  },
  {
    index: 7,
    scene_description: "Luna standing with one hand raised, watching a purple butterfly flying past her face. The butterfly is large and detailed with beautiful purple wings.",
    continuity: "Garden setting, Luna back standing, sunny day continues",
    mood: "wonder and amazement"
  },
  {
    index: 8,
    scene_description: "Luna with her nose close to a large pink rose, eyes closed, smiling as she smells it. The rose is in soft focus with delicate petals.",
    continuity: "Garden, morning light, Luna's yellow dress, peaceful atmosphere",
    mood: "gentle and sensory"
  },
  {
    index: 9,
    scene_description: "Luna pointing excitedly at a beautiful rainbow arcing across the sky after a light rain. Her expression is pure joy and excitement. Small raindrops glisten.",
    continuity: "Garden, slight wetness from rain, clearing sky with rainbow",
    mood: "exciting and magical"
  },
  {
    index: 10,
    scene_description: "Close-up of the rainbow's warm colors - vivid red at top, orange in middle, yellow below. Luna in corner looking up at these colors with awe.",
    continuity: "Rainbow still visible, Luna observing, post-rain garden",
    mood: "warm and vibrant"
  },
  {
    index: 11,
    scene_description: "Close-up of the rainbow's cool colors - green, blue, and purple bands. Luna reaching up as if trying to touch the colors.",
    continuity: "Same rainbow moment, Luna's gesture of reaching, garden setting",
    mood: "cool and magical"
  },
  {
    index: 12,
    scene_description: "Full rainbow visible in arc across the entire scene, all seven colors visible. Luna in center with arms raised in celebration. Garden sparkles with rainbow light.",
    continuity: "Complete rainbow moment, garden full of color reflections, Luna joyful",
    mood: "celebratory and magical"
  },
  {
    index: 13,
    scene_description: "Luna jumping with both feet into a puddle, water splashing up around her. Mid-jump action shot, her face shows pure joy and playfulness.",
    continuity: "Garden ground, wet from rain, Luna's dress and shoes visible, rainbow still faint in background",
    mood: "playful and energetic"
  },
  {
    index: 14,
    scene_description: "The puddle water splashing shows all rainbow colors reflected in the droplets and water. Luna standing in puddle looking down at the colorful water around her feet.",
    continuity: "Same puddle moment, Luna in it, rainbow reflections in water, garden setting",
    mood: "magical and colorful"
  },
  {
    index: 15,
    scene_description: "Close-up of Luna's happy face, big smile showing her joy. Background soft-focused with hints of all the colors she discovered - bokeh effect with rainbow colors.",
    continuity: "Portrait moment, garden behind her, late morning light, all colors present subtly",
    mood: "warm and satisfying"
  },
  {
    index: 16,
    scene_description: "Wide shot of Luna in the garden surrounded by all the colors - red flowers, orange blooms, yellow sun, green grass, blue sky, purple butterflies, pink roses. She stands with arms open wide. Rainbow faintly visible.",
    continuity: "Full garden view, all elements from previous pages visible, complete scene, morning completing",
    mood: "joyful celebration of color"
  }
];

// Main generation function
async function generateAllImagesDemo() {
  console.log("\n🎨 Starting DEMO image generation for 'Luna in Mavrica Barv'\n");
  console.log("⚠️  DEMO MODE - Using placeholder images (Gemini API key not set)\n");
  console.log(`📚 Total pages: ${manifest.pages_count}`);
  console.log(`🎯 Target size: ${manifest.dimensions.img_w_px}x${manifest.dimensions.img_h_px}px\n`);
  
  const styleCard = manifest.style_card;
  const characterBible = manifest.character_bible;
  
  for (let i = 0; i < manifest.pages.length; i++) {
    const page = manifest.pages[i];
    const sceneData = pageScenes[i];
    
    console.log(`\n━━━ PAGE ${page.index}/16 ━━━`);
    console.log(`Text: "${page.text}"`);
    
    // Build prompt (save for future real generation)
    const prompt = buildPrompt(sceneData, styleCard, characterBible);
    manifest.pages[i].image_prompt = prompt;
    
    // Generate demo image
    const imagePath = `/workspace/book/images/page-${String(page.index).padStart(3, "0")}.png`;
    
    try {
      await generateDemoImage(page.index, page.text, imagePath);
      manifest.pages[i].image_path = imagePath;
      
      // Add alt text
      manifest.pages[i].alt = `Page ${page.index}: ${sceneData.scene_description}`;
      
      // Save updated manifest after each generation
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
    } catch (error) {
      console.error(`Failed to generate page ${page.index}: ${error.message}`);
      manifest.pages[i].image_path = "";
      manifest.pages[i].alt = `Error generating image for page ${page.index}`;
    }
    
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Final manifest update with log entry
  manifest.meta.log.push({
    timestamp: new Date().toISOString(),
    action: "DEMO image generation completed",
    details: `Generated ${manifest.pages.filter(p => p.image_path).length}/${manifest.pages_count} demo placeholder images. Ready for real Gemini API generation.`
  });
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log("\n✅ DEMO image generation complete!");
  console.log(`📁 Images saved to: /workspace/book/images/`);
  console.log(`\n💡 To generate real AI illustrations:`);
  console.log(`   1. Set your GEMINI_API_KEY: export GEMINI_API_KEY="your-key-here"`);
  console.log(`   2. Run: npm run render\n`);
}

// Run
generateAllImagesDemo().catch(console.error);
