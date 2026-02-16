# Contributing

Thank you for contributing content to vickysold.com! This guide walks you through creating a post from start to finish.

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/phuanh004/public-posts.git
cd public-posts

# 2. Create a branch
git checkout -b post/your-article-slug

# 3. Add your English post file
cp posts/en/_template.mdx posts/en/your-article-slug.mdx

# 4. (Optional) Add translations
cp posts/vi/_template.mdx posts/vi/your-article-slug.mdx
cp posts/es/_template.mdx posts/es/your-article-slug.mdx
cp posts/ko/_template.mdx posts/ko/your-article-slug.mdx

# 5. Add images (original + optimized variants)
#    Place .jpg, .webp, and .avif in images/

# 6. Validate locally
npm install gray-matter glob
node scripts/validate-frontmatter.mjs
node scripts/verify-images.mjs

# 7. Commit and push
git add posts/ images/
git commit -m "post: your article title"
git push -u origin post/your-article-slug

# 8. Open a PR against main
```

---

## Writing a post

### Directory structure

Posts are organized by locale in subdirectories:

```
posts/
  en/                  ← English (primary, full frontmatter)
  vi/                  ← Vietnamese (translated, minimal frontmatter)
  es/                  ← Spanish
  ko/                  ← Korean
```

The English file is the primary source. Translations only need `slug`, `title`, `description`, `category`, and `readTime` — shared fields like `author`, `date`, `heroImage`, `tags`, and `relatedArticles` are inherited from the English file during sync.

### 1. Create the English file

Create a new `.mdx` file in `posts/en/`. The filename should match the slug:

```
posts/en/your-article-slug.mdx
```

### 2. Add frontmatter (English)

Every English post starts with a YAML frontmatter block between `---` fences:

```mdx
---
title: "5 Negotiation Scripts That Win Multiple Offer Situations"
slug: "5-negotiation-scripts"
author: "Vicky Nga"
authorTitle: "Founder & Team Leader"
authorAvatar: "/images/vicky-chen.jpg"
authorBio: "Vicky helps ambitious real estate agents build thriving businesses."
authorLink: "/team/vicky-nga"
date: "2026-01-21"
category: "Agent Success Strategies"
readTime: "5 min read"
description: "Learn proven negotiation scripts for winning in competitive multiple-offer scenarios without alienating sellers."
heroImage: "/images/leadership-retreat-recap.jpg"
heroAlt: "Team workshop on negotiation strategies"
tags:
  - Negotiation
  - Scripts
  - SanDiegoRealEstate
  - Training
relatedArticles:
  - slug: "how-to-get-first-10-listings"
    title: "How to Get Your First 10 Listings Without Cold Calling"
    category: "Training"
    readTime: "7 min read"
    image: "/images/how-to-get-first-10-listings.jpg"
---
```

### 2b. Add frontmatter (translations)

Translation files only need locale-specific fields. Shared fields are inherited from English:

```mdx
---
slug: "5-negotiation-scripts"
title: "5 Kịch Bản Đàm Phán Giúp Thắng Trong Tình Huống Nhiều Đề Xuất"
description: "Kịch bản và hướng dẫn đàm phán giúp thắng trong tình huống nhiều đề xuất."
category: "Chiến Lược Thành Công Cho Đại Lý"
readTime: "5 phút đọc"
---
```

### Frontmatter field reference

#### Required fields — English posts (CI enforced)

| Field | Type | Rules | Example |
|---|---|---|---|
| `title` | string | Non-empty, descriptive headline | `"5 Negotiation Scripts That Win"` |
| `slug` | string | Lowercase alphanumeric + hyphens only | `"5-negotiation-scripts"` |
| `author` | string | Non-empty author name | `"Vicky Nga"` |
| `date` | string | ISO 8601 format (YYYY-MM-DD) | `"2026-01-21"` |

#### Required fields — Translation posts (CI enforced)

| Field | Type | Rules | Example |
|---|---|---|---|
| `title` | string | Translated headline | `"5 Kịch Bản Đàm Phán..."` |
| `slug` | string | Same slug as English (must match) | `"5-negotiation-scripts"` |

#### Recommended fields

| Field | Type | Purpose | Example |
|---|---|---|---|
| `authorTitle` | string | Author's role/position | `"Founder & Team Leader"` |
| `authorAvatar` | string | Path to author photo | `"/images/vicky-chen.jpg"` |
| `authorBio` | string | Short author bio (1-2 sentences) | `"Vicky helps agents build..."` |
| `authorLink` | string | Link to author profile page | `"/team/vicky-nga"` |
| `category` | string | Article category (see list below) | `"Agent Success Strategies"` |
| `readTime` | string | Estimated reading time | `"5 min read"` |
| `description` | string | SEO description (60-160 chars) | `"Learn proven negotiation scripts..."` |
| `heroImage` | string | Path to hero banner image | `"/images/my-hero.jpg"` |
| `heroAlt` | string | Alt text for hero image | `"Workshop in progress"` |
| `tags` | string[] | Tags for article discovery | `["Negotiation", "Training"]` |
| `relatedArticles` | object[] | Up to 3 related articles | See example above |

#### Categories

Use one of these standard categories (translate for locale files):

- `Agent Success Strategies`
- `Training`
- `Market News`
- `Team`

### 3. Write the content

After the frontmatter, write your article body in MDX. You can use standard Markdown plus JSX components.

#### Headings

Use `##` (H2) for main sections. Do not use `#` (H1) — the title from frontmatter is the H1.

