// SigV4 query-string presigning for Cloudflare R2 (S3-compatible), no dependencies.
// Lives outside netlify/functions/ so Netlify does not treat it as a function.
import { createHash, createHmac } from 'node:crypto';

const sha256Hex = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const hmac = (key, s) => createHmac('sha256', key).update(s, 'utf8').digest();

// RFC 3986 encoding as S3 expects it (encodeURIComponent leaves !'()* alone).
const enc = (s) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());

/**
 * Build a presigned GET URL.
 * @param {object} o
 * @param {string} o.endpoint  e.g. https://<account>.r2.cloudflarestorage.com
 * @param {string} o.bucket
 * @param {string} o.key       object key, slashes allowed
 * @param {string} o.accessKeyId
 * @param {string} o.secretAccessKey
 * @param {number} [o.expiresIn=3600] seconds, max 604800
 * @param {string} [o.region='auto']
 * @param {Record<string,string>} [o.query] extra signed params, e.g. response-content-disposition
 * @param {Date} [o.now]
 */
export function presignGet(o) {
  const region = o.region || 'auto';
  const now = o.now || new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const day = amzDate.slice(0, 8);
  const scope = `${day}/${region}/s3/aws4_request`;
  const url = new URL(o.endpoint);
  const host = url.host;
  const path = '/' + [o.bucket, ...o.key.split('/')].filter(Boolean).map(enc).join('/');

  const params = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${o.accessKeyId}/${scope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(o.expiresIn || 3600),
    'X-Amz-SignedHeaders': 'host',
    ...(o.query || {}),
  };
  const canonicalQuery = Object.keys(params)
    .sort()
    .map((k) => `${enc(k)}=${enc(params[k])}`)
    .join('&');

  const canonicalRequest = ['GET', path, canonicalQuery, `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256Hex(canonicalRequest)].join('\n');

  const kDate = hmac('AWS4' + o.secretAccessKey, day);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, 's3');
  const kSigning = hmac(kService, 'aws4_request');
  const signature = createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  return `${url.protocol}//${host}${path}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}
