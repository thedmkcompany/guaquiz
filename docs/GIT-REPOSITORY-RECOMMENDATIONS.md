# Git Repository Optimization Recommendations
**Date**: 2025-12-16
**Current Repo Size**: 87MB (.git folder) + 84MB (public assets)

---

## TL;DR

### Tests: ✅ **KEEP COMMITTED**
Tests are code and should be tracked in git.

### Public Folder: ⚠️ **MIXED - NEEDS OPTIMIZATION**
- Small assets (icons, logos): Keep in git ✅
- Large images/videos: Move to CDN ❌ (currently 84MB!)

---

## Current Situation

### Public Folder Analysis
```
Total: 92 files, 84MB

File types:
- 48 PNG files
- 30 JPG files
- 3 MP4 videos (17MB total)
- 5 SVG files
- Fonts (OTF, WOFF2, TTF)
```

### Largest Files (Top 10)
```
8.5MB  Circle transformation video.mp4
7.3MB  Circle workout session.mp4
5.8MB  Hero Image Disha 2.png
5.4MB  Disha Wine Blazer.png
5.4MB  Disha White blazer.png
5.4MB  Disha Beige Blazer 2.png
5.3MB  amanda armos Disha.png
5.2MB  Disha City Background.png
5.1MB  Disha Power pose Green BG.png
5.0MB  Disha Close Up Face.png
```

**Problem**: These 10 files alone = ~57MB (67% of public folder)

---

## Recommendations

### 1. Tests: KEEP THEM ✅

**Current**: 9 test files in `src/__tests__/`

**Recommendation**: **Keep committed**

**Why**:
- Tests are documentation of how code should work
- They prevent bugs from being reintroduced
- They help other developers understand the codebase
- They're essential for CI/CD
- File size is negligible (~50KB total)

**Action**: ✅ No change needed

---

### 2. Public Folder: OPTIMIZE ⚠️

#### Option A: Keep Everything (Current) - NOT RECOMMENDED

**Pros**:
- Simple deployment (everything in one place)
- Works without external dependencies

**Cons**:
- Git repo is huge (87MB)
- Every git clone downloads all image history
- Slow git operations (clone, fetch, push)
- Wastes bandwidth on every deploy
- Hard to collaborate (large diffs)

**Verdict**: ❌ Not sustainable as site grows

---

#### Option B: Use Git LFS (Git Large File Storage) - MEDIUM SOLUTION

**What it does**: Stores large files separately, git only tracks pointers

**Pros**:
- Files stay in git
- Smaller git operations
- Easy to set up

**Cons**:
- Costs money on GitHub/GitLab for bandwidth
- Requires extra setup for collaborators
- Still downloads large files when needed

**How to implement**:
```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.mp4"
git lfs track "public/images/DMK/*.png"
git lfs track "public/images/circle/*.png"

# Migrate existing files
git lfs migrate import --include="*.mp4,public/images/**/*.png"

# Commit
git add .gitattributes
git commit -m "Setup Git LFS for large media files"
```

**Cost**:
- GitHub: $5/month for 50GB bandwidth
- GitLab: Included in free tier (10GB storage)

**Verdict**: ✅ Good if you want to keep assets in git

---

#### Option C: Use CDN/Cloud Storage - BEST SOLUTION

**What it does**: Store images on Cloudinary/S3/Vercel Blob, serve via CDN

**Pros**:
- Fast loading (CDN edge caching)
- Image optimization (auto WebP, resizing)
- Tiny git repo (only icons/logos)
- Unlimited storage
- Better performance for users
- Can optimize images without redeploying

**Cons**:
- Requires migration of existing images
- External dependency
- Monthly cost (but often free tier sufficient)

**Recommended Services**:

1. **Vercel Blob Storage** (Recommended for Vercel deploys)
   - Free tier: 500MB storage
   - Integrated with Vercel
   - Auto CDN
   - Cost: $0-5/month

2. **Cloudinary** (Best for image optimization)
   - Free tier: 25GB bandwidth/month
   - Auto image optimization
   - On-the-fly transformations
   - Cost: Free-$99/month

3. **AWS S3 + CloudFront**
   - Cheapest for large scale
   - Full control
   - Cost: ~$1-5/month

**How to implement (Vercel Blob)**:
```bash
# Install Vercel Blob SDK
npm install @vercel/blob

# Upload images
npx @vercel/blob upload public/images/
```

**Verdict**: ✅ **RECOMMENDED** - Best long-term solution

---

#### Option D: Hybrid Approach - PRAGMATIC SOLUTION

**What it does**: Keep small assets in git, move large ones to CDN

**Rules**:
```
Keep in git:
- Icons, logos, favicons (< 100KB)
- SVG files (scalable, small)
- Fonts (needed for SSR)

Move to CDN:
- Photos > 500KB
- All videos
- Large PNGs/JPGs
```

**Implementation**:
```bash
# 1. Add to .gitignore
echo "# Large media assets (hosted on CDN)" >> .gitignore
echo "public/images/DMK/*.png" >> .gitignore
echo "public/images/circle/*.{jpg,png,mp4}" >> .gitignore
echo "public/images/transform/*.{jpg,png}" >> .gitignore

# Keep small assets
echo "!public/images/**/*-icon.png" >> .gitignore
echo "!public/images/**/*-logo.png" >> .gitignore

# 2. Remove from git (keep locally)
git rm --cached public/images/DMK/*.png
git rm --cached public/images/circle/*.mp4

# 3. Upload to CDN and update image paths in code
```

