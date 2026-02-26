import MdEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({ value, onChange }) {
  return (
    <div data-color-mode="light" className="[&_.w-md-editor]:rounded-b-lg [&_.w-md-editor-toolbar]:rounded-t-lg">
      <MdEditor
        value={value || ''}
        onChange={onChange}
        height={420}
        preview="live"
        visibleDragbar={false}
      />
    </div>
  );
}
