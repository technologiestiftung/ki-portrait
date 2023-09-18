import { settingsDefaults } from "./settingsDefaults";

export type SettingsKey = keyof typeof settingsDefaults;

type ListenerType = (newValue: number) => void;
type ListenersType = Map<SettingsKey, ListenerType[]>;

class GraphSettings {
  private settings: Map<SettingsKey, number> = new Map([
    ["material", settingsDefaults.material],
    ["colorHue", settingsDefaults.colorHue],
    ["colorSaturation", settingsDefaults.colorSaturation],
    ["colorLightness", settingsDefaults.colorLightness],
    ["style", settingsDefaults.style],
    ["gender", settingsDefaults.gender],
  ]);
  private listeners: ListenersType = new Map();

  public getSettings() {
    return this.settings;
  }

  public getSetting(key: SettingsKey) {
    return this.settings.get(key);
  }

  public change(value: SettingsKey, newValue: number) {
    this.settings.set(value, newValue);
    this.listeners.get(value)?.forEach((listener) => listener(newValue));
  }

  public onAnyChange(callback: ListenerType) {
    this.settings.forEach((_, key) =>
      this.onChange(key as SettingsKey, callback)
    );
  }

  public offAnyChange(callback: ListenerType) {
    this.settings.forEach((_, key) =>
      this.offChange(key as SettingsKey, callback)
    );
  }

  public onChange(value: SettingsKey, callback: ListenerType) {
    this.listeners.set(value, [...(this.listeners.get(value) || []), callback]);
  }

  public offChange(value: SettingsKey, callback: ListenerType) {
    this.listeners.set(
      value,
      (this.listeners.get(value) || []).filter((l) => l !== callback)
    );
  }
}

export const graphSettings = new GraphSettings();
