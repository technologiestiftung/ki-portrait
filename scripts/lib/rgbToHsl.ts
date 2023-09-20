import convert from "color-convert";

type RgbColourType = [red: number, green: number, blue: number];
type HslColourType = [hue: number, saturation: number, blue: number];

export function rgbToHsl(color: RgbColourType | null): HslColourType | null {
  if (!color) return null;
  return convert.rgb.hsl(color);
}
