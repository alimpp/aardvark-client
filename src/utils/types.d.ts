import { DEBOUNCE } from "@/utils/constants";

export type ClassAttributes = Readonly<{
  [key: string]: boolean
}> | ReadonlyArray<string>;

export type StyleAttributes = Readonly<{
  [key: string]: string
}>;

export type DebounceTimer = {
  [key in DEBOUNCE]?: number;
};
export type DocumentVisibilityState = "hidden" | "visible"; // TODO: Remove when upgrading TypeScript to >= 4.x.x
