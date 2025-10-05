"use client";

import { Textarea } from "./textarea";

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
}

export default function CKEditor({ value, onChange }: CKEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[200px]"
      placeholder="Nhập mô tả khóa học..."
    />
  );
}
