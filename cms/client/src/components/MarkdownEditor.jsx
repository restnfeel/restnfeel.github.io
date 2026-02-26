import MdEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({ value, onChange }) {
  return (
    <div data-color-mode="light">
      <MdEditor value={value || ''} onChange={onChange} height={400} />
    </div>
  );
}
