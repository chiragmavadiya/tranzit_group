import { ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShipmentSummary } from './ShipmentSummary';
import { TrackingProgress } from './TrackingProgress';
import { TrackingTimeline } from './TrackingTimeline';
import { TrackingNoEvents } from './TrackingStates';
import type { Shipment } from '../types';

interface TrackingResultProps {
  shipment: Shipment;
  onTrackAnother: () => void;
}

export const TrackingResult = ({ shipment, onTrackAnother }: TrackingResultProps) => (
  <div className="flex flex-col gap-4">
    <ShipmentSummary shipment={shipment} />

    {shipment.status ? <TrackingProgress status={shipment.status} /> : null}

    {shipment.events.length > 0 ? (
      <TrackingTimeline events={shipment.events} />
    ) : (
      <TrackingNoEvents />
    )}

    <div className="flex flex-wrap gap-3">
      <Button type="button" variant="outline" onClick={onTrackAnother} className="h-9 px-4">
        <Search className="size-4" aria-hidden="true" />
        Track another package
      </Button>

      {shipment.courierTrackingUrl ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => window.open(shipment.courierTrackingUrl as string, '_blank', 'noopener,noreferrer')}
          className="h-9 px-4"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          {shipment.courierName ? `Open ${shipment.courierName} tracking` : 'Open courier tracking'}
        </Button>
      ) : null}
    </div>
  </div>
);
