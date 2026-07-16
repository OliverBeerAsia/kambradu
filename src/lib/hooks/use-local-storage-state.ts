"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useLayoutEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue((current) => (Object.is(current, initialValue) ? (JSON.parse(stored) as T) : current));
      }
    } catch {
      setValue(initialValue);
    } finally {
      setIsHydrated(true);
    }
  }, [initialValue, key]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Local storage is best-effort for offline draft recovery.
    }
  }, [isHydrated, key, value]);

  return [value, setValue, isHydrated] as const;
}
