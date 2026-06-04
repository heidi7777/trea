'use client';

import { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import Image from 'next/image';

interface EditableImageProps {
  src: string;
  alt: string;
  dataType: string;
  dataId: string;
  fieldPath: string;  // 改为 fieldPath，支持嵌套路径
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onSave?: (newSrc: string) => Promise<void>;
}

export function EditableImage({
  src,
  alt,
  dataType,
  dataId,
  fieldPath,
  fill = false,
  className = '',
  sizes,
  priority = false,
  onSave,
}: EditableImageProps) {
  const { isEditMode } = useEditMode();
  const [localSrc, setLocalSrc] = useState(src);
  const [showEditor, setShowEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = localSrc !== src;

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
      setShowEditor(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(localSrc);
      } else {
        const dataToSave = buildNestedObject(fieldPath, localSrc);
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

      setShowEditor(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalSrc(src);
    setShowEditor(false);
  };

  if (!isEditMode) {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          priority={priority}
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        width={400}
        height={300}
      />
    );
  }

  return (
    <div className="relative group">
      {fill ? (
        <Image
          src={localSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={`${className} border-2 border-dashed border-accent/50 group-hover:border-accent`}
          priority={priority}
        />
      ) : (
        <Image
          src={localSrc}
          alt={alt}
          width={400}
          height={300}
          className={`${className} border-2 border-dashed border-accent/50 group-hover:border-accent`}
        />
      )}

      <button
        onClick={() => setShowEditor(true)}
        className="absolute bottom-2 right-2 px-2 py-1 bg-accent text-accent-foreground text-[11px] uppercase tracking-wider rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
      >
        编辑
      </button>

      {showEditor && (
        <div className="absolute inset-0 bg-background/95 border border-accent p-4 rounded-none flex flex-col gap-3 z-10">
          <div className="text-[13px] font-bold uppercase tracking-widest">编辑图片 URL</div>
          <input
            type="text"
            value={localSrc}
            onChange={(e) => setLocalSrc(e.target.value)}
            className="w-full px-2 py-2 border border-accent bg-background text-foreground rounded-none text-[13px] focus:outline-none"
            placeholder="/path/to/image.jpg"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1 px-2 py-2 bg-accent text-accent-foreground text-[12px] uppercase tracking-wider rounded-none hover:bg-accent/90 disabled:opacity-50"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-2 py-2 border border-border text-[12px] uppercase tracking-wider rounded-none hover:bg-muted"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
