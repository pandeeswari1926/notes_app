import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"; // ✅ Correct import

const editorConfig = {
  namespace: "MyEditor",
  theme: {},
  onError: (error: Error) => {
    console.error("Lexical Error:", error);
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Type something...</div>}
        ErrorBoundary={LexicalErrorBoundary} // ✅ Use the correct component
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
