import path from 'path';

import { Database } from 'src/types';

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'User-Agent': 'obsidian/zotero',
  Accept: 'application/json',
  Connection: 'keep-alive',
};

export function getPort(database: Database) {
  return database === 'Zotero' ? '23119' : '24119';
}

export async function mkMDDir(mdPath: string) {
  const dir = path.dirname(mdPath);

  if (await app.vault.adapter.exists(dir)) return;

  await app.vault.createFolder(dir);
}

const toSpaceRegEx = /\s*[*?]+\s*/g;
const toDashRegEx = /\s*[:"<>|]+\s*/g;

export function replaceIllegalChars(str: string) {
  return str
    .replace(toSpaceRegEx, ' ')
    .trim()
    .replace(toDashRegEx, ' - ')
    .trim();
}

export function sanitizeFilePath(filePath: string) {
  const parsed = path.parse(filePath);
  const dir = replaceIllegalChars(parsed.dir);
  const name = replaceIllegalChars(parsed.name);
  return path.join(dir, `${name}${parsed.ext}`).split(path.sep).join('/');
}

function hexToHSL(str: string) {
  let rStr = '0',
    gStr = '0',
    bStr = '0';

  if (str.length == 4) {
    rStr = '0x' + str[1] + str[1];
    gStr = '0x' + str[2] + str[2];
    bStr = '0x' + str[3] + str[3];
  } else if (str.length == 7) {
    rStr = '0x' + str[1] + str[2];
    gStr = '0x' + str[3] + str[4];
    bStr = '0x' + str[5] + str[6];
  }

  const r = +rStr / 255;
  const g = +gStr / 255;
  const b = +bStr / 255;

  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;

  let h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
}

export function getColorCategory(hex: string) {
  const { h, s, l } = hexToHSL(hex);

  // define color category based on HSL
  if (l < 12) {
    return 'Black';
  }
  if (l > 98) {
    return 'White';
  }
  if (s < 2) {
    return 'Gray';
  }
  if (h < 15) {
    return 'Red';
  }
  if (h < 45) {
    return 'Orange';
  }
  if (h < 65) {
    return 'Yellow';
  }
  if (h < 170) {
    return 'Green';
  }
  if (h < 190) {
    return 'Cyan';
  }
  if (h < 263) {
    return 'Blue';
  }
  if (h < 280) {
    return 'Purple';
  }
  if (h < 335) {
    return 'Magenta';
  }
  return 'Red';
}
