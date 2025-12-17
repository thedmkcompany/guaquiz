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
    const { blobs } = await list({ prefix: pathname });
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
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  const result: UploadResult = {
    file: relativePath,
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
    const exists = await fileExistsInBlob(relativePath);
    if (exists) {
      result.status = 'exists';
      return result;
    }
  }

  // Dry run - don't actually upload
  if (DRY_RUN) {
    result.status = 'uploaded';
    result.url = `https://[blob-url]${relativePath}`;
    return result;
  }

  // Upload to Vercel Blob
  try {
    const fileBuffer = fs.readFileSync(fullPath);
    const blob = await put(relativePath, fileBuffer, {
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

  // Get all files to upload
  const filesToUpload = getAllCDNImagePaths();
  console.log(`📦 Found ${filesToUpload.length} files to migrate\n`);

  // Upload files
  const results: UploadResult[] = [];
  let totalSize = 0;
  let uploadedSize = 0;

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
    console.log('\nNext steps:');
    console.log('  1. Add NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN to Vercel environment');
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
