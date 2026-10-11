// GET /api/ebook-download?session_id=cs_...
// Releases the eBook files only to a paid Stripe Checkout Session created by the eBook
// Payment Link. Files live in a private Cloudflare R2 bucket; the buyer gets short-lived
// presigned links, so nothing downloadable sits on the public site.
//
// Env (Netlify, all secret):
//   STRIPE_RESTRICTED_KEY  rk_live_... from the Phillip Noire, LLC account, Checkout Sessions: read
//   EBOOK_PAYMENT_LINK_ID  plink_... of the eBook Payment Link
//   R2_ENDPOINT            https://<account>.r2.cloudflarestorage.com
//   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
//   EBOOK_DOWNLOAD_DAYS    optional, how long a purchase can re-download (default 30)
import { presignGet } from '../lib/r2-presign.mjs';

const FILES = [
  {
    format: 'EPUB',
    note: 'Apple Books, Kindle (Send to Kindle), Kobo, Google Play Books',
    key: 'lethal-black-understanding/v1/Lethal_Black_Understanding_in_America.epub',
    filename: 'Lethal_Black_Understanding_in_America.epub',
  },
  {
    format: 'PDF',
    note: 'Exact print layout, best on a tablet or computer',
    key: 'lethal-black-understanding/v1/Lethal_Black_Understanding_in_America.pdf',
    filename: 'Lethal_Black_Understanding_in_America.pdf',
  },
];

const LINK_TTL_SECONDS = 60 * 60;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export default async (req) => {
  if (req.method !== 'GET') return json(405, { error: 'method_not_allowed' });

  const env = (k) => (process.env[k] || '').trim();
  const stripeKey = env('STRIPE_RESTRICTED_KEY');
  const linkId = env('EBOOK_PAYMENT_LINK_ID');
  const r2 = {
    endpoint: env('R2_ENDPOINT'),
    accessKeyId: env('R2_ACCESS_KEY_ID'),
    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
    bucket: env('R2_BUCKET'),
  };
  // An empty secret must fail closed here, never reach Stripe or the signer.
  if (!stripeKey || !linkId || Object.values(r2).some((v) => !v)) {
    console.error('ebook-download: missing configuration');
    return json(500, { error: 'not_configured' });
  }

  const sessionId = new URL(req.url).searchParams.get('session_id') || '';
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    return json(400, { error: 'invalid_session' });
  }

  let session;
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { authorization: `Bearer ${stripeKey}` },
    });
    if (res.status === 404) return json(404, { error: 'not_found' });
    if (!res.ok) {
      console.error('ebook-download: stripe responded', res.status);
      return json(502, { error: 'stripe_unavailable' });
    }
    session = await res.json();
  } catch (err) {
    console.error('ebook-download: stripe request failed', err && err.message);
    return json(502, { error: 'stripe_unavailable' });
  }

  // Only a completed, paid session from the eBook link unlocks the files.
  if (session.payment_link !== linkId) return json(404, { error: 'not_found' });
  if (session.status !== 'complete' || session.payment_status !== 'paid') {
    return json(402, { error: 'not_paid' });
  }

  const days = Number(env('EBOOK_DOWNLOAD_DAYS')) || 30;
  const expiresAt = (session.created + days * 86400) * 1000;
  if (Date.now() > expiresAt) return json(410, { error: 'expired' });

  const files = FILES.map((f) => ({
    format: f.format,
    note: f.note,
    filename: f.filename,
    url: presignGet({
      ...r2,
      key: f.key,
      expiresIn: LINK_TTL_SECONDS,
      query: { 'response-content-disposition': `attachment; filename="${f.filename}"` },
    }),
  }));

  return json(200, {
    files,
    linkExpiresInSeconds: LINK_TTL_SECONDS,
    redownloadUntil: new Date(expiresAt).toISOString(),
  });
};

export const config = { path: '/api/ebook-download' };
