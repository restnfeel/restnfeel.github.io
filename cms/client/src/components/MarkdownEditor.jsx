import MdEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({ value, onChange, className = '' }) {
  return (
    <div
      data-color-mode="light"
      className={`[&_.w-md-editor]:rounded-b-lg [&_.w-md-editor-toolbar]:rounded-t-lg flex-1 flex flex-col min-h-0 [&_.w-md-editor]:flex-1 [&_.w-md-editor]:min-h-[500px] ${className}`}
    >
      <MdEditor
        value={value || ''}
        onChange={onChange}
        height={600}
        preview="live"
        visibleDragbar={false}
      />
    </div>
  );
}
