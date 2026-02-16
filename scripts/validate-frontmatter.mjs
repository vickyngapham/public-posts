import { readFileSync } from "fs";
import { globSync } from "glob";
import matter from "gray-matter";

// English posts require full frontmatter; locale translations only need slug + title
const EN_REQUIRED = ["title", "slug", "author", "date"];
const LOCALE_REQUIRED = ["title", "slug"];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const files = globSync("posts/**/*.mdx");

if (files.length === 0) {
  console.log("No MDX files found — skipping frontmatter validation.");
  process.exit(0);
}

let errors = 0;

for (const file of files) {
  // Skip template files
  if (file.includes("_template")) continue;

  const raw = readFileSync(file, "utf8");
  const { data } = matter(raw);

  // Determine if this is an English file or a locale translation
  const isEnglish = file.startsWith("posts/en/") || !file.match(/^posts\/(vi|es|ko)\//);
  const required = isEnglish ? EN_REQUIRED : LOCALE_REQUIRED;

  for (const field of required) {
    if (!data[field] || String(data[field]).trim() === "") {
      console.error(`${file}: missing or empty required field "${field}"`);
      errors++;
    }
  }

  if (data.slug && !SLUG_RE.test(data.slug)) {
    console.error(
      `${file}: slug "${data.slug}" is not URL-safe (use lowercase alphanumeric + hyphens)`
    );
    errors++;
  }

  if (data.date) {
    const d = new Date(data.date);
    if (isNaN(d.getTime())) {
      console.error(
        `${file}: date "${data.date}" is not valid ISO 8601`
      );
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\nValidation failed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`All ${files.length} MDX file(s) passed frontmatter validation.`);
}
