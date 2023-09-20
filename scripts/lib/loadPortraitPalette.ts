import sharp from "sharp";
import { resolve } from "path";
import Vibrant from "node-vibrant";
import { rgbToHsl } from "./rgbToHsl.ts";

type HSLColor = [number, number, number];
type VibrantBuilder = ReturnType<typeof Vibrant.from>;
type VibrantPalette = Awaited<ReturnType<VibrantBuilder["getPalette"]>>;
type VibrantSwatch = VibrantPalette["Vibrant"];

export async function loadPortraitPalette(portraitId: string): Promise<{
  colorHue: number | undefined;
  colorSaturation: number | undefined;
  colorLightness: number | undefined;
  colorPalette: (HSLColor | undefined)[];
}> {
  const webpImageUrl = resolve(
    process.cwd(),
    `./public/images/${portraitId}.webp`
  );
  const webpToPngBuffer = await sharp(webpImageUrl).png().toBuffer();
  const palette = await Vibrant.from(webpToPngBuffer).getPalette();
  const [colorHue, colorSaturation, colorLightness] = parseVibrantColor(
    palette.Vibrant
  );
  return {
    colorHue,
    colorSaturation,
    colorLightness,
    colorPalette: [
      [colorHue, colorSaturation, colorLightness],
      parseVibrantColor(palette.DarkVibrant),
      parseVibrantColor(palette.LightVibrant),
    ],
  };
}

function parseVibrantColor(swatch: VibrantSwatch): HSLColor | undefined {
  if (!swatch) return undefined;
  const [hue, saturation, lightness] = swatch.getHsl();
  return [
    Math.round(hue * 360),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ];
}
