import type { HelpArticle } from "./types";

export const MOCK_ARTICLES: HelpArticle[] = [
  {
    id: '1',
    title: 'Registration & Account set up',
    slug: '/registration-account-set-up',
    category: 'Start',
    status: 'Published',
    updatedAt: '2026-02-25T00:40:00Z',
    content: 'Default content for registration and account set up.'
  },
  {
    id: '2',
    title: 'How to book a quote?',
    slug: '/how-to-book-quote',
    category: 'Booking',
    status: 'Draft',
    updatedAt: '2026-03-01T10:15:00Z',
    content: 'Learn how to book a quote easily.'
  },
  {
    id: '3',
    title: 'Tracking your shipment',
    slug: '/tracking-shipment',
    category: 'Shipping',
    status: 'Published',
    updatedAt: '2026-04-10T14:30:00Z',
    content: 'Everything you need to know about tracking.'
  }
];

export const ARTICLE_CATEGORIES = [
  { label: 'Start', value: 'Start' },
  { label: 'Booking', value: 'Booking' },
  { label: 'Payments', value: 'Payments' },
  { label: 'Shipping', value: 'Shipping' },
];

export const ARTICLE_STATUSES = [
  { label: 'Published', value: 'Published' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Archived', value: 'Archived' },
];
