// shared/hooks/useInquired.ts
import { useState } from "react";

const STORAGE_KEY = "inquired_vehicles";

function getInquiredSet(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: number[] = raw ? JSON.parse(raw) : [];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

function markInquired(inventoryId: number): void {
  try {
    const set = getInquiredSet();
    set.add(inventoryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function useInquired(inventoryId: number) {
  const [inquired, setInquired] = useState<boolean>(() =>
    getInquiredSet().has(inventoryId),
  );

  const markAsInquired = () => {
    markInquired(inventoryId);
    setInquired(true);
  };

  return { inquired, markAsInquired };
}
