import type { IncomingMessage } from 'http';
import type { User } from '@supabase/supabase-js';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export function isLocalDemoRequest(req: IncomingMessage): boolean {
  if (process.env.NODE_ENV === 'production' || process.env.STORYFLOW_DEMO_MODE !== 'true') {
    return false;
  }

  const rawHost = req.headers.host || '';
  const host = rawHost.startsWith('[')
    ? rawHost.slice(0, rawHost.indexOf(']') + 1)
    : rawHost.split(':')[0];

  return LOOPBACK_HOSTS.has(host);
}

export const localDemoUser = {
  id: 'local-demo-storyteller',
  email: 'sarah@storyflow.local',
  role: 'authenticated',
  aud: 'authenticated',
  app_metadata: { provider: 'local-demo' },
  user_metadata: { name: 'Sarah Demo', company: 'Acme Cloud' },
  created_at: '2026-01-01T00:00:00.000Z',
} as unknown as User;

export const localDemoStories = [
  {
    id: 'demo-product-launch',
    name: 'Product Launch',
    description: 'A visual announcement for our newest product release.',
    url: '/story-thumbnails/product-launch.jpg',
    thumbnail: '/story-thumbnails/product-launch.jpg',
    status: 'Published',
    publishedAt: 'Aug 10, 2026',
    lastEdited: 'Aug 20, 2026',
    views: 12842,
    completionRate: 78,
    ctaClicks: 842,
    user_id: localDemoUser.id,
  },
  {
    id: 'demo-customer-story',
    name: 'Customer Spotlight',
    description: 'A customer success story built for the web.',
    url: '/story-thumbnails/customer-spotlight.jpg',
    thumbnail: '/story-thumbnails/customer-spotlight.jpg',
    status: 'Draft',
    publishedAt: 'Aug 19, 2026',
    lastEdited: 'Aug 19, 2026',
    views: 2431,
    completionRate: 64,
    ctaClicks: 183,
    user_id: localDemoUser.id,
  },
  {
    id: 'demo-weekly-update',
    name: 'Weekly Update',
    description: 'A reusable update story for sharing product and team highlights.',
    url: '/story-thumbnails/weekly-update.jpg',
    thumbnail: '/story-thumbnails/weekly-update.jpg',
    status: 'Published',
    publishedAt: 'Aug 14, 2026',
    lastEdited: 'Aug 18, 2026',
    views: 8276,
    completionRate: 71,
    ctaClicks: 512,
    user_id: localDemoUser.id,
  },
  {
    id: 'demo-design-systems',
    name: 'Design Systems in Practice',
    description: 'Showcasing how teams build better experiences, together.',
    url: '/story-thumbnails/design-systems.jpg',
    thumbnail: '/story-thumbnails/design-systems.jpg',
    status: 'Scheduled',
    publishedAt: 'Aug 23, 2026 at 9:00 AM',
    lastEdited: 'Aug 20, 2026',
    views: 1965,
    completionRate: 58,
    ctaClicks: 97,
    user_id: localDemoUser.id,
  },
  {
    id: 'demo-summer-campaign',
    name: 'Summer Campaign',
    description: 'Seasonal campaign story for summer promotions.',
    url: '/story-thumbnails/summer-campaign.jpg',
    thumbnail: '/story-thumbnails/summer-campaign.jpg',
    status: 'Published',
    publishedAt: 'Aug 6, 2026',
    lastEdited: 'Aug 17, 2026',
    views: 15903,
    completionRate: 82,
    ctaClicks: 1243,
    user_id: localDemoUser.id,
  },
];
