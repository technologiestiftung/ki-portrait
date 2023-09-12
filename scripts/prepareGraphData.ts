import z from "zod";
import { loadJson } from "./loadJSON";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeJsonFile } from "./writeJsonFile";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ColourSchema = z.tuple([z.number(), z.number(), z.number()]);
type ColourType = z.infer<typeof ColourSchema>;
const EmotionSchema = z.object({
  score: z.number(),
  emotion: z.string(),
});
const FaceGestureSchema = z.object({
  face: z.number(),
  gesture: z.string(),
});
const IrisGestureSchema = z.object({
  iris: z.number(),
  gesture: z.string(),
});
const GestureSchema = z.union([FaceGestureSchema, IrisGestureSchema]);
const StyleSchema = z.enum([
  "pre-raphaelite",
  "fauvist",
  "rococo",
  "concept art",
  "modern",
  "dadaist",
  "pop art",
  "flat woodblock prints",
  "surreal art",
  "ornamental curvilinear lines",
  "realistic",
  "folk art",
  "digital art",
  "synthwave",
  "art deco",
  "conceptual art",
  "cubism",
  "abstract",
  "art nouveau",
  "pixel art",
]);
const MaterialSchema = z.enum([
  "pastel drawing",
  "lithography",
  "gouache illustration",
  "oil painting",
  "acrylic painting",
  "ink drawing",
  "cinematic etching",
  "watercolour painting",
]);
const GenderSchema = z.enum(["male", "female", "unknown", "non-binary"]);

const RawPortraitDataSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  prompt: z.string(),
  url: z.string(),
  prompt_de: z.string().nullable(),
  age: z.number().nullable(),
  color_dominant: ColourSchema.nullable(),
  color_palette: z.array(ColourSchema).nullable(),
  color_names: z.array(z.string()).nullable(),
  emotion: z.array(EmotionSchema).nullable(),
  gender: GenderSchema.nullable(),
  gender_score: z.number().nullable(),
  gesture: z.array(GestureSchema).nullable(),
  material: MaterialSchema.nullable().optional(),
  style: StyleSchema.nullable().optional(),
});

const ParsedPortraitDataSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  prompt: z.string(),
  url: z.string(),
  age: z.number().nullable(),
  colorHue: z.number().nullable(),
  colorSaturation: z.number().nullable(),
  colorLightness: z.number().nullable(),
  colorPalette: z.array(ColourSchema).nullable(),
  colorNames: z.array(z.string()).nullable(),
  emotions: z.array(EmotionSchema).nullable(),
  gender: GenderSchema.nullable(),
  genderScore: z.number().nullable(),
  gestures: z.array(GestureSchema).nullable(),
  material: MaterialSchema.nullable().optional(),
  style: StyleSchema.nullable().optional(),
});

async function processJSON(jsonPath: string, destPath: string) {
  try {
    const extendedData = await loadJson(jsonPath);
    const rawPortraitData = z.array(RawPortraitDataSchema).parse(extendedData);
    const filteredPortraitData = rawPortraitData.filter(
      (rawPortrait) =>
        rawPortrait.id &&
        rawPortrait.created_at &&
        rawPortrait.prompt &&
        rawPortrait.url &&
        rawPortrait.age &&
        rawPortrait.color_dominant?.length === 3 &&
        rawPortrait.style &&
        rawPortrait.material &&
        rawPortrait.gender
    );
    const parsedPortraitData = z.array(ParsedPortraitDataSchema).parse(
      filteredPortraitData.map((rawPortrait) => {
        const hslColor = rgbToHsl(rawPortrait.color_dominant);
        return {
          id: rawPortrait.id,
          createdAt: rawPortrait.created_at,
          prompt: rawPortrait.prompt,
          url: rawPortrait.url,
          age: rawPortrait.age,
          colorHue: hslColor && hslColor[0],
          colorSaturation: hslColor && hslColor[1],
          colorLightness: hslColor && hslColor[2],
          colorPalette: rawPortrait.color_palette ?? null,
          gender:
            rawPortrait.gender === "unknown"
              ? "non-binary"
              : rawPortrait.gender ?? null,
          genderScore: rawPortrait.gender_score ?? null,
          colorNames: rawPortrait.color_names ?? null,
          emotions: rawPortrait.emotion ?? null,
          gestures: rawPortrait.gesture ?? null,
        };
      })
    );

    await writeJsonFile(destPath, parsedPortraitData);
    console.log(`Wrote ${parsedPortraitData.length} portraits to ${destPath}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(JSON.stringify(error.issues, null, 2));
    }
  }
}

function rgbToHsl(color: ColourType | null): ColourType | null {
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

const jsonPath = join(__dirname, "../public/eotai_images_extended.json");
const destPath = join(
  __dirname,
  "../public/eotai_images_extended_for_3d_graph.json"
);
processJSON(jsonPath, destPath);
