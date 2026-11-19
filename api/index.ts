import type { IncomingMessage, ServerResponse } from 'http';
import { app } from '../server.ts';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const rawUrl = req.url || '/';
  const parsed = new URL(rawUrl, 'http://localhost');
  const subPath = parsed.searchParams.get('__path');
  if (subPath !== null) {
    parsed.searchParams.delete('__path');
    const qs = parsed.searchParams.toString();
    req.url = `/api/${subPath}${qs ? `?${qs}` : ''}`;
  }
  return app(req as Parameters<typeof app>[0], res as Parameters<typeof app>[1]);
}
