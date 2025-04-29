export type Nominal<T, Name extends string> = T & { __brand: Name };
