import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { buildCopySummary } from '../../utils/debugCentre.utils';
import type { TraceDetail } from '../../types';

interface CopyDebugSummaryButtonProps {
  trace: TraceDetail;
}

export const CopyDebugSummaryButton = ({ trace }: CopyDebugSummaryButtonProps) => {
  const { copy, copied } = useCopyToClipboard('Debug summary copied');

  const handleCopy = () => {
    const summary = buildCopySummary(trace);
    copy(summary);
  };

  return (
    <Button
      onClick={handleCopy}
      className="h-8 gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg"
      disabled={copied}
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {copied ? 'Copied!' : 'Copy Summary'}
    </Button>
  );
};
