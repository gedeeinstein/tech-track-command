
import { useState, useEffect } from 'react';

/**
 * A hook to safely manage dialog state while ensuring body pointer events
 * are properly restored when the dialog closes
 */
export function useDialog(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  // When the component unmounts or dialog closes, ensure pointer events are restored
  useEffect(() => {
    return () => {
      // Ensure body pointer events are restored when component unmounts
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  // When dialog state changes, handle pointer events properly
  useEffect(() => {
    if (!isOpen) {
      // Small delay to ensure any transitions complete before restoring pointer events
      setTimeout(() => {
        document.body.style.removeProperty('pointer-events');
      }, 100);
    }
  }, [isOpen]);

  return [isOpen, setIsOpen] as const;
}
