import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { resolveProgress } from './trackingStages.ts';
import { normalizeShipment } from './normalizeShipment.ts';

describe('resolveProgress', () => {
  it('maps the happy path statuses to their stage', () => {
    assert.equal(resolveProgress('Order placed').reachedIndex, 0);
    assert.equal(resolveProgress('Label created').reachedIndex, 1);
    assert.equal(resolveProgress('Picked up').reachedIndex, 2);
    assert.equal(resolveProgress('In Transit').reachedIndex, 3);
    assert.equal(resolveProgress('Delivered').reachedIndex, 5);
  });

  it('separates "out for delivery" from "delivered"', () => {
    assert.deepEqual(resolveProgress('Out for delivery'), { reachedIndex: 4, exception: null });
    assert.deepEqual(resolveProgress('Delivered'), { reachedIndex: 5, exception: null });
  });

  it('treats a failed attempt as an exception, not a delivery', () => {
    assert.equal(resolveProgress('Delivery attempt failed').exception, 'failed');
    assert.equal(resolveProgress('Delivery unsuccessful').exception, 'failed');
  });

  it('flags the remaining exception states', () => {
    assert.equal(resolveProgress('Cancelled').exception, 'cancelled');
    assert.equal(resolveProgress('Returned to sender').exception, 'returned');
    assert.equal(resolveProgress('Exception / Delayed').exception, 'delayed');
  });

  it('falls back to the first stage for empty or unrecognised statuses', () => {
    assert.deepEqual(resolveProgress(''), { reachedIndex: 0, exception: null });
    assert.deepEqual(resolveProgress('   '), { reachedIndex: 0, exception: null });
    assert.deepEqual(resolveProgress('Awaiting courier allocation'), {
      reachedIndex: 0,
      exception: null,
    });
  });
});

describe('normalizeShipment', () => {
  it('falls back to the requested tracking number when the response omits it', () => {
    assert.equal(normalizeShipment({}, 'MP0041150814').trackingNumber, 'MP0041150814');
  });

  it('only passes through http(s) courier links', () => {
    const safe = normalizeShipment(
      { courier: { tracking_url: 'https://aramex.com.au/track/MP1' } },
      'MP1',
    );
    assert.equal(safe.courierTrackingUrl, 'https://aramex.com.au/track/MP1');

    for (const hostile of ['javascript:alert(1)', 'not a url', '']) {
      const result = normalizeShipment({ courier: { tracking_url: hostile } }, 'MP1');
      assert.equal(result.courierTrackingUrl, null, `expected ${hostile} to be rejected`);
    }
  });

  it('orders events newest first when every timestamp parses', () => {
    const result = normalizeShipment(
      {
        events: [
          { title: 'Picked up', occurred_at: '2026-09-01T09:00:00Z' },
          { title: 'Delivered', occurred_at: '2026-09-03T14:30:00Z' },
          { title: 'In transit', occurred_at: '2026-09-02T11:00:00Z' },
        ],
      },
      'MP1',
    );
    assert.deepEqual(
      result.events.map((event) => event.title),
      ['Delivered', 'In transit', 'Picked up'],
    );
  });

  it('keeps the backend order when timestamps are not parseable', () => {
    const result = normalizeShipment(
      {
        events: [
          { title: 'Delivered', occurred_at: '03/09/26 14:30' },
          { title: 'Picked up', occurred_at: '01/09/26 09:00' },
        ],
      },
      'MP1',
    );
    assert.deepEqual(
      result.events.map((event) => event.title),
      ['Delivered', 'Picked up'],
    );
  });

  it('maps branding and validates every field', () => {
    const result = normalizeShipment(
      {
        branding: {
          logo: 'https://cdn.example.com/logo.png',
          brand_url: 'https://store.example.com',
          header_color: '#00CCFF',
        },
      },
      'MP1',
    );
    assert.deepEqual(result.branding, {
      logoUrl: 'https://cdn.example.com/logo.png',
      // Normalised through new URL(), which appends the root slash.
      brandUrl: 'https://store.example.com/',
      headerColor: '#00CCFF',
    });
  });

  it('falls back to Tranzit branding when the response omits or nulls it', () => {
    const empty = { logoUrl: null, brandUrl: null, headerColor: null };
    assert.deepEqual(normalizeShipment({}, 'MP1').branding, empty);
    assert.deepEqual(
      normalizeShipment(
        { branding: { logo: null, brand_url: null, header_color: null } },
        'MP1',
      ).branding,
      empty,
    );
  });

  it('rejects unsafe branding urls and malformed colours', () => {
    const result = normalizeShipment(
      {
        branding: {
          logo: 'javascript:alert(1)',
          brand_url: 'data:text/html,<script>',
          header_color: 'rebeccapurple',
        },
      },
      'MP1',
    );
    assert.deepEqual(result.branding, {
      logoUrl: null,
      brandUrl: null,
      headerColor: null,
    });
  });

  it('drops empty events and tolerates a missing events array', () => {
    assert.equal(normalizeShipment({ events: null }, 'MP1').events.length, 0);
    assert.equal(
      normalizeShipment({ events: [{ title: '  ', description: null }] }, 'MP1').events.length,
      0,
    );
  });
});
