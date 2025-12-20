'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableText({
  value,
  onChange,
  className = '',
  tag: Tag = 'span',
  multiline = false,
  placeholder = 'Click to edit...',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-none outline-none w-full resize-none ${className}`}
        style={{ 
          font: 'inherit',
          color: 'inherit',
          letterSpacing: 'inherit',
          lineHeight: 'inherit',
        }}
        rows={multiline ? Math.max(editValue.split('\n').length, 2) : undefined}
      />
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={`editable cursor-text ${className}`}
      style={{ whiteSpace: multiline ? 'pre-wrap' : undefined }}
    >
      {value || <span className="opacity-50">{placeholder}</span>}
    </Tag>
  );
}








