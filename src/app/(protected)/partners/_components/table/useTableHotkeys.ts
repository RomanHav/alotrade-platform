'use client';
import * as React from 'react';

export function useTableHotkeys(
  editingId: string | null,
  onSaveEdit: (id: string) => void,
  onCancelEdit: (id: string) => void,
) {
  React.useEffect(() => {
    if (!editingId) return;
    const id = editingId;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSaveEdit(id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancelEdit(id);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editingId, onSaveEdit, onCancelEdit]);
}
