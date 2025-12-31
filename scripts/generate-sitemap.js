/**
 * Sitemap Generator for NerDism
 * Run with: node scripts/generate-sitemap.js
 * This fetches all published posts from Firebase and generates sitemap.xml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Admin SDK (for server-side access)
// You'll need to set up a service account for this
// For now, we'll create a static sitemap with dynamic routes

const SITE_URL = 'https://ner-dism.vercel.app';

const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
];

function generateSitemap(posts = []) {
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach(page => {
        xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add blog posts
    posts.forEach(post => {
        xml += `  <url>
    <loc>${SITE_URL}/post/${post.slug}</loc>
    <lastmod>${post.updatedAt || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    return xml;
}

// For now, generate a basic sitemap
// In production, this would fetch posts from Firebase
const sitemap = generateSitemap([]);

// Write to public folder
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log('✅ Sitemap generated at:', outputPath);
