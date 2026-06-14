// 构建前脚本——生成 RSS、背景图清单、复制管理后台
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const BG_DIR = path.join(ROOT, 'public', 'images', 'bg');
const SITE_URL = 'https://quenuy.top';

function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data } = matter(raw);
    return {
      title: data.title || '未命名',
      date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date || ''),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      excerpt: data.excerpt || '',
      slug: data.slug || file.replace('.md', ''),
    };
  });
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

function generateRSS() {
  const posts = getAllPosts();
  const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const items = posts.map(p => {
    const pubDate = new Date(p.date + 'T08:00:00+08:00').toUTCString();
    const tagsRSS = p.tags.map(t => `        <category>${escapeXml(t)}</category>`).join('\n');
    return `
    <item>
        <title>${escapeXml(p.title)}</title>
        <link>${SITE_URL}/posts/${p.slug}/</link>
        <guid>${SITE_URL}/posts/${p.slug}/</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[<p>${escapeXml(p.excerpt || '')}</p>]]></description>
${tagsRSS}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>却nuy的个人博客</title>
    <link>${SITE_URL}</link>
    <description>读西塞罗，写代码。没有赋能和闭环，只有一个人慢慢想清楚的东西。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  fs.writeFileSync(path.join(ROOT, 'public', 'rss.xml'), rss);
  console.log(`✅ RSS 已生成 (${posts.length} 篇文章)`);
}

function generateBgManifest() {
  if (!fs.existsSync(BG_DIR)) { console.log('⚠️ 背景图目录不存在'); return; }
  const files = fs.readdirSync(BG_DIR)
    .filter(f => /^bg\d+\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)![0]) - parseInt(b.match(/\d+/)![0]));

  const manifest = `// 自动生成，请勿手动编辑
window.__BG_FILES__ = ${JSON.stringify(files, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, 'public', 'js', 'bg-manifest.js'), manifest);
  console.log(`✅ 背景图清单: ${files.length} 张`);
}

function copyAdminToPublic() {
  const adminSrc = path.join(ROOT, 'admin');
  const adminDst = path.join(ROOT, 'public', 'admin');
  if (!fs.existsSync(adminSrc)) return;
  fs.cpSync(adminSrc, adminDst, { recursive: true });
  console.log('✅ 管理后台已复制到 public/admin/');
}

console.log('🔨 构建前任务...');
generateRSS();
generateBgManifest();
copyAdminToPublic();

// 确保 .nojekyll 存在（防止 GitHub Pages Jekyll 忽略 _next 目录）
fs.writeFileSync(path.join(ROOT, 'public', '.nojekyll'), '');
console.log('✅ .nojekyll 已就位');

console.log('✅ 完成\n');
