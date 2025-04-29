import { Signal } from '@angular/core';

export interface SignalState<T> {
  asReadonly(): ReadonlyState<T>;
}

export type ReadonlyState<T> = T extends object
  ? {
      [K in keyof T]: Signal<T[K]>;
    }
  : Signal<T>;