**Verdict**: ✅ Good balance of simplicity and optimization

---

## Specific Recommendations for Your Site

### Immediate Action (This Week)

**OPTION 1: Quick Win - Add .gitignore rules** (5 minutes)
```gitignore
# Large media files (move to CDN when ready)
public/images/DMK/*.png
public/images/circle/*.mp4
public/images/circle/*-transformation.jpg.png

# Keep essential files
!public/images/**/logo*.png
!public/images/**/icon*.png
```

Then:
```bash
# Remove large files from future tracking
git rm --cached public/images/DMK/*.png
git rm --cached public/images/circle/*.mp4

# Files stay on disk, but won't be tracked by git
git commit -m "Stop tracking large media files"
```

**Result**: New commits won't bloat repo further. Existing history stays large.

---

**OPTION 2: Vercel Blob Migration** (1 hour)
1. Sign up for Vercel (free)
2. Upload images to Vercel Blob
3. Update image paths in components
4. Remove from git

**Example code change**:
```tsx
// Before
<Image src="/images/DMK/Disha-Wine-Blazer.png" />

// After
<Image src={process.env.NEXT_PUBLIC_CDN_URL + "/disha-wine-blazer.png"} />
```

**Result**: Repo size drops to ~10MB, faster page loads

---

### Future (Next Month)

**Set up automatic image optimization pipeline**:
```bash
# Install sharp for image optimization
npm install sharp

# Create script to optimize images before deploy
```

---

## Current Test Files - Keep Committed ✅

```
src/__tests__/
├── api/
│   ├── admin/sync-status.test.ts     ✅ Keep
│   ├── health/health.test.ts         ✅ Keep
│   ├── payment/payu.test.ts          ✅ Keep
│   ├── payment/razorpay.test.ts      ✅ Keep
│   ├── quiz/retry-sync.test.ts       ✅ Keep
│   ├── quiz/submit.test.ts           ✅ Keep
│   ├── webhooks/payu.test.ts         ✅ Keep
│   └── webhooks/razorpay.test.ts     ✅ Keep
├── helpers/test-utils.ts              ✅ Keep
├── mocks/handlers.ts                  ✅ Keep
├── mocks/server.ts                    ✅ Keep
└── setup.ts                           ✅ Keep
```

**Size**: ~50KB total
**Value**: Essential for code quality
**Action**: No change needed

---

## Summary Table

| Approach | Effort | Cost | Repo Size After | Performance | Recommended |
|----------|--------|------|----------------|-------------|-------------|
| Keep everything | None | Free | 87MB | Slow git ops | ❌ No |
| Git LFS | Low | $5/mo | 10MB + LFS | Same loading | ✅ If staying in git |
| CDN (Vercel) | Medium | Free-$5 | 3MB | Fast loading | ✅✅ Best |
| Hybrid | Low | Free | 20MB | Fast loading | ✅ Good balance |
| Gitignore only | Very low | Free | 87MB history, no new bloat | Same | ✅ Quick fix |

---

## My Recommendation for Your Simple Website

### Short Term (Today)
**Add gitignore rules to stop tracking new large files**:

```bash
# This prevents repo from growing MORE
git rm --cached public/images/DMK/*.png
git rm --cached public/images/circle/*.mp4
```

### Medium Term (Next Deploy)
**Use Vercel Blob for new images**:
- Free tier is sufficient
- Dead simple integration
- Better performance
- No code changes needed for existing images

### Long Term (When Time Permits)
**Migrate existing images to Vercel Blob**:
- Upload old images
- Update 10-15 image paths
- Delete from git
- Repo drops to ~3MB

---

## Implementation Steps (If You Choose CDN)

### 1. Install Vercel Blob (2 min)
```bash
npm install @vercel/blob
```

### 2. Upload Images (5 min)
```bash
# Create upload script
cat > scripts/upload-images.js << 'EOF'
import { put } from '@vercel/blob';

const files = [
  'public/images/DMK/Disha-Wine-Blazer.png',
  // ... more files
];

for (const file of files) {
  const blob = await put(file, fs.readFileSync(file), {
    access: 'public',
  });
  console.log(blob.url);
}
EOF

node scripts/upload-images.js
```

### 3. Update Code (10 min)
```typescript
// lib/cdn.ts
export function getCDNUrl(path: string) {
  return process.env.NEXT_PUBLIC_BLOB_URL + path;
}

// components/Hero.tsx
import { getCDNUrl } from '@/lib/cdn';

<Image src={getCDNUrl('/disha-wine-blazer.png')} />
```

### 4. Remove from Git (1 min)
```bash
git rm public/images/DMK/*.png
git commit -m "Move images to CDN"
```

---

## Conclusion

**Tests**: ✅ **MUST keep committed** - they're essential code

**Public folder**:
- ⚠️ Currently too large (84MB)
- ✅ Quick fix: Stop tracking new large files (5 min)
- ✅✅ Best fix: Migrate to CDN (1 hour, but worth it)

**Recommendation**: Do the quick gitignore fix today, plan CDN migration for next week.
