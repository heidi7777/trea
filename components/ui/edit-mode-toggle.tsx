'use client';

export function EditModeToggle() {
  return (
    <button
      onClick={() => {
        window.location.href = '/admin/index.html';
      }}
      className={`
        fixed bottom-6 left-6 z-40 px-4 py-2 rounded-none border
        font-mono text-[12px] uppercase tracking-widest
        transition-all duration-200
        bg-background text-foreground border-border hover:border-foreground
      `}
      title="Open TinaCMS Admin"
    >
      EDIT
    </button>
  );
}
