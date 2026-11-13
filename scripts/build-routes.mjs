/* Static-route builder — run with: node scripts/build-routes.mjs
 *
 * The site is a single index.html plus a client-side router, so /work/<id>/ has
 * no file of its own: on a static host (GitHub Pages, S3, …) those URLs answer
 * 404 and search engines cannot index each case study separately. This writes
 *   • one index.html per route (same page, canonical pointing at its own URL),
 *   • 404.html (the app; it shows its own not-found page, kept out of the index),
 *   • sitemap.xml and robots.txt.
 *
 * The domain is taken from index.html's <link rel="canonical">, so once the real
 * domain is in index.html just re-run this script: everything stays in sync.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const site = (/<link rel="canonical" href="([^"]+)"/.exec(html) || [])[1];
if (!site || !/^https?:\/\//.test(site)) {
  console.error('✗ No canonical domain found in index.html (needs an absolute URL)');
  process.exit(1);
}
const base = site.replace(/\/+$/, '');

/* Los proyectos salen del contenido real (content.js es sólo datos), así que un
   proyecto nuevo se publica solo: su ruta, su sitemap y sus datos estructurados.
   Evaluarlo (en vez de parsear el texto con regex) evita que un cambio de
   formato rompa el build. */
const contentSrc = readFileSync(join(root, 'js/content.js'), 'utf8');
const sandbox = { window: {} };
new Function('window', 'document', 'location', contentSrc)(
  sandbox.window,
  { querySelector: () => null, querySelectorAll: () => [] },
  { href: base + '/' }
);
const SITE = sandbox.window.SITE;
const projects = SITE.projects || [];
const routes = ['/work/', ...projects.map((p) => `/work/${p.id}/`), '/about/'];
/* Páginas de texto que se escriben a mano (no las genera este script): sólo se
   suman al sitemap. Hoy: la política de privacidad, que abre en su propia
   pestaña y por eso vive fuera del router del sitio. */
const staticPages = ['/privacy/'];

const pointingAt = (source, url) =>
  source
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);

/* el contenido trae <b>…</b> etc: los datos estructurados van en texto plano */
const plain = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const esEmpresa = (c) => !!c && !/^Personal/i.test(c);
const anio = (y) => (/^\d{4}$/.test(String(y || '')) ? String(y) : null);

/* ===== Datos estructurados por página =====
   Le dicen a Google qué es cada página sin que se vea nada en pantalla: el caso,
   su video, quién lo hizo y cómo se llega hasta ahí. Es lo que permite que salgan
   los enlaces con título, imagen y (si hay video) una ficha de video en la
   búsqueda. Todo sale del contenido real, así que se mantiene solo. */
function structuredData (p) {
  const url = `${base}/work/${p.id}/`;
  const keywords = [...new Set([...(p.metaTags || []), ...(p.tags || []), p.category, p.client, p.role, 'Julia Arena'])]
    .filter(Boolean)
    .join(', ');
  const graph = [
    {
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      name: p.name,
      headline: plain(p.intro),
      description: `${plain(p.intro)} ${plain(p.outcome)}`.trim(),
      genre: p.category,
      keywords,
      url,
      image: base + p.imgs[0],
      author: { '@type': 'Person', name: 'Julia Arena', jobTitle: 'Product Designer', url: `${base}/about/` },
      creator: { '@type': 'Person', name: 'Julia Arena' },
      inLanguage: 'en',
      ...(anio(p.year) ? { dateCreated: anio(p.year) } : {}),
      ...(esEmpresa(p.client) ? { sourceOrganization: { '@type': 'Organization', name: p.client.replace(/\.+$/, '') } } : {}),
      ...((p.metaTags || []).length ? { about: p.metaTags.map((t) => ({ '@type': 'Thing', name: t })) } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` },
        { '@type': 'ListItem', position: 2, name: 'Work', item: `${base}/work/` },
        { '@type': 'ListItem', position: 3, name: p.name, item: url },
      ],
    },
  ];
  if (p.moveVideo && p.moveVideo.src) {
    graph.push({
      '@type': 'VideoObject',
      name: `${p.name} — product walkthrough`,
      description: `${plain(p.intro)} Product walkthrough of the ${p.category} case study, designed by Julia Arena.`.trim(),
      thumbnailUrl: base + (p.moveVideo.poster || p.imgs[0]),
      contentUrl: base + p.moveVideo.src,
      ...(anio(p.year) ? { uploadDate: `${anio(p.year)}-01-01` } : {}),
      author: { '@type': 'Person', name: 'Julia Arena', url: `${base}/about/` },
      ...(esEmpresa(p.client) ? { publisher: { '@type': 'Organization', name: p.client.replace(/\.+$/, '') } } : {}),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

const aboutData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Julia Arena — Product Designer',
  url: `${base}/about/`,
  inLanguage: 'en',
  mainEntity: {
    '@type': 'Person',
    name: 'Julia Arena',
    jobTitle: 'Product Designer',
    url: `${base}/`,
    knowsAbout: (SITE.profile && SITE.profile.knowsAbout) || undefined,
  },
};

/* se inyecta justo antes de </head>, como texto plano (no se ve en la página) */
const withStructuredData = (source, data) =>
  source.replace(
    '</head>',
    `    <script type="application/ld+json">\n      ${JSON.stringify(data, null, 2).split('\n').join('\n      ')}\n    </script>\n  </head>`
  );

for (const r of routes) {
  const dir = join(root, r.slice(1));
  mkdirSync(dir, { recursive: true });
  const project = projects.find((p) => `/work/${p.id}/` === r);
  let out = pointingAt(html, base + r);
  if (project) out = withStructuredData(out, structuredData(project));
  else if (r === '/about/') out = withStructuredData(out, aboutData);
  writeFileSync(join(dir, 'index.html'), out);
  const nota = project ? '  (datos estructurados del caso)' : r === '/about/' ? '  (datos estructurados)' : '';
  console.log('✓ ' + r + nota);
}

writeFileSync(
  join(root, '404.html'),
  pointingAt(html, base + '/').replace(
    '<meta name="robots" content="index, follow, max-image-preview:large" />',
    '<meta name="robots" content="noindex, follow" />'
  )
);
console.log('✓ 404.html');

const urls = ['/', ...routes, ...staticPages];
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(root, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          '  <url>\n' +
          `    <loc>${base}${u}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          '  </url>'
      )
      .join('\n') +
    '\n</urlset>\n'
);
console.log(`✓ sitemap.xml (${urls.length} urls)`);

writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log('✓ robots.txt');

/* En GitHub Pages el dominio propio se declara con un archivo CNAME en la raíz
   del repo. Se escribe solo cuando el dominio ya NO es el de github.io, así que
   al cambiar el dominio y volver a correr esto queda todo listo. */
const host = base.replace(/^https?:\/\//, '');
if (!/\.github\.io$/i.test(host)) {
  writeFileSync(join(root, 'CNAME'), host + '\n');
  console.log('✓ CNAME (' + host + ')');
}
console.log('\ndomain: ' + base);
