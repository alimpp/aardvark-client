import { DebounceTimer } from "@/utils/types";
import { DEBOUNCE } from "./constants";

const debounceTimers: DebounceTimer = {};

export const debounce = <T>(debounceKey: DEBOUNCE, callback: (this: ThisParameterType<ThisType<T>>, ...args: ThisParameterType<unknown>[]) => void, delay = 100): void => {
    if (debounceTimers?.[debounceKey]) {
        window.clearTimeout(debounceTimers[debounceKey]);
        delete debounceTimers[debounceKey];
    }
    debounceTimers[debounceKey] = window.setTimeout((...args: any[]) => callback(...args), delay);
}