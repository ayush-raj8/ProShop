import React from 'react';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

function TextEditor({ editorValue, setEditorValue }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  // Create a custom class to override the background color
  const editorStyle = {
    backgroundColor: isDarkModeOn ? 'gray' : 'white', // Change the background color as needed
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorValue}
      onChange={(value) => setEditorValue(value)}
      modules={modules}
      style={editorStyle} // Apply custom style
    />
  );
}

export default TextEditor;
