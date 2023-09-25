import sharp from "sharp";
import { resolve } from "path";
import Vibrant from "node-vibrant";
import getPixels from "get-pixels";
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
  const webpToPngBuffer = await sharp(webpImageUrl).jpeg().toBuffer();
  const pixels = await getPixelsFromImage(webpToPngBuffer);
  const avgs = getColorAverages(pixels);
  const palette = await Vibrant.from(webpToPngBuffer).getPalette();
  const [colorHue, colorSaturation, colorLightness] = parseVibrantColor(
    palette.Vibrant
  );
  console.log(`Extended color data for ${portraitId}:`);
  console.log(`  Hue: ${avgs.hue}`);
  console.log(`  Saturation: ${avgs.saturation}`);
  console.log(`  Lightness: ${avgs.lightness}`);
  console.log(`  Palette:`);
  console.log(`    Vibrant: ${palette.Vibrant.getHex()}`);
  console.log(`    DarkVibrant: ${palette.DarkVibrant.getHex()}`);
  console.log(`    LightVibrant: ${palette.LightVibrant.getHex()}`);
  return {
    colorHue: avgs.hue - (avgs.hue % 10),
    colorSaturation: avgs.saturation - (avgs.saturation % 10),
    colorLightness: avgs.lightness - (avgs.lightness % 10),
    colorPalette: [
      [colorHue, colorSaturation, colorLightness],
      parseVibrantColor(palette.DarkVibrant),
      parseVibrantColor(palette.LightVibrant),
    ],
  };
}

function getColorAverages(pixels: number[]): {
  hue: number;
  lightness: number;
  saturation: number;
} {
  const pixelCount = pixels.length / 3;
  let totalHue = 0;
  let totalLightness = 0;
  let totalSaturation = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const [red, green, blue] = pixels.slice(i, i + 4);
    const [hue, lightness, saturation] = rgbToHsl([red, green, blue]);
    totalHue += hue;
    totalLightness += lightness;
    totalSaturation += saturation;
  }
  const avgHue = totalHue / pixelCount;
  const avgLightness = totalLightness / pixelCount;
  const avgSaturation = totalSaturation / pixelCount;
  return {
    hue: avgHue - (avgHue % (360 / 20)),
    lightness: avgLightness - (avgLightness % 5),
    saturation: avgSaturation - (avgSaturation % 5),
  };
}

async function getPixelsFromImage(
  imageUrl: string | Buffer
): Promise<number[]> {
  return new Promise((resolve, reject) => {
    getPixels(imageUrl, "image/jpeg", (err, pixels) => {
      if (err) console.log("Error analyzing pixels", err);
      resolve(pixels.data);
    });
  });
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
