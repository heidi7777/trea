'use client';

import { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';

interface EditableTextProps {
  value: string;
  dataType: string;
  dataId: string;
  fieldPath: string;  // 改为 fieldPath，支持嵌套路径如 "intro.version"
  isMultiline?: boolean;
  onSave?: (newValue: string) => Promise<void>;
  className?: string;
}

export function EditableText({
  value,
  dataType,
  dataId,
  fieldPath,
  isMultiline = false,
  onSave,
  className = '',
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [localValue, setLocalValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveUI, setShowSaveUI] = useState(false);

  const hasChanges = localValue !== value;

  // 根据嵌套路径构建数据对象
  const buildNestedObject = (path: string, val: string): Record<string, any> => {
    const parts = path.split('.');
    if (parts.length === 1) {
      return { [path]: val };
    }
    const obj: Record<string, any> = {};
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = val;
    return obj;
  };

  const handleSave = async () => {
    if (!hasChanges) {
      setShowSaveUI(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(localValue);
      } else {
        // 调用 API 保存，使用嵌套对象结构
        const dataToSave = buildNestedObject(fieldPath, localValue);
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: dataType,
            id: dataId,
            data: dataToSave,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save');
        }
      }

      setShowSaveUI(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value);
    setShowSaveUI(false);
  };

  if (!isEditMode) {
    return <>{value}</>;
  }

  if (isMultiline) {
    return (
      <div className="space-y-2">
        <textarea
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            setShowSaveUI(true);
          }}
          className={`w-full min-h-24 p-2 border border-accent bg-background text-foreground rounded-none font-te-20 resize-none focus:outline-none focus:ring-1 focus:ring-accent ${className}`}
        />
        {showSaveUI && (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-3 py-1 bg-accent text-accent-foreground rounded-none text-[12px] uppercase tracking-wider hover:bg-accent/90 disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1 border border-border rounded-none text-[12px] uppercase tracking-wider hover:bg-muted"
            >
              取消
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <span
      className={`inline relative group ${hasChanges ? 'bg-accent/10 border-l-2 border-accent pl-2' : ''}`}
    >
      <input
        type="text"
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
          setShowSaveUI(true);
        }}
        className={`bg-background text-foreground border-b-2 border-dashed border-accent/50 focus:outline-none focus:border-accent px-1 py-1 ${className}`}
      />
      {showSaveUI && (
        <div className="absolute top-full left-0 mt-1 flex gap-1 bg-background border border-accent p-1 rounded-none z-10 whitespace-nowrap">
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-2 py-1 bg-accent text-accent-foreground text-[11px] uppercase tracking-wider hover:bg-accent/90 disabled:opacity-50 rounded-none"
          >
            {isSaving ? '...' : '✓'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-2 py-1 border border-border text-[11px] uppercase tracking-wider hover:bg-muted rounded-none"
          >
            ✕
          </button>
        </div>
      )}
    </span>
  );
}
