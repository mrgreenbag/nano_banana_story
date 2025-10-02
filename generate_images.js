import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate image using Gemini 2.5 Flash Image Preview model
 * Following official docs: https://ai.google.dev/gemini-api/docs/image-generation
 */
async function generateImage(prompt, outputPath) {
  try {
    console.log(`🎨 Generating image: ${path.basename(outputPath)}`);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    // Extract image data from response
    const response = result.response;
    
    // Check for inline image data in parts
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Decode base64 and save
          const imageBuffer = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(outputPath, imageBuffer);
          console.log(`✅ Saved: ${outputPath}`);
          
          // Create 1024px preview
          await createPreview(outputPath);
          return outputPath;
        }
      }
    }
    
    throw new Error("No image data found in response");
    
  } catch (error) {
    console.error(`❌ Error generating image: ${error.message}`);
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
 * Build complete image prompt with style card and character bible
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

// Page scene descriptions and continuity notes
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
async function generateAllImages() {
  console.log("\n🎨 Starting image generation for 'Luna in Mavrica Barv'\n");
  console.log(`📚 Total pages: ${manifest.pages_count}`);
  console.log(`🎯 Target size: ${manifest.dimensions.img_w_px}x${manifest.dimensions.img_h_px}px\n`);
  
  const styleCard = manifest.style_card;
  const characterBible = manifest.character_bible;
  
  for (let i = 0; i < manifest.pages.length; i++) {
    const page = manifest.pages[i];
    const sceneData = pageScenes[i];
    
    console.log(`\n━━━ PAGE ${page.index}/16 ━━━`);
    console.log(`Text: "${page.text}"`);
    
    // Build prompt
    const prompt = buildPrompt(sceneData, styleCard, characterBible);
    
    // Save prompt to manifest
    manifest.pages[i].image_prompt = prompt;
    
    // Generate image
    const imagePath = `/workspace/book/images/page-${String(page.index).padStart(3, "0")}.png`;
    
    try {
      await generateImage(prompt, imagePath);
      manifest.pages[i].image_path = imagePath;
      
      // Add alt text
      manifest.pages[i].alt = `Page ${page.index}: ${sceneData.scene_description}`;
      
      // Save updated manifest after each successful generation
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
    } catch (error) {
      console.error(`Failed to generate page ${page.index}: ${error.message}`);
      manifest.pages[i].image_path = "";
      manifest.pages[i].alt = `Error generating image for page ${page.index}`;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Final manifest update with log entry
  manifest.meta.log.push({
    timestamp: new Date().toISOString(),
    action: "Image generation completed",
    details: `Generated ${manifest.pages.filter(p => p.image_path).length}/${manifest.pages_count} images`
  });
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log("\n✅ Image generation complete!");
  console.log(`📁 Images saved to: /workspace/book/images/`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllImages().catch(console.error);
}

export { generateImage, buildPrompt };
