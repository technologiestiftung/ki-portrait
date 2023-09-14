import type { ParsedPortraitType } from "../../scripts/lib/parsePortraitData";

type EventType = "select" | "deselect";
type SelectListenerType = (val: ParsedPortraitType) => void;
type DeselectListenerType = () => void;
type ListenersType = Map<
  EventType,
  SelectListenerType[] | DeselectListenerType[]
>;

class PortraitState {
  private selectedPortrait: ParsedPortraitType | null = null;
  private listeners: ListenersType = new Map();

  public select(portrait: ParsedPortraitType) {
    this.selectedPortrait = portrait;
    const listeners = (this.listeners.get("select") ||
      []) as SelectListenerType[];
    listeners.forEach((listener) => listener(portrait));
  }

  public deselect() {
    this.selectedPortrait = null;
    const listeners = (this.listeners.get("deselect") ||
      []) as DeselectListenerType[];
    listeners.forEach((listener) => listener());
  }

  onSelect(listener: SelectListenerType) {
    const listeners =
      this.listeners.get("select") || ([] as SelectListenerType[]);
    this.listeners.set("select", [...listeners, listener]);
  }

  onDeselect(listener: DeselectListenerType) {
    const listeners =
      this.listeners.get("deselect") || ([] as DeselectListenerType[]);
    this.listeners.set("deselect", [...listeners, listener]);
  }

  public offSelect(listener: SelectListenerType) {
    const listeners = this.listeners.get("select") || [];
    this.listeners.set(
      "select",
      listeners.filter((l) => l !== listener)
    );
  }
  public offDeselect(listener: DeselectListenerType) {
    const listeners = this.listeners.get("deselect") || [];
    this.listeners.set(
      "deselect",
      listeners.filter((l) => l !== listener)
    );
  }
}

export default new PortraitState();
