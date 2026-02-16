## What does this PR add or change?

<!-- Briefly describe the post or image changes -->

## Locales included

<!-- Check which locales are included in this PR -->

- [ ] English (`posts/en/`)
- [ ] Vietnamese (`posts/vi/`)
- [ ] Spanish (`posts/es/`)
- [ ] Korean (`posts/ko/`)

## Checklist

- [ ] English post has all required frontmatter fields (`title`, `slug`, `author`, `date`)
- [ ] Translation posts have required fields (`title`, `slug`) matching the English post
- [ ] Slug is URL-safe (lowercase alphanumeric + hyphens)
- [ ] Date is valid ISO 8601 format
- [ ] Images include `.webp` and `.avif` variants alongside the source
- [ ] Ran `node scripts/validate-frontmatter.mjs` locally (passes)
- [ ] Ran `node scripts/verify-images.mjs` locally (passes)
