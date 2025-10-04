"use client";

import { useEffect, useRef, useState } from "react";

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
}

export default function CKEditor({ value, onChange }: CKEditorProps) {
  const editorRef = useRef<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [CKEditorComponent, setCKEditorComponent] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);

  useEffect(() => {
    const loadEditor = async () => {
      try {
        const CKEditorModule = await import("@ckeditor/ckeditor5-react");
        const ClassicEditorModule = await import("@ckeditor/ckeditor5-build-classic");

        setCKEditorComponent(() => CKEditorModule.CKEditor);
        setClassicEditor(() => ClassicEditorModule.default);
        setEditorLoaded(true);
      } catch (error) {
        console.error("Failed to load CKEditor:", error);
        setEditorLoaded(false);
      }
    };

    loadEditor();
  }, []);

  if (!editorLoaded || !CKEditorComponent || !ClassicEditor) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300">
        Đang tải trình soạn thảo...
      </div>
    );
  }

  return (
    <CKEditorComponent
      editor={ClassicEditor}
      data={value}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "blockQuote",
          "insertTable",
          "|",
          "undo",
          "redo",
        ],
      }}
    />
  );
}
