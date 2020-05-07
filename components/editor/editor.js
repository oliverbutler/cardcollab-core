import { Editor as DraftEditor, EditorState, convertToRaw } from "draft-js";
import { useState, useEffect } from "react";

const Editor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    var contentState = editorState.getCurrentContent();
    console.log(convertToRaw(contentState));
  }, [editorState]);

  return (
    <DraftEditor
      editorState={editorState}
      onChange={setEditorState}
      editorKey="editor"
    />
  );
};

export default Editor;
