import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'icons');

const sizes = [192, 512];

async function generatePngIcons() {
  mkdirSync(join(publicDir, 'png'), { recursive: true });

  for (const size of sizes) {
    const svgContent = readFileSync(join(publicDir, `icon-${size}x${size}.svg`), 'utf-8');
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toBuffer();
    writeFileSync(join(publicDir, 'png', `icon-${size}x${size}.png`), pngBuffer);
    console.log(`Generated icon-${size}x${size}.png`);

    const maskableSvgContent = readFileSync(join(publicDir, `icon-${size}x${size}-maskable.svg`), 'utf-8');
    const maskablePngBuffer = await sharp(Buffer.from(maskableSvgContent))
      .resize(size, size)
      .png()
      .toBuffer();
    writeFileSync(join(publicDir, 'png', `icon-${size}x${size}-maskable.png`), maskablePngBuffer);
    console.log(`Generated icon-${size}x${size}-maskable.png`);
  }
}

generatePngIcons().catch(console.error);
