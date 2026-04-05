import { useMemo, useState } from "react";

export default function useFormDirty<T extends Record<string, any>>(
  initialData: T,
) {
  const [currentData, _setCurrentData] = useState<T>(initialData);
  const [lastSubmittedData, setLastSubmittedData] = useState<T>(initialData);

  const sortedStringify = (obj: T) =>
    JSON.stringify(obj, Object.keys(obj).sort());

  const hasChanges = useMemo(() => {
    return sortedStringify(currentData) !== sortedStringify(lastSubmittedData);
  }, [currentData, lastSubmittedData]);

  // Use this for user edits
  const setCurrentData = (data: T | ((prev: T) => T)) => {
    _setCurrentData(data);
  };

  // Use this when fresh API data arrives — resets both, hasChanges = false
  const resetForm = (data: T) => {
    _setCurrentData(data);
    setLastSubmittedData(data);
  };

  // Call after successful submit — marks current as baseline
  const markAsSubmitted = () => {
    setLastSubmittedData(structuredClone(currentData));
  };

  const resetToLastSubmitted = () => {
    _setCurrentData(lastSubmittedData);
  };

  return {
    currentData,
    setCurrentData,
    resetForm,
    hasChanges,
    markAsSubmitted,
    resetToLastSubmitted,
    lastSubmittedData,
  };
}
