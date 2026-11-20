import type { IncomingMessage, ServerResponse } from 'http';
import { app } from '../server.ts';

export default function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const rawUrl = req.url || '/';
  const parsed = new URL(rawUrl, 'http://localhost');
  const subPath = parsed.searchParams.get('__path');
  if (subPath !== null) {
    parsed.searchParams.delete('__path');
    const qs = parsed.searchParams.toString();
    req.url = `/api/${subPath}${qs ? `?${qs}` : ''}`;
  }

  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    res.once('finish', finish);
    res.once('close', finish);
    app(req as Parameters<typeof app>[0], res as Parameters<typeof app>[1]);
  });
}
