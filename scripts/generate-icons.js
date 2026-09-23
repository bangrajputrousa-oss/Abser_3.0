import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Exact SVG of the uploaded icon: White rounded squircle with dark green Absher emblem
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- White squircle background matching uploaded image -->
  <rect width="512" height="512" rx="100" fill="#ffffff" />
  
  <!-- Absher Green Logo elements -->
  <g fill="#0B5D36">
    <!-- 3 upper dots for the letter sheen (ش) -->
    <circle cx="196" cy="140" r="17" />
    <circle cx="248" cy="140" r="17" />
    <circle cx="300" cy="140" r="17" />

    <!-- Bar 1 (leftmost, letter raa ر extending downward) -->
    <rect x="126" y="174" width="36" height="268" rx="18" />

    <!-- Bar 2 -->
    <rect x="178" y="174" width="36" height="212" rx="18" />

    <!-- Bar 3 -->
    <rect x="230" y="174" width="36" height="212" rx="18" />

    <!-- Bar 4 (under letter baa ب) -->
    <rect x="282" y="174" width="36" height="212" rx="18" />

    <!-- Bar 5 (rightmost, tall Alif أ with angled calligraphic top) -->
    <path d="M 334,124 C 334,106 350,92 368,90 L 370,90 L 370,368 C 370,378 362,386 352,386 C 342,386 334,378 334,368 Z" />

    <!-- Bottom single dot for the letter baa (ب) -->
    <circle cx="300" cy="424" r="17" />
  </g>
</svg>
`;

// Maskable icon with safe-zone margin (Android standard: 10-15% margin)
const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#ffffff" />
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <g fill="#0B5D36">
      <circle cx="196" cy="140" r="17" />
      <circle cx="248" cy="140" r="17" />
      <circle cx="300" cy="140" r="17" />
      <rect x="126" y="174" width="36" height="268" rx="18" />
      <rect x="178" y="174" width="36" height="212" rx="18" />
      <rect x="230" y="174" width="36" height="212" rx="18" />
      <rect x="282" y="174" width="36" height="212" rx="18" />
      <path d="M 334,124 C 334,106 350,92 368,90 L 370,90 L 370,368 C 370,378 362,386 352,386 C 342,386 334,378 334,368 Z" />
      <circle cx="300" cy="424" r="17" />
    </g>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  
  // Write icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

  // Generate 512x512
  await sharp(Buffer.from(svgIcon))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Generate 192x192
  await sharp(Buffer.from(svgIcon))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Generate apple-touch-icon 180x180
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate maskable 512x512
  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('App icons successfully generated from uploaded image design!');
}

generate().catch(console.error);
