
export type ValueOf<T> = T[keyof T];
export type Nullable<T> = T | null;
export type PartialRecord<K extends keyof any, T> =  Partial<Record<K, T>>
