type RgbColourType = [red: number, green: number, blue: number];
type HslColourType = [hue: number, saturation: number, blue: number];

export function rgbToHsl(color: RgbColourType | null): HslColourType | null {
  if (!color) return null;
  const [r, g, b] = color;
  if (!r || !g || !b) return null;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const saturation =
    max === min
      ? 0
      : lightness > 0.5
      ? (max - min) / (2 - max - min)
      : (max - min) / (max + min);
  const hue =
    max === min
      ? 0
      : max === r
      ? (g - b) / (max - min) + (g < b ? 6 : 0)
      : max === g
      ? (b - r) / (max - min) + 2
      : (r - g) / (max - min) + 4;
  return [
    Math.round(hue * 60),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ];
}
