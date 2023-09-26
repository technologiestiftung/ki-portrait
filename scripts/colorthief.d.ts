declare module "colorthief" {
  export type RGBColor = [number, number, number];
  export default class ColorThief {
    public static getColor: (
      img: HTMLImageElement | null,
      quality?: number
    ) => RGBColor;
    public static getPalette: (
      img: HTMLImageElement | null,
      colorCount?: number,
      quality?: number
    ) => RGBColor[];
  }
}
