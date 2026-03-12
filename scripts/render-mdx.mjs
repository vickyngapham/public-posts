#!/usr/bin/env node

/**
 * Pre-renders MDX files to HTML for consumption by Cloudflare Workers
 * (which cannot use `new Function()` required by runtime MDX compilation).
 *
 * Reads: posts/{locale}/*.mdx
 * Writes: posts/{locale}/*.html (stripped of frontmatter, pure HTML body)
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join, basename} from 'node:path';
import remarkGfm from 'remark-gfm';

const LOCALES = ['en', 'vi', 'es', 'ko', 'zh'];
const POSTS_DIR = join(import.meta.dirname, '..', 'posts');

/** Strip YAML frontmatter from raw MDX content. */
function stripFrontmatter(raw) {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1] : raw;
}

/** Convert markdown/MDX source to static HTML string via unified pipeline. */
async function mdxToHtml(source) {
  const {default: rehypeStringify} = await import('rehype-stringify');
  const {default: remarkParse} = await import('remark-parse');
  const {default: remarkRehype} = await import('remark-rehype');
  const {unified} = await import('unified');

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeStringify, {allowDangerousHtml: true})
    .process(source);

  return String(result);
}

async function main() {
  let total = 0;

  for (const locale of LOCALES) {
    const localeDir = join(POSTS_DIR, locale);
    let files;
    try {
      files = await readdir(localeDir);
    } catch {
      continue; // locale directory doesn't exist yet
    }

    const mdxFiles = files.filter(
      (f) => f.endsWith('.mdx') && !f.startsWith('_')
    );

    for (const file of mdxFiles) {
      const mdxPath = join(localeDir, file);
      const htmlPath = join(localeDir, file.replace(/\.mdx$/, '.html'));

      const raw = await readFile(mdxPath, 'utf-8');
      const content = stripFrontmatter(raw);
      const html = await mdxToHtml(content);

      await writeFile(htmlPath, html, 'utf-8');
      total++;
      console.log(`  ${locale}/${file} -> ${basename(htmlPath)}`);
    }
  }

  console.log(`\nRendered ${total} files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
