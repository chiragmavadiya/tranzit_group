import React from 'react'
import { MenuBar } from './menubar'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import './TextEditor.style.css'

const TextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const extensions = [
    StarterKit,
    TextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Write something amazing...',
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 underline cursor-pointer',
      },
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Table.configure({
      resizable: true,
      allowTableNodeSelection: true,

    }),
    TableRow,
    TableHeader,
    TableCell,
  ]

  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose-sm focus:outline-none min-h-[300px] px-4 py-3 dark:prose-invert max-w-none'
      },
    },
  })

  // Sync external value changes if needed (e.g. form reset)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TextEditor