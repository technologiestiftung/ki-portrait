import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeJsonFile } from "./lib/writeJsonFile";
import { ParsedPortraitType, parsePortraitData } from "./lib/parsePortraitData";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, "../public/eotai_images_extended.json");
const destPath = join(
  __dirname,
  "../public/eotai_images_extended_for_3d_graph.json"
);

async function main() {
  const parsedPortraitData = await parsePortraitData(jsonPath);
  await writeJsonFile<ParsedPortraitType[]>(destPath, parsedPortraitData);
  console.log(`Wrote ${parsedPortraitData.length} portraits to ${destPath}`);
}

main();
