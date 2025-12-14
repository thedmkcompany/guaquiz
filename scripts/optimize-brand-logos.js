/**
 * Brand Logo Image Optimization Script
 *
 * This script optimizes all brand logos in /public/brand-logos/ by:
 * - Resizing to max height of 200px (suitable for retina displays)
 * - Converting to WebP format (80% quality)
 * - Outputting to /public/brand-logos-optimized/
 *
 * Expected size reduction: ~90% (4MB → 400KB)
 *
 * Usage: node scripts/optimize-brand-logos.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/brand-logos');
const outputDir = path.join(__dirname, '../public/brand-logos-optimized');

console.log('\n🖼️  DMK Brand Logo Optimization\n');
console.log('━'.repeat(50));

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✅ Created output directory: ${outputDir}\n`);
} else {
  console.log(`📁 Output directory exists: ${outputDir}\n`);
}

// Check if input directory exists
if (!fs.existsSync(inputDir)) {
  console.error(`❌ Input directory not found: ${inputDir}`);
  process.exit(1);
}

// Get all files in input directory
const files = fs.readdirSync(inputDir);
const imageFiles = files.filter(file =>
  file.match(/\.(jpg|jpeg|png)$/i)
);

if (imageFiles.length === 0) {
  console.log('⚠️  No image files found to optimize.');
  process.exit(0);
}

console.log(`Found ${imageFiles.length} images to optimize:\n`);

let processedCount = 0;
let errorCount = 0;
let totalSizeBefore = 0;
let totalSizeAfter = 0;

// Process each image
const processPromises = imageFiles.map(file => {
  const inputPath = path.join(inputDir, file);
  const outputFilename = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const outputPath = path.join(outputDir, outputFilename);

  // Get input file size
  const inputStats = fs.statSync(inputPath);
  totalSizeBefore += inputStats.size;

  return sharp(inputPath)
    .resize(200, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(info => {
      processedCount++;
      totalSizeAfter += info.size;

      const inputSizeKB = (inputStats.size / 1024).toFixed(1);
      const outputSizeKB = (info.size / 1024).toFixed(1);
      const reduction = (((inputStats.size - info.size) / inputStats.size) * 100).toFixed(0);

      console.log(`✅ ${file}`);
      console.log(`   → ${outputFilename}`);
      console.log(`   ${inputSizeKB}KB → ${outputSizeKB}KB (${reduction}% reduction)\n`);
    })
    .catch(err => {
      errorCount++;
      console.error(`❌ Error optimizing ${file}:`, err.message, '\n');
    });
});

// Wait for all processing to complete
Promise.all(processPromises).then(() => {
  console.log('━'.repeat(50));
  console.log('\n📊 Optimization Summary:\n');
  console.log(`   Total files processed: ${processedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total size before: ${(totalSizeBefore / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total size after: ${(totalSizeAfter / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total reduction: ${(((totalSizeBefore - totalSizeAfter) / totalSizeBefore) * 100).toFixed(1)}%`);
  console.log('\n✨ Optimization complete!\n');

  if (processedCount > 0) {
    console.log('Next steps:');
    console.log('1. Update /src/components/MobileLogoLoop.tsx to use optimized images');
    console.log('2. Update image paths from .png/.jpg to .webp');
    console.log('3. Test the logo loop on mobile devices');
    console.log('4. Delete /public/brand-logos/ after verifying everything works\n');
  }
});
