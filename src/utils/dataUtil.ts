export async function getGraphData() {
  const data = await fetch("/eotai_images_extended_for_3d_graph.json");
  const json = await data.json();
  return json;
}
