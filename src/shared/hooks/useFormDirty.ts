import { useMemo, useState } from "react";

// useFormDirty.ts
export default function useFormDirty<T>(initialData: T) {
  const [currentData, setCurrentData] = useState<T>(initialData);
  const [lastSubmittedData, setLastSubmittedData] = useState<T>(initialData);

  const hasChanges = useMemo(() => {
    return JSON.stringify(currentData) !== JSON.stringify(lastSubmittedData);
  }, [currentData, lastSubmittedData]);

  const markAsSubmitted = () => {
    setLastSubmittedData(JSON.parse(JSON.stringify(currentData)));
  };

  const resetToLastSubmitted = () => {
    setCurrentData(lastSubmittedData);
  };

  return {
    currentData,
    setCurrentData,
    hasChanges,
    markAsSubmitted,
    resetToLastSubmitted,
    lastSubmittedData,
  };
}
