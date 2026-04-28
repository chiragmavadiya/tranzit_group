declare module 'react-rte' {
  import * as React from 'react';

  export interface EditorValue {
    toString(format: string): string;
    setContentFromString(value: string, format: string): EditorValue;
  }

  export interface RichTextEditorProps {
    value: EditorValue;
    onChange?: (value: EditorValue) => void;
    key?: string;
    className?: string;
    toolbarClassName?: string;
    editorClassName?: string;
    placeholder?: string;
    customControls?: Array<(
      setValue: (value: EditorValue) => void,
      getValue: () => EditorValue,
      editorState: any
    ) => React.ReactNode>;
    readOnly?: boolean;
    disabled?: boolean;
  }

  export default class RichTextEditor extends React.Component<RichTextEditorProps> {
    static createEmptyValue(): EditorValue;
    static createValueFromString(value: string, format: string): EditorValue;
  }
}
