export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export function parseHsl(value: string): HslColor {
  const parts = value.trim().replace(/%/g, '').split(/\s+/);

  return {
    h: Number.parseFloat(parts[0] ?? '0'),
    s: Number.parseFloat(parts[1] ?? '0'),
    l: Number.parseFloat(parts[2] ?? '0'),
  };
}

export function hslStr(h: number, s: number, l: number): string {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

export function hslToHex(value: string): string {
  const { h, s, l } = parseHsl(value);
  const saturation = s / 100;
  const lightness = l / 100;
  const a = saturation * Math.min(lightness, 1 - lightness);
  const toHex = (channel: number) => {
    const k = (channel + h / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${toHex(0)}${toHex(8)}${toHex(4)}`;
}

export function hexToHsl(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === r) {
      hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      hue = ((b - r) / delta + 2) / 6;
    } else {
      hue = ((r - g) / delta + 4) / 6;
    }
  }

  return hslStr(hue * 360, saturation * 100, lightness * 100);
}
