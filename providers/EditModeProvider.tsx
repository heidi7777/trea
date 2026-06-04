'use client';

import { ReactNode, useEffect, useState } from 'react';
import { EditModeContext } from '@/contexts/EditModeContext';

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 初始化时从 localStorage 读取编辑模式状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('editMode');
      if (saved !== null) {
        setIsEditMode(JSON.parse(saved));
      }
      setIsHydrated(true);
    }
  }, []);

  // 当编辑模式改变时，保存到 localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('editMode', JSON.stringify(isEditMode));
    }
  }, [isEditMode, isHydrated]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
