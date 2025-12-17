#!/usr/bin/env tsx
/**
 * Upload images and videos to Vercel Blob Storage
 *
 * This script migrates large media files from the public folder to Vercel Blob,
 * reducing git repository size from 87MB to ~3MB.
 *
 * Usage:
 *   npm run upload-cdn              # Upload all files
 *   npm run upload-cdn -- --dry-run # Preview without uploading
 *   npm run upload-cdn -- --force   # Re-upload existing files
 *
 * Prerequisites:
 *   1. Set BLOB_READ_WRITE_TOKEN in .env.local (get from Vercel dashboard)
 *   2. Run: npm install
 */

import 'dotenv/config';
import { put, list } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';
import { getAllCDNImagePaths } from '../src/lib/cdn';

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

interface UploadResult {
  file: string;
  url: string;
  size: number;
  status: 'uploaded' | 'exists' | 'skipped' | 'error';
  error?: string;
}

function normalizePublicPath(p: string): string {
  // Inputs can be `/images/foo.png` or `images/foo.png`
  return p.startsWith('/') ? p.slice(1) : p;
}

function toPublicUrlPath(publicPath: string): string {
  const clean = normalizePublicPath(publicPath);
  return `/${clean}`;
}

function isMediaFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return (
    ext === '.png' ||
    ext === '.jpg' ||
    ext === '.jpeg' ||
    ext === '.webp' ||
    ext === '.gif' ||
    ext === '.mp4' ||
    ext === '.webm'
  );
}

function walkDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkDir(full));
    } else if (entry.isFile() && isMediaFile(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function discoverPublicImages(): string[] {
  const imagesDir = path.join(PUBLIC_DIR, 'images');
  const files = walkDir(imagesDir);
  return files
    .map((full) => path.relative(PUBLIC_DIR, full).replace(/\\/g, '/'))
    .map((rel) => `/${rel}`);
}

/**
 * Check if Vercel Blob token is configured
 */
function checkBlobToken(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ ERROR: BLOB_READ_WRITE_TOKEN not found in environment');
    console.error('');
    console.error('To fix:');
    console.error('  1. Go to Vercel Dashboard > Your Project > Storage');
    console.error('  2. Create a new Blob store (if needed)');
    console.error('  3. Copy the token');
    console.error('  4. Add to .env.local:');
    console.error('     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx');
    console.error('');
    process.exit(1);
  }
}

/**
 * Get file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Check if file already exists in Blob storage
 */
async function fileExistsInBlob(pathname: string): Promise<boolean> {
  try {
    const key = normalizePublicPath(pathname);
    const { blobs } = await list({ prefix: key });
    return blobs.length > 0;
  } catch {
    return false;
  }
}

/**
 * Upload a single file to Vercel Blob
 */
async function uploadFile(
  relativePath: string
): Promise<UploadResult> {
  const publicPath = normalizePublicPath(relativePath);
  const fullPath = path.join(PUBLIC_DIR, publicPath);
  const result: UploadResult = {
    file: toPublicUrlPath(publicPath),
    url: '',
    size: 0,
    status: 'skipped',
  };

  // Check if file exists locally
  if (!fs.existsSync(fullPath)) {
    result.status = 'error';
    result.error = 'File not found';
    return result;
  }

  // Get file size
  const stats = fs.statSync(fullPath);
  result.size = stats.size;

  // Check if already uploaded (unless force flag)
  if (!FORCE) {
    const exists = await fileExistsInBlob(publicPath);
    if (exists) {
      result.status = 'exists';
      return result;
    }
  }

  // Dry run - don't actually upload
  if (DRY_RUN) {
    result.status = 'uploaded';
    const base = process.env.NEXT_PUBLIC_BLOB_BASE_URL || 'https://[blob-base-url]';
    result.url = `${base.replace(/\/+$/, '')}/${publicPath}`;
    return result;
  }

  // Upload to Vercel Blob
  try {
    const fileBuffer = fs.readFileSync(fullPath);
    const blob = await put(publicPath, fileBuffer, {
      access: 'public',
      addRandomSuffix: false, // Keep original filename
    });

    result.status = 'uploaded';
    result.url = blob.url;
  } catch (error) {
    result.status = 'error';
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return result;
}

/**
 * Main upload function
 */
async function main() {
  console.log('🚀 Vercel Blob Upload Script\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be uploaded\n');
  } else {
    checkBlobToken();
  }

  // Get all files to upload (explicit list + auto-discovery under public/images)
  const explicit = getAllCDNImagePaths();
  const discovered = discoverPublicImages();
  const filesToUpload = Array.from(new Set([...explicit, ...discovered]));
  console.log(`📦 Found ${filesToUpload.length} files to migrate\n`);

  // Upload files
  const results: UploadResult[] = [];
  let totalSize = 0;
  let uploadedSize = 0;
  let detectedBaseUrl: string | null = null;

  for (let i = 0; i < filesToUpload.length; i++) {
    const file = filesToUpload[i];
    const num = `[${i + 1}/${filesToUpload.length}]`;

    process.stdout.write(`${num} Uploading ${file}... `);

    const result = await uploadFile(file);
    results.push(result);
    totalSize += result.size;

    if (result.status === 'uploaded') {
      uploadedSize += result.size;
      console.log(`✅ ${formatFileSize(result.size)}`);

      if (!DRY_RUN && !detectedBaseUrl && result.url) {
        try {
          detectedBaseUrl = new URL(result.url).origin;
        } catch {
          // ignore
        }
      }
    } else if (result.status === 'exists') {
      console.log(`⏭️  Already exists`);
    } else if (result.status === 'error') {
      console.log(`❌ ${result.error}`);
    } else {
      console.log(`⏭️  Skipped`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary\n');

  const uploaded = results.filter((r) => r.status === 'uploaded').length;
  const existing = results.filter((r) => r.status === 'exists').length;
  const errors = results.filter((r) => r.status === 'error').length;

  console.log(`Total files:     ${filesToUpload.length}`);
  console.log(`✅ Uploaded:     ${uploaded} (${formatFileSize(uploadedSize)})`);
  console.log(`⏭️  Already exist: ${existing}`);
  console.log(`❌ Errors:       ${errors}`);
  console.log(`📦 Total size:   ${formatFileSize(totalSize)}`);

  if (DRY_RUN) {
    console.log('\n💡 This was a dry run. Run without --dry-run to actually upload.');
  } else if (uploaded > 0) {
    console.log('\n✅ Upload complete!');

    if (detectedBaseUrl) {
      console.log('\nSet this in Vercel env (Public):');
      console.log(`  NEXT_PUBLIC_BLOB_BASE_URL=${detectedBaseUrl}`);
    }

    console.log('\nNext steps:');
    console.log('  1. Add NEXT_PUBLIC_BLOB_BASE_URL to Vercel environment');
    console.log('  2. Update image paths in components to use getCDNUrl()');
    console.log('  3. Run: git rm --cached public/images/...');
    console.log('  4. Add large files to .gitignore');
    console.log('  5. Deploy to Vercel');
  }

  // Show errors if any
  if (errors > 0) {
    console.log('\n❌ Errors:');
    results
      .filter((r) => r.status === 'error')
      .forEach((r) => {
        console.log(`  ${r.file}: ${r.error}`);
      });
  }

  console.log('='.repeat(60) + '\n');
}

// Run script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
