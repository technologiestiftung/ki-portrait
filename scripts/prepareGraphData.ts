import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { writeJsonFile } from "./lib/writeJsonFile.ts";
import { parsePortraitData } from "./lib/parsePortraitData.ts";
import { parseFor3dGraph } from "./lib/parseFor3dGraph.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, "../public/eotai_images_extended.json");
const destPath = join(
  __dirname,
  "../public/eotai_images_extended_for_3d_graph.json"
);

async function main() {
  const parsedPortraitData = await parsePortraitData(jsonPath);
  const parsedFor3dGraph = parseFor3dGraph(parsedPortraitData);
  await writeJsonFile(destPath, parsedFor3dGraph);
  console.log(`Wrote ${parsedPortraitData.length} portraits to ${destPath}`);
}

main();
