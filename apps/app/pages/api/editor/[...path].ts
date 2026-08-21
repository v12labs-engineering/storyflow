import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@supabase/client';

const ALLOWED_ROUTES: Array<{ methods: string[]; pattern: RegExp }> = [
  { methods: ['GET', 'POST', 'PUT'], pattern: /^uploads$/ },
  { methods: ['DELETE'], pattern: /^uploads\/[A-Za-z0-9._-]+$/ },
  { methods: ['GET', 'POST'], pattern: /^templates$/ },
  { methods: ['POST'], pattern: /^templates\/download$/ },
  { methods: ['GET', 'PUT', 'DELETE'], pattern: /^templates\/[A-Za-z0-9._-]+$/ },
  { methods: ['GET', 'POST'], pattern: /^components$/ },
  { methods: ['DELETE'], pattern: /^components\/[A-Za-z0-9._-]+$/ },
  { methods: ['GET', 'POST'], pattern: /^creations$/ },
  { methods: ['GET', 'PUT'], pattern: /^creations\/[A-Za-z0-9._-]+$/ },
  { methods: ['GET'], pattern: /^elements$/ },
  { methods: ['GET'], pattern: /^fonts$/ },
  { methods: ['GET'], pattern: /^resources\/pixabay$/ },
];

function getConfiguredBaseUrl(): URL | null {
  const rawUrl = process.env.STORYFLOW_EDITOR_API_URL;
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const isSecure = url.protocol === 'https:';
    const isLocalDevelopment =
      process.env.NODE_ENV !== 'production' &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

    if ((!isSecure && !isLocalDevelopment) || url.username || url.password) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function isAllowed(method: string, path: string): boolean {
  return ALLOWED_ROUTES.some(
    (route) => route.methods.includes(method) && route.pattern.test(path),
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method || '';
  const pathParts = Array.isArray(req.query.path) ? req.query.path : [];
  const path = pathParts.join('/');

  if (!isAllowed(method, path)) {
    return res.status(404).json({ error: 'Editor service route not found' });
  }

  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const baseUrl = getConfiguredBaseUrl();
  const token = process.env.STORYFLOW_EDITOR_API_TOKEN;
  if (!baseUrl || !token) {
    return res.status(503).json({ error: 'Editor service is not configured' });
  }

  const upstreamUrl = new URL(baseUrl.toString());
  const basePath = upstreamUrl.pathname.replace(/\/$/, '');
  upstreamUrl.pathname = `${basePath}/${pathParts.map(encodeURIComponent).join('/')}`;

  const searchQuery = Array.isArray(req.query.query) ? req.query.query[0] : req.query.query;
  if (typeof searchQuery === 'string') {
    upstreamUrl.searchParams.set('query', searchQuery);
  }

  const hasBody = !['GET', 'HEAD'].includes(method) && req.body !== undefined;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');

    const responseBody = Buffer.from(await upstreamResponse.arrayBuffer());
    return res.status(upstreamResponse.status).send(responseBody);
  } catch {
    return res.status(502).json({ error: 'Editor service request failed' });
  }
}
