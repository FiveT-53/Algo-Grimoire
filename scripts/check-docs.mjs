import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Check versioned Markdown only; local drafts are deliberately excluded.
const files = execFileSync('git', ['ls-files', '-z', '*.md'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const errors = [];
const headings = new Map();
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  let fence = false;
  let previousLevel = 0;
  let titles = 0;
  const slugs = new Set();
  const counts = new Map();
  text.split(/\r?\n/).forEach((line, i) => {
    const fail = message => errors.push(`${file}:${i + 1}: ${message}`);
    if (/^\s*```/.test(line)) { fence = !fence; return; }
    if (fence) return;
    const h = /^(#{1,6})\s+(.+)$/.exec(line);
    if (h) {
      const level = h[1].length;
      if (level === 1) titles++;
      if (level > previousLevel + 1) fail('Heading level skipped');
      previousLevel = level;
      const slug = h[2].toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, '').replace(/ /g, '-');
      const count = counts.get(slug) ?? 0;
      slugs.add(slug + (count ? `-${count}` : ''));
      counts.set(slug, count + 1);
    }
    if (/^\s*>\s*-[^\s-]/.test(line)) fail('Missing space after quoted list marker');
    if (/\s+$/.test(line) && !/\S {2}$/.test(line)) fail('Trailing whitespace');
  });
  if (fence) errors.push(`${file}: Unclosed code fence`);
  if (titles !== 1) errors.push(`${file}: Expected exactly one H1`);
  headings.set(path.resolve(file), slugs);
}
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^[a-z]+:/i.test(target)) continue;
    const [relative, anchor] = target.split('#');
    const resolved = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : path.resolve(file);
    if (!fs.existsSync(resolved)) errors.push(`${file}: Missing target ${target}`);
    else if (anchor && headings.has(resolved) && !headings.get(resolved).has(decodeURIComponent(anchor))) {
      errors.push(`${file}: Missing heading ${target}`);
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`PASS: ${files.length} Markdown files (structure, local links, images, simple heading anchors). External URLs are not fetched.`);
