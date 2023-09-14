import { GUI } from "dat.gui";
import { settingsDefaults } from "./settingsDefaults";

class Settings {
  material = settingsDefaults.material;
  colorHue = settingsDefaults.colorHue;
  colorLightness = settingsDefaults.colorLightness;
  colorSaturation = settingsDefaults.colorSaturation;
  style = settingsDefaults.style;
  gender = settingsDefaults.gender;
}

const settings = new Settings();
type SettingsKey = keyof typeof settingsDefaults;
export const settingsMap = new Map(Object.entries(settings)) as Map<
  SettingsKey,
  number
>;

export function initSettings(
  onValueChange: (priorities: Map<SettingsKey, number>) => void
) {
  const gui = new GUI();

  Object.keys(settingsDefaults).forEach((propertyName) => {
    const controller = gui
      .add(settings, propertyName as keyof Settings, 0, 20, 1)
      .name(`${propertyName} priority: `);
    controller.onChange((priority) => {
      settingsMap.set(propertyName as SettingsKey, priority);
      onValueChange(settingsMap);
    });
  });
}
