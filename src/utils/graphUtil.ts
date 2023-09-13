import type { ForceGraph3DInstance } from "3d-force-graph";
import type { LinkType } from "../../scripts/lib/parseFor3dGraph";
import * as THREE from "three";

export function getMaxStrength(
  links: LinkType[] = [],
  priorities: Map<string, number>
) {
  const maxStrength = links.reduce((acc, link) => {
    const linkStrength = getLinkPriority(link, priorities);
    return linkStrength > acc ? linkStrength : acc;
  }, 0);
  return maxStrength;
}

export function getLinkPriority(
  link: LinkType,
  priorities: Map<string, number>
) {
  return link.commonProperties.reduce((acc, currentPropertyName) => {
    const priority = priorities.get(currentPropertyName) ?? 1;
    return acc + priority;
  }, 1);
}

export function getStrengthAccessor(
  maxStrength: number,
  priorities: Map<string, number>
) {
  return (link: LinkType) => {
    const linkPrio = getLinkPriority(link, priorities);
    return linkPrio / maxStrength / 100;
  };
}

export function getImageRenderer(displayScale: number) {
  return ({ id }: { id: string }) => {
    const imgTexture = new THREE.TextureLoader().load(`/images/${id}.webp`);
    imgTexture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: imgTexture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(displayScale, displayScale, displayScale);
    return sprite;
  };
}

export function getNodeClickHandler(graph: ForceGraph3DInstance) {
  return function onNodeClick(nd: object) {
    const node = nd as { x: number; y: number; z: number };
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos =
      node.x || node.y || node.z
        ? {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio,
          }
        : { x: 0, y: 0, z: distance };

    graph.cameraPosition(newPos, node, 1000);
  };
}
