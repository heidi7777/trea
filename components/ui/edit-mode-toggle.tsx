'use client';

import { useEditMode } from '@/contexts/EditModeContext';

export function EditModeToggle() {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <button
      onClick={toggleEditMode}
      className={`
        fixed bottom-6 left-6 z-40 px-4 py-2 rounded-none border
        font-mono text-[12px] uppercase tracking-widest
        transition-all duration-200
        ${
          isEditMode
            ? 'bg-accent text-accent-foreground border-accent'
            : 'bg-background text-foreground border-border hover:border-foreground'
        }
      `}
      title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
    >
      {isEditMode ? '✓ EDITING' : 'EDIT'}
    </button>
  );
}
