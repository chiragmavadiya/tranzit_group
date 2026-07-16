import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface JsonViewerProps {
  data: Record<string, any>;
  className?: string;
  showCopyButton?: boolean;
}

function highlightJson(json: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Regex patterns for JSON syntax
  const keyPattern = /"([^"]+)"(?=\s*:)/g;
  const stringPattern = /:\s*"([^"]*)"(?=\s*[,}\]])/g;
  const numberPattern = /:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?=\s*[,}\]])/g;
  const booleanPattern = /:\s*(true|false)(?=\s*[,}\]])/g;
  const nullPattern = /:\s*(null)(?=\s*[,}\]])/g;

  const tokens: Array<{ index: number; length: number; type: string; value: string }> = [];

  // Collect all matches
  let match;
  keyPattern.lastIndex = 0;
  while ((match = keyPattern.exec(json)) !== null) {
    tokens.push({ index: match.index, length: match[0].length, type: 'key', value: match[0] });
  }

  stringPattern.lastIndex = 0;
  while ((match = stringPattern.exec(json)) !== null) {
    tokens.push({ index: match.index, length: match[0].length, type: 'string', value: match[0] });
  }

  numberPattern.lastIndex = 0;
  while ((match = numberPattern.exec(json)) !== null) {
    tokens.push({ index: match.index, length: match[0].length, type: 'number', value: match[0] });
  }

  booleanPattern.lastIndex = 0;
  while ((match = booleanPattern.exec(json)) !== null) {
    tokens.push({ index: match.index, length: match[0].length, type: 'boolean', value: match[0] });
  }

  nullPattern.lastIndex = 0;
  while ((match = nullPattern.exec(json)) !== null) {
    tokens.push({ index: match.index, length: match[0].length, type: 'null', value: match[0] });
  }

  // Sort by index
  tokens.sort((a, b) => a.index - b.index);

  // Build highlighted output
  tokens.forEach((token, idx) => {
    if (lastIndex < token.index) {
      parts.push(json.substring(lastIndex, token.index));
    }

    const colorClass = {
      key: 'text-blue-600 dark:text-blue-400',
      string: 'text-green-600 dark:text-green-400',
      number: 'text-orange-600 dark:text-orange-400',
      boolean: 'text-purple-600 dark:text-purple-400',
      null: 'text-red-600 dark:text-red-400',
    }[token.type];

    parts.push(
      <span key={`token-${idx}`} className={colorClass}>
        {token.value}
      </span>
    );

    lastIndex = token.index + token.length;
  });

  if (lastIndex < json.length) {
    parts.push(json.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [json];
}

export const JsonViewer = ({ data, className, showCopyButton = true }: JsonViewerProps) => {
  const { copy, copied } = useCopyToClipboard('JSON copied');

  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const highlighted = useMemo(() => highlightJson(jsonString), [jsonString]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {showCopyButton && (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copy(jsonString)}
            className="h-8 px-2 gap-1 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-md"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="text-xs font-semibold">Copy</span>
          </Button>
        </div>
      )}

      <div className="max-h-[500px] overflow-auto rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-zinc-800 p-4">
        <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
          {highlighted}
        </pre>
      </div>
    </div>
  );
};
