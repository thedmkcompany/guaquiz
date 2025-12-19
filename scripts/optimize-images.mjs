#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts all images to WebP format with aggressive compression
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir, unlink } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

// Configuration
const CONFIG = {
  // Quality settings (0-100)
  webpQuality: 80,
  jpegQuality: 85,

  // Max dimensions for different use cases
  hero: { width: 1200, height: 1200 },
  standard: { width: 800, height: 800 },
  thumbnail: { width: 400, height: 400 },

  // Skip files smaller than this
  skipBelowKB: 50,

  // Extensions to process
  extensions: ['.png', '.jpg', '.jpeg'],
};

// Directories to scan
const DIRS = [
  'images/DMK',
  'images/misc',
  'images/circle',
  'brand-logos',
];

async function getFilesRecursive(dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await getFilesRecursive(fullPath));
      } else if (CONFIG.extensions.includes(extname(entry.name).toLowerCase())) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.warn(`Could not read directory: ${dir}`);
  }
  return files;
}

async function optimizeImage(filePath) {
  const stats = await stat(filePath);
  const sizeKB = stats.size / 1024;
  const ext = extname(filePath).toLowerCase();
  const name = basename(filePath, ext);
  const dir = dirname(filePath);

  // Determine target size based on filename hints
  let maxSize = CONFIG.standard;
  if (name.toLowerCase().includes('hero')) {
    maxSize = CONFIG.hero;
  } else if (name.toLowerCase().includes('thumb') || sizeKB < 200) {
    maxSize = CONFIG.thumbnail;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Calculate resize if needed
    let resizeOpts = {};
    if (metadata.width > maxSize.width || metadata.height > maxSize.height) {
      resizeOpts = {
        width: maxSize.width,
        height: maxSize.height,
        fit: 'inside',
        withoutEnlargement: true,
      };
    }

    // Create WebP version
    const webpPath = join(dir, `${name}.webp`);
    const webpBuffer = await image
      .resize(resizeOpts.width, resizeOpts.height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: CONFIG.webpQuality, effort: 6 })
      .toBuffer();

    // Also create optimized JPEG fallback
    const jpgPath = join(dir, `${name}.jpg`);
    const jpgBuffer = await sharp(filePath)
      .resize(resizeOpts.width, resizeOpts.height, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true })
      .toBuffer();

    // Save files
    await sharp(webpBuffer).toFile(webpPath);

    // Only save JPG if it's a new file or smaller
    if (ext !== '.jpg' || jpgBuffer.length < stats.size) {
      await sharp(jpgBuffer).toFile(jpgPath);
    }

    const webpSizeKB = webpBuffer.length / 1024;
    const jpgSizeKB = jpgBuffer.length / 1024;
    const savings = ((1 - webpSizeKB / sizeKB) * 100).toFixed(1);

    console.log(`✓ ${basename(filePath)}`);
    console.log(`  Original: ${sizeKB.toFixed(0)}KB → WebP: ${webpSizeKB.toFixed(0)}KB (${savings}% smaller)`);
    console.log(`  JPG fallback: ${jpgSizeKB.toFixed(0)}KB`);

    return {
      original: filePath,
      webp: webpPath,
      jpg: jpgPath,
      originalSize: sizeKB,
      webpSize: webpSizeKB,
      jpgSize: jpgSizeKB,
    };
  } catch (err) {
    console.error(`✗ Failed to process ${filePath}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('Configuration:');
  console.log(`  WebP Quality: ${CONFIG.webpQuality}`);
  console.log(`  JPEG Quality: ${CONFIG.jpegQuality}`);
  console.log(`  Hero Max: ${CONFIG.hero.width}x${CONFIG.hero.height}`);
  console.log(`  Standard Max: ${CONFIG.standard.width}x${CONFIG.standard.height}\n`);

  const allFiles = [];
  for (const dir of DIRS) {
    const fullDir = join(PUBLIC, dir);
    const files = await getFilesRecursive(fullDir);
    allFiles.push(...files);
  }

  console.log(`Found ${allFiles.length} images to process\n`);

  // Process only large files (>100KB)
  const toProcess = [];
  for (const file of allFiles) {
    const stats = await stat(file);
    if (stats.size > 100 * 1024) {
      toProcess.push(file);
    }
  }

  console.log(`Processing ${toProcess.length} images larger than 100KB\n`);

  const results = [];
  for (const file of toProcess) {
    const result = await optimizeImage(file);
    if (result) results.push(result);
  }

  // Summary
  console.log('\n📊 Summary:');
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalWebP = results.reduce((sum, r) => sum + r.webpSize, 0);
  const totalSavings = totalOriginal - totalWebP;

  console.log(`  Total Original: ${(totalOriginal / 1024).toFixed(2)} MB`);
  console.log(`  Total WebP: ${(totalWebP / 1024).toFixed(2)} MB`);
  console.log(`  Savings: ${(totalSavings / 1024).toFixed(2)} MB (${((totalSavings / totalOriginal) * 100).toFixed(1)}%)`);

  console.log('\n✅ Done! Update your code to use .webp extensions.');
}

main().catch(console.error);
