// hooks/useDebounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, customDelay?: number): T {
  const getDelay = () => {
    if (customDelay) return customDelay;
    const str = String(value);
    if (str.length < 3) return 600;
    if (str.length > 20) return 200;
    return 400;
  };

  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const delay = getDelay();
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, customDelay]);

  return debouncedValue;
}
