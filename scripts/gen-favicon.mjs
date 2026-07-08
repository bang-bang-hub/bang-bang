// One-off: generate brand favicon set from the white wordmark on a brand tile.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const LOGO = "public/images/logo/bang-bang-white.png";
const BG = { r: 0x2d, g: 0x18, b: 0x10, alpha: 1 }; // --color-bb-brown-dark

async function tile(size, padRatio = 0.14) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const logo = await sharp(LOGO)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

function buildIco(entries) {
  // entries: [{size, png}]
  const head = Buffer.alloc(6);
  head.writeUInt16LE(0, 0); // reserved
  head.writeUInt16LE(1, 2); // type = icon
  head.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  const parts = [head, dir];
  entries.forEach((e, i) => {
    const b = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 0);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, b + 1);
    dir.writeUInt8(0, b + 2); // palette
    dir.writeUInt8(0, b + 3); // reserved
    dir.writeUInt16LE(1, b + 4); // planes
    dir.writeUInt16LE(32, b + 6); // bpp
    dir.writeUInt32LE(e.png.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += e.png.length;
    parts.push(e.png);
  });
  return Buffer.concat(parts);
}

const icon512 = await tile(512);
const apple180 = await tile(180);
writeFileSync("src/app/icon.png", icon512);
writeFileSync("src/app/apple-icon.png", apple180);

const ico = buildIco([
  { size: 16, png: await tile(16, 0.08) },
  { size: 32, png: await tile(32, 0.1) },
  { size: 48, png: await tile(48, 0.12) },
]);
writeFileSync("src/app/favicon.ico", ico);

console.log("favicon set written: favicon.ico, icon.png, apple-icon.png");