```mdx
## The Psychology of the Ask

Your paragraph here...

## Script 1: The Empathy Bridge

Another section...
```

#### Paragraphs

Write naturally. The first paragraph is styled as an intro (larger, serif font) on the site.

```mdx
In the San Diego market, it's not uncommon to face five or more competing
offers on a desirable property. The scripts below will help you stand out.
```

#### Pull quotes

Use blockquotes for pull quotes (highlighted with accent border on the site):

```mdx
> "The best negotiators don't fight for the last dollar — they create
> deals where both sides walk away feeling like they won."
```

#### Images

Reference images from the `images/` directory:

```mdx
![Offer acceptance rate chart](/images/offer-acceptance-rate-chart.jpg)
```

Images render full-width (aspect 21:12) with the `OptimizedImage` component on the site, which automatically serves `.avif` or `.webp` variants.

#### Lists

```mdx
- Start with empathy — acknowledge the seller's position
- Present your client's strengths (pre-approval, flexibility)
- Offer a personal letter only when appropriate
```

#### Script/dialogue boxes

Use fenced code blocks with the `script` language tag for dialogue-style content:

````mdx
```script
Agent: "I understand you have several strong offers. My client
genuinely loves this home — let me share why they're the right fit..."

Seller's Agent: "We appreciate that. What makes your offer stand out?"

Agent: "Beyond the competitive price, my client is pre-approved,
flexible on closing date, and waiving the appraisal contingency."
```
````

---

## Adding images

### File naming

Use SEO-friendly, lowercase, hyphenated names that describe the image:

```
sold-20k-over-asking-3482-palm-ave.jpg      (good)
IMG_2847.jpg                                  (bad)
Screenshot 2026-01-15.png                     (bad)
```

### Required formats

Every source image needs **three** files:

```
images/my-article-hero.jpg       # Original (required)
images/my-article-hero.webp      # WebP variant (required)
images/my-article-hero.avif      # AVIF variant (required)
```

CI will fail if any variant is missing.

### Image guidelines

| Type | Recommended size | Aspect ratio | Use |
|---|---|---|---|
| Hero image | 2100 x 900 px | 21:9 | Banner at top of article |
| Inline image | 1080 x 720 px | 3:2 | Within article body |
| Author avatar | 400 x 400 px | 1:1 | Author card |
| Article card | 800 x 450 px | 16:9 | Related articles grid |

### Generating optimized variants

If you have the main site cloned locally:

```bash
# From the vickysold.com repo
pnpm run images:prepare
```

Or manually with tools like `cwebp` and `avifenc`:

```bash
# WebP
cwebp -q 80 images/my-photo.jpg -o images/my-photo.webp

# AVIF
avifenc --min 20 --max 40 images/my-photo.jpg images/my-photo.avif
```

---

## Complete post example

Here's a full working example:

```mdx
---
title: "San Diego Q1 2026 Market Update"
slug: "sd-q1-2026-market-update"
author: "Vicky Nga"
authorTitle: "Founder & Team Leader"
authorAvatar: "/images/vicky-chen.jpg"
authorBio: "Vicky helps ambitious real estate agents build thriving businesses in San Diego."
authorLink: "/team/vicky-nga"
date: "2026-03-15"
category: "Market News"
readTime: "4 min read"
description: "San Diego's Q1 2026 housing market saw median prices rise 6.2% year-over-year with inventory still tight."
heroImage: "/images/sd-q1-2026-market-update.jpg"
heroAlt: "San Diego skyline with coastal homes"
tags:
  - MarketUpdate
  - SanDiego
  - Q12026
  - RealEstateData
relatedArticles:
  - slug: "5-negotiation-scripts"
    title: "5 Negotiation Scripts That Win Multiple Offer Situations"
    category: "Agent Success Strategies"
    readTime: "5 min read"
    image: "/images/leadership-retreat-recap.jpg"
---

The first quarter of 2026 brought both challenges and opportunities to
the San Diego real estate market. Here's what the numbers tell us.

## Median Home Prices

Median home prices in San Diego County reached $925,000 in Q1 2026,
a 6.2% increase year-over-year.

![Offer acceptance rate chart](/images/offer-acceptance-rate-chart.jpg)

## Inventory Levels

Active listings remain below historical averages, with just 1.8 months
of supply across the county.

> "Buyers who are prepared and pre-approved are winning in this market.
> Speed and flexibility matter more than ever."

## What This Means for Agents

- Price your listings competitively — overpriced homes are sitting longer
- Prep buyers with pre-approval before starting the search
- Multiple offers are still common in the $700K-$1M range
```

---

## Pull request process

1. **Branch** from `main` using the naming convention `post/your-slug`.
2. **Add** your `.mdx` file in `posts/en/` (and optionally `posts/vi/`, `posts/es/`, `posts/ko/`) and images in `images/`.
3. **Validate** locally:
   ```bash
   npm install gray-matter glob
   node scripts/validate-frontmatter.mjs
   node scripts/verify-images.mjs
   ```
4. **Push** and open a PR against `main`.
5. **CI runs automatically** — it validates frontmatter and checks image variants.
6. **A code owner reviews** your PR before merge.
7. **On merge**, the notify workflow dispatches an event to the main site to revalidate and sync all locales to Firestore.

## Commit message format

```
post: short description of the article

Add "Article Title" covering [topic]. Includes hero image
and X inline images.
```
