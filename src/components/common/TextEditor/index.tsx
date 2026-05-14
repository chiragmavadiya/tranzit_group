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
import FontFamily from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'
import { FontSize } from './fontSize'
import './TextEditor.style.css'

const TextEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const [showCode, setShowCode] = React.useState(false)

  const extensions = [
    StarterKit,
    TextStyle,
    FontFamily,
    FontSize,
    Color,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Write something amazing...',
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary underline cursor-pointer',
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
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Only update parent if we're NOT in code view
      // This prevents the normalization loop that causes cursor jumping in textarea
      if (!showCode) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose-sm focus:outline-none min-h-[300px] px-4 py-3 dark:prose-invert max-w-none'
      },
      transformPastedHTML(html) {
        return html.replace(/<p><\/p>/g, '<p><br></p>')
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  })

  // Sync external value changes if needed (e.g. form reset)
  React.useEffect(() => {
    if (!editor || editor.isFocused) return;

    // Use a more robust comparison to avoid redundant updates
    // Redundant setContent calls can cause data loss (like stripping blank lines)
    const currentHTML = editor.getHTML();
    if (value !== currentHTML) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const [localCode, setLocalCode] = React.useState(value)

  // Update local code if value changes externally (and we're not focused)
  React.useEffect(() => {
    if (!showCode) {
      setLocalCode(value)
    }
  }, [value, showCode])

  const handleToggleCode = () => {
    if (showCode) {
      // Switching from code to visual
      onChange(localCode)
      if (editor) {
        editor.commands.setContent(localCode)
      }
    }
    setShowCode(!showCode)
  }

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-zinc-950">
      <MenuBar
        editor={editor}
        showCode={showCode}
        onToggleCode={handleToggleCode}
      />
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
        {showCode ? (
          <textarea
            className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-slate-50 dark:bg-zinc-900 border-none outline-none resize-none text-slate-800 dark:text-slate-200"
            value={localCode}
            onChange={(e) => setLocalCode(e.target.value)}
            onBlur={() => onChange(localCode)}
            spellCheck={false}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  )
}

export default TextEditor