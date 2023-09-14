import { GUI } from "dat.gui";

class Settings {
  material = 6;
  colorHue = 5;
  colorLightness = 4;
  colorSaturation = 3;
  style = 2;
  gender = 1;
}

const settings = new Settings();
export const settingsMap = new Map(Object.entries(settings)) as Map<
  string,
  number
>;

export function initSettings(
  onValueChange: (priorities: Map<string, number>) => void
) {
  const gui = new GUI();

  Object.keys(settings).forEach((propertyName) => {
    const controller = gui
      .add(settings, propertyName as keyof Settings, 0, 20, 1)
      .name(`${propertyName} priority: `);
    controller.onChange((priority) => {
      settingsMap.set(propertyName, priority);
      onValueChange(settingsMap);
    });
  });
}
