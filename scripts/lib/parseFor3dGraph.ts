import { settingsMap } from "./../../src/utils/initSettings.ts";
import type { ParsedPortraitType } from "./parsePortraitData.ts";

export type LinkType = {
  source: string;
  target: string;
  commonProperties: string[];
};

type PortraitGroupType = {
  property: string;
  portraits: ParsedPortraitType[];
};

export function parseFor3dGraph(parsedPortraitData: ParsedPortraitType[]) {
  const portraitsByProperties = getPortraitsByProperties(parsedPortraitData);
  const formattedFor3dGraph = {
    nodes: parsedPortraitData,
    links: connectPortraitsByCommonProperties(portraitsByProperties),
  };
  return formattedFor3dGraph;
}

function getPortraitsByProperties(parsedPortraitData: ParsedPortraitType[]) {
  const portraitsByProperties = new Set<PortraitGroupType>();
  for (const [property] of settingsMap) {
    const portraitsWithSameProperty = getPortraitsByProperty(
      parsedPortraitData,
      property
    );
    portraitsByProperties.add({
      property,
      portraits: portraitsWithSameProperty,
    });
  }
  return portraitsByProperties;
}

function connectPortraitsByCommonProperties(
  portraitPropertyGroups: Set<PortraitGroupType>
) {
  let links = new Map<string, LinkType>();
  const loopThroughPortraitGroups = getPortraitGroupLooper(
    portraitPropertyGroups
  );
  loopThroughPortraitGroups(
    ({ propertyName, portrait, nextPortrait, currentId }) => {
      const exitsingLink = links.get(currentId);
      if (
        !nextPortrait ||
        portrait[propertyName] !== nextPortrait[propertyName]
      )
        return;
      const commonProperties = exitsingLink
        ? [...new Set([...exitsingLink.commonProperties, propertyName])]
        : [propertyName];
      links.set(currentId, {
        source: exitsingLink ? exitsingLink.source : portrait.id,
        target: exitsingLink ? exitsingLink.target : nextPortrait.id,
        commonProperties,
      });
    }
  );

  return Array.from(links.values());
}

function getPortraitGroupLooper(
  portraitPropertyGroups: Set<PortraitGroupType>
) {
  return function loopThroughPortraitGroups(
    loopFn: (data: {
      propertyName: string;
      portrait: ParsedPortraitType;
      nextPortrait: ParsedPortraitType | undefined;
      currentId: string;
    }) => void
  ) {
    for (const portraitPropertyGroup of portraitPropertyGroups) {
      const { portraits, property } = portraitPropertyGroup;
      for (const portraitIdxString in portraits) {
        const portraitIdx = Number(portraitIdxString);
        const portrait = portraits[portraitIdx];
        portraits.forEach((p) => {
          if (p.id === portrait.id) return;
          const currentId = [portrait.id, p.id].sort().join();
          loopFn({
            propertyName: property,
            portrait,
            nextPortrait: p,
            currentId,
          });
        });
      }
    }
  };
}

function getPortraitsByProperty(
  parsedPortraitData: ParsedPortraitType[],
  property: string
) {
  return parsedPortraitData.reduce((acc, portrait) => {
    const propertyValue = portrait[property];
    if (!propertyValue) return acc;
    const existingPortraitInGroup = acc.find((p) => p.id === portrait.id);
    if (existingPortraitInGroup) return acc;
    return [...acc, portrait];
  }, [] as ParsedPortraitType[]);
}
