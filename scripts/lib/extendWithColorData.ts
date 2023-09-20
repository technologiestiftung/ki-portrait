import { loadPortraitPalette } from "./loadPortraitPalette.ts";
import { ParsedPortraitType } from "./parsePortraitData.ts";

export async function extendWithColorData(
  parsedPortraitData: ParsedPortraitType[]
): Promise<ParsedPortraitType[]> {
  const imagePromises = parsedPortraitData.map(async (portrait) => {
    const newColors = await loadPortraitPalette(portrait.id);

    return {
      ...portrait,
      ...newColors,
    };
  });
  return await Promise.all(imagePromises);
}
