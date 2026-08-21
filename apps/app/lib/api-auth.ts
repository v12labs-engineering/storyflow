import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@supabase/client';

export async function requireMatchingUser(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  const requestedId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!user || !requestedId || user.id !== requestedId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return user.id;
}
