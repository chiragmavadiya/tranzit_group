import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import React, { useCallback } from 'react'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Type,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Terminal,
    Minus,
    Undo,
    Redo,
    Eraser,
    RemoveFormatting,
    WrapText,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    Table as TableIcon,
    Trash2,
    ChevronDown,
    ChevronRight,
    X,
    ALargeSmall,
    Palette,
    CodeXml
} from 'lucide-react'

import { menuBarStateSelector } from './menubarState'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { CustomTooltip } from '../CustomTooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ToolbarButtonProps {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    tooltip: string
    icon: React.ReactNode
    className?: string
}

const FONT_FAMILIES = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Serif', value: 'serif' },
    { label: 'Monospace', value: 'monospace' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Verdana', value: 'Verdana' },
]

const FONT_SIZES = [
    '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'
]

const ToolbarButton = ({ onClick, active, disabled, tooltip, icon, className }: ToolbarButtonProps) => (
    <CustomTooltip title={tooltip}>
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "transition-all duration-200",
                active
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-bold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800",
                className
            )}
        >
            {icon}
        </Button>
    </CustomTooltip>
)

export const MenuBar = ({
    editor,
    showCode,
    onToggleCode
}: {
    editor: Editor | null,
    showCode: boolean,
    onToggleCode: () => void
}) => {
    const editorState = useEditorState({
        editor,
        selector: menuBarStateSelector,
    })

    const setLink = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const insertTable = useCallback(() => {
        if (!editor) return
        const rows = window.prompt('Rows', '3')
        const cols = window.prompt('Columns', '3')

        if (rows && cols) {
            editor.chain().focus().insertTable({
                rows: parseInt(rows, 10),
                cols: parseInt(cols, 10),
                withHeaderRow: true
            }).run()
        }
    }, [editor])

    if (!editor || !editorState) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50/50 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-0.5 px-1">
                {/* Font Family */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={showCode}
                            className="h-8 gap-1 px-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <Type className="size-3.5" />
                            <span className="max-w-[60px] truncate">{editorState.currentFontFamily}</span>
                            <ChevronDown className="size-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    {!showCode && (
                        <DropdownMenuContent align="start" className="w-[180px] bg-white dark:bg-zinc-950">
                            {FONT_FAMILIES.map((font) => (
                                <DropdownMenuItem
                                    key={font.value}
                                    onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                                    className={cn(
                                        "text-xs font-medium cursor-pointer",
                                        editorState.currentFontFamily === font.value && "bg-primary/10 text-primary"
                                    )}
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>

                {/* Font Size */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={showCode}
                            className="h-8 gap-1 px-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <ALargeSmall className="size-3.5" />
                            <span>{editorState.currentFontSize}</span>
                            <ChevronDown className="size-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    {!showCode && (
                        <DropdownMenuContent align="start" className="w-[100px] bg-white dark:bg-zinc-950">
                            {FONT_SIZES.map((size) => (
                                <DropdownMenuItem
                                    key={size}
                                    onClick={() => editor.chain().focus().setFontSize(size).run()}
                                    className={cn(
                                        "text-xs font-medium cursor-pointer",
                                        editorState.currentFontSize === size && "bg-primary/10 text-primary"
                                    )}
                                >
                                    {size}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>

                <ToolbarButton
                    onClick={() => {
                        const color = window.prompt('Color (Hex)', '#000000')
                        if (color) editor.chain().focus().setColor(color).run()
                    }}
                    disabled={showCode}
                    tooltip="Text Color"
                    icon={<Palette className="size-4" />}
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editorState.canBold || showCode}
                    active={editorState.isBold}
                    tooltip="Bold"
                    icon={<Bold className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editorState.canItalic || showCode}
                    active={editorState.isItalic}
                    tooltip="Italic"
                    icon={<Italic className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editorState.canStrike || showCode}
                    active={editorState.isStrike}
                    tooltip="Strikethrough"
                    icon={<Strikethrough className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editorState.canCode || showCode}
                    active={editorState.isCode}
                    tooltip="Inline Code"
                    icon={<Code className="size-4" />}
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    disabled={showCode}
                    tooltip="Clear Marks"
                    icon={<Eraser className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().clearNodes().run()}
                    disabled={showCode}
                    tooltip="Clear Formatting"
                    icon={<RemoveFormatting className="size-4" />}
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    disabled={showCode}
                    active={editorState.isParagraph}
                    tooltip="Paragraph"
                    icon={<Type className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    disabled={showCode}
                    active={editorState.isHeading1}
                    tooltip="Heading 1"
                    icon={<Heading1 className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    disabled={showCode}
                    active={editorState.isHeading2}
                    tooltip="Heading 2"
                    icon={<Heading2 className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    disabled={showCode}
                    active={editorState.isHeading3}
                    tooltip="Heading 3"
                    icon={<Heading3 className="size-4" />}
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    disabled={showCode}
                    active={editorState.isAlignLeft}
                    tooltip="Align Left"
                    icon={<AlignLeft className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    disabled={showCode}
                    active={editorState.isAlignCenter}
                    tooltip="Align Center"
                    icon={<AlignCenter className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    disabled={showCode}
                    active={editorState.isAlignRight}
                    tooltip="Align Right"
                    icon={<AlignRight className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    disabled={showCode}
                    active={editorState.isAlignJustify}
                    tooltip="Align Justify"
                    icon={<AlignJustify className="size-4" />}
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={setLink}
                    disabled={showCode}
                    active={editorState.isLink}
                    tooltip="Insert Link"
                    icon={<LinkIcon className="size-4" />}
                />
                <ToolbarButton
                    onClick={addImage}
                    disabled={showCode}
                    tooltip="Insert Image"
                    icon={<ImageIcon className="size-4" />}
                />
                <ToolbarButton
                    onClick={insertTable}
                    disabled={showCode}
                    tooltip="Insert Table"
                    icon={<TableIcon className="size-4" />}
                />
            </div>

            {editorState.isInTable && (
                <>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <div className="flex items-center gap-0.5 px-1 bg-primary/5 dark:bg-primary/10 rounded-md">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            tooltip="Add Row After"
                            icon={<div className="relative"><ChevronDown className="size-3 absolute -bottom-1 left-0.5" /><Minus className="size-4" /></div>}
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            tooltip="Add Column After"
                            icon={<div className="relative"><ChevronRight className="size-3 absolute top-0.5 -right-1" /><div className="w-0.5 h-4 bg-current mx-1.5" /></div>}
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().deleteRow().run()}
                            tooltip="Delete Row"
                            icon={<div className="relative opacity-70"><X className="size-3 absolute -top-1 -right-1 text-red-500" /><Minus className="size-4" /></div>}
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                            tooltip="Delete Column"
                            icon={<div className="relative opacity-70"><X className="size-3 absolute -top-1 -right-1 text-red-500" /><div className="w-0.5 h-4 bg-current mx-1.5" /></div>}
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            tooltip="Delete Table"
                            className="hover:text-red-500"
                            icon={<Trash2 className="size-4" />}
                        />
                    </div>
                </>
            )}

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={showCode}
                    active={editorState.isBulletList}
                    tooltip="Bullet List"
                    icon={<List className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={showCode}
                    active={editorState.isOrderedList}
                    tooltip="Ordered List"
                    icon={<ListOrdered className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    disabled={showCode}
                    active={editorState.isCodeBlock}
                    tooltip="Code Block"
                    icon={<Terminal className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    disabled={showCode}
                    active={editorState.isBlockquote}
                    tooltip="Blockquote"
                    icon={<Quote className="size-4" />}
                />
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    disabled={showCode}
                    tooltip="Horizontal Rule"
                    icon={<Minus className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHardBreak().run()}
                    disabled={showCode}
                    tooltip="Hard Break"
                    icon={<WrapText className="size-4" />}
                />
            </div>

            <div className="ml-auto flex items-center gap-0.5 px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editorState.canUndo || showCode}
                    tooltip="Undo"
                    icon={<Undo className="size-4" />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editorState.canRedo || showCode}
                    tooltip="Redo"
                    icon={<Redo className="size-4" />}
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <ToolbarButton
                    onClick={onToggleCode}
                    active={showCode}
                    tooltip={showCode ? "Show Visual Editor" : "Show Source Code"}
                    icon={<CodeXml className="size-4" />}
                />
            </div>
        </div>
    )
}
