# public-posts

Public posts (MDX + images) for [vickysold.com](https://vickysold.com).

This repository manages blog/article content separately from the main site, enabling independent content workflows and CI validation.

## Folder structure

```
posts/
  en/             # English posts (primary — full frontmatter)
  vi/             # Vietnamese translations (minimal frontmatter)
  es/             # Spanish translations
  ko/             # Korean translations
images/           # Shared images (.jpg + .webp + .avif)
scripts/          # Validation & utility scripts
.github/          # CI workflows, CODEOWNERS, PR template
```

## Internationalization (i18n)

The site supports **4 locales**: English, Vietnamese, Spanish, and Korean.

### How locales work

- **English (`posts/en/`)** is the primary source of truth. Each English post has full frontmatter: `title`, `slug`, `author`, `date`, `heroImage`, `tags`, `relatedArticles`, etc.
- **Translation files** (`posts/vi/`, `posts/es/`, `posts/ko/`) only need locale-specific fields: `slug`, `title`, `description`, `category`, `readTime`. Shared fields are inherited from the English file during Firestore sync.
- The **slug must match** across all locales for the same article (e.g., `posts/en/my-article.mdx` and `posts/vi/my-article.mdx` both have `slug: "my-article"`).
- Images in `images/` are shared across all locales.

### Adding a new post

```bash
# 1. Create the English post
cp posts/en/_template.mdx posts/en/your-article-slug.mdx

# 2. (Optional) Add translations
cp posts/vi/_template.mdx posts/vi/your-article-slug.mdx
cp posts/es/_template.mdx posts/es/your-article-slug.mdx
cp posts/ko/_template.mdx posts/ko/your-article-slug.mdx
```

You don't need all locales at once — the site falls back to English for any missing translation.

### Adding a translation to an existing post

Create a new file in the target locale directory with the **same filename** as the English post:

```bash
cp posts/vi/_template.mdx posts/vi/existing-article-slug.mdx
# Edit with translated title, description, category, readTime, and body content
```

## How it works

1. Authors add or edit MDX posts in `posts/{locale}/` and images in `images/`.
2. CI validates frontmatter fields and checks that image variants exist.
3. On merge to `main`, the [notify workflow](.github/workflows/notify.yml):
   - Sends a `repository_dispatch` to `phuanh004/vickysold.com` for page revalidation
   - Calls the `/api/sync-posts` webhook to sync post metadata to Firestore

### Sync process

The sync endpoint iterates each locale directory (`posts/en/`, `posts/vi/`, `posts/es/`, `posts/ko/`), parses frontmatter, and builds a merged Firestore document per slug:

```
posts/{slug}
  slug, author, date, heroImage, tags, relatedArticles, ...  ← from English
  locales:
    en: { title, description, category, readTime, contentUrl }
    vi: { title, description, category, readTime, contentUrl }
    es: { ... }
    ko: { ... }
```

The main site's `resolvePost(doc, locale)` function reads this structure and falls back through: requested locale → English → legacy flat fields.

## Frontmatter reference

### English posts — required fields (CI enforced)

| Field | Type | Rules |
|---|---|---|
| `title` | string | Non-empty, descriptive headline |
| `slug` | string | Lowercase alphanumeric + hyphens only |
| `author` | string | Non-empty author name |
| `date` | string | ISO 8601 format (`YYYY-MM-DD`) |

### Translation posts — required fields (CI enforced)

| Field | Type | Rules |
|---|---|---|
| `title` | string | Translated headline |
| `slug` | string | Must match the English post's slug |

### Optional fields (recommended for English)

| Field | Purpose |
|---|---|
| `authorTitle` | Author's role/position |
| `authorAvatar` | Path to author photo (e.g., `/images/vicky-chen.jpg`) |
| `authorBio` | Short author bio (1-2 sentences) |
| `authorLink` | Link to author profile page |
| `category` | Article category |
| `readTime` | Estimated reading time |
| `description` | SEO description (60-160 chars) |
| `heroImage` | Path to hero banner image |
| `heroAlt` | Alt text for hero image |
| `tags` | Tags for article discovery |
| `relatedArticles` | Up to 3 related articles with slug, title, category, readTime, image |

### Optional fields (recommended for translations)

| Field | Purpose |
|---|---|
| `description` | Translated SEO description |
| `category` | Translated category name |
| `readTime` | Translated reading time (e.g., `"5 phút đọc"`) |

## MDX content guide

### Headings

Use `##` (H2) for main sections. The `title` from frontmatter renders as the H1.

### Pull quotes

```mdx
> "The best negotiators don't fight for the last dollar."
```

### Script/dialogue boxes

````mdx
```script
Agent: "I understand you have several strong offers..."
```
````

### Images

```mdx
![Description](/images/my-image.jpg)
```

Images are served from GitHub raw CDN and rendered with Next.js `<Image>`.

## Images

Every source image needs **three** files:

```
images/my-article-hero.jpg       # Original
images/my-article-hero.webp      # WebP variant
images/my-article-hero.avif      # AVIF variant
```

CI will fail if any variant is missing.

| Type | Recommended size | Aspect ratio |
|---|---|---|
| Hero image | 2100 x 900 px | 21:9 |
| Inline image | 1080 x 720 px | 3:2 |
| Author avatar | 400 x 400 px | 1:1 |
| Article card | 800 x 450 px | 16:9 |

Generate variants with the main site's `pnpm run images:prepare` or manually:

```bash
cwebp -q 80 images/my-photo.jpg -o images/my-photo.webp
avifenc --min 20 --max 40 images/my-photo.jpg images/my-photo.avif
```

## Local development

```bash
# Install dependencies
npm install gray-matter glob

# Validate frontmatter (locale-aware: English requires full fields, translations require slug + title)
node scripts/validate-frontmatter.mjs

# Verify image variants
node scripts/verify-images.mjs
```

## Secrets

The following secrets must be configured in **Settings > Secrets and variables > Actions**:

| Secret | Purpose |
|---|---|
| `REPO_DISPATCH_TOKEN` | GitHub PAT with `repo` scope — used to send `repository_dispatch` to the main site |
| `SITE_URL` | Production URL of the main site (e.g., `https://vickysold.com`) |
| `POSTS_SYNC_SECRET` | Shared secret for the sync-posts webhook — must match `POSTS_SYNC_SECRET` in the main site's `.env.local` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide on writing posts, adding images, and the PR process.
