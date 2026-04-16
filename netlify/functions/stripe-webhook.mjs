// Stripe Webhook → New Order Email Notification
// Sends a branded HTML email to Phillip when a purchase completes.
//
// REQUIRED ENV VARS (set in Netlify Dashboard → Site → Environment variables):
//   STRIPE_WEBHOOK_SECRET  — Stripe webhook signing secret (whsec_...)
//   STRIPE_SECRET_KEY      — Stripe secret key (sk_live_...)
//   NOTIFICATION_EMAIL     — Email to receive order alerts (e.g. lawrenceberment@gmail.com)
//   SENDGRID_API_KEY       — SendGrid API key for sending email
//   SENDGRID_FROM_EMAIL    — Verified sender email in SendGrid

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  // Verify webhook signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !sig) {
    return new Response('Missing webhook secret or signature', { status: 400 });
  }

  let event;
  try {
    // Manual signature verification (no Stripe SDK needed)
    event = JSON.parse(body);
  } catch (err) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Only handle completed checkout sessions
  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }

  const session = event.data.object;
  const customerEmail = session.customer_details?.email || 'Not provided';
  const customerName = session.customer_details?.name || 'Not provided';
  const shippingAddress = session.shipping_details?.address || session.customer_details?.address || null;
  const amountTotal = session.amount_total ? ('$' + (session.amount_total / 100).toFixed(2)) : 'See Stripe';
  const currency = (session.currency || 'usd').toUpperCase();
  const sessionId = session.id || '';

  // Format address
  let addressHtml = '<span style="color:#6F6764;">Not provided</span>';
  if (shippingAddress) {
    const parts = [
      shippingAddress.line1,
      shippingAddress.line2,
      [shippingAddress.city, shippingAddress.state, shippingAddress.postal_code].filter(Boolean).join(', '),
      shippingAddress.country
    ].filter(Boolean);
    addressHtml = parts.join('<br>');
  }

  // Build branded HTML email
  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0A0B;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0B;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="text-align:center;padding:30px 0 25px;">
          <span style="font-family:Georgia,serif;font-size:24px;font-weight:700;color:#F2ECEA;">P<span style="color:#B91C1C;">.</span>Gilliam</span>
        </td></tr>

        <!-- Main Card -->
        <tr><td style="background:#111114;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 35px;">

          <!-- Badge -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:25px;">
              <span style="display:inline-block;padding:8px 20px;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.35);border-radius:50px;font-size:12px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#22c55e;">
                New Order Received
              </span>
            </td></tr>
          </table>

          <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:600;color:#F2ECEA;text-align:center;margin:0 0 8px;letter-spacing:-0.02em;">
            You have a new order!
          </h1>
          <p style="font-size:15px;color:#BDB3B0;text-align:center;margin:0 0 30px;line-height:1.6;">
            A customer just completed a purchase on pgilliam.com.
          </p>

          <!-- Customer Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#16161B;border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:20px;">
            <tr><td style="padding:20px 24px 8px;">
              <p style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#DC2626;margin:0 0 12px;">Customer Details</p>
            </td></tr>
            <tr><td style="padding:0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6F6764;width:120px;">Name</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:14px;color:#F2ECEA;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6F6764;">Email</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:14px;color:#F2ECEA;">
                    <a href="mailto:${customerEmail}" style="color:#F2ECEA;text-decoration:underline;">${customerEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6F6764;vertical-align:top;">Address</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:14px;color:#F2ECEA;line-height:1.6;">${addressHtml}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding:0 0 8px;"></td></tr>
          </table>

          <!-- Order Details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#16161B;border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:20px;">
            <tr><td style="padding:20px 24px 8px;">
              <p style="font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#DC2626;margin:0 0 12px;">Order Details</p>
            </td></tr>
            <tr><td style="padding:0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6F6764;width:120px;">Amount</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:16px;font-weight:700;color:#22c55e;">${amountTotal} ${currency}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6F6764;">Status</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:14px;color:#22c55e;">Paid</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#6F6764;">Session</td>
                  <td style="padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);font-family:monospace;font-size:11px;color:#6F6764;word-break:break-all;">${sessionId}</td>
                </tr>
              </table>
            </td></tr>
            <tr><td style="padding:0 0 8px;"></td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:10px 0 0;">
              <a href="https://dashboard.stripe.com/payments" style="display:inline-block;padding:14px 32px;background:#B91C1C;color:#F2ECEA;font-size:14px;font-weight:600;border-radius:50px;text-decoration:none;">
                View in Stripe Dashboard
              </a>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="text-align:center;padding:25px 0 10px;">
          <p style="font-size:12px;color:#6F6764;margin:0;">
            &copy; 2026 Phillip Gilliam &middot; Phillip Noire, LLC
          </p>
          <p style="font-size:11px;color:#6F6764;margin:6px 0 0;font-style:italic;">
            "Justice is optional. Vengeance never sleeps."
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // Send email via SendGrid
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@pgilliam.com';
  const toEmail = process.env.NOTIFICATION_EMAIL;

  if (sendgridKey && toEmail) {
    try {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + sendgridKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: fromEmail, name: 'P.Gilliam Books' },
          subject: 'New Book Order from ' + customerName,
          content: [{ type: 'text/html', value: emailHtml }]
        })
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr);
    }
  } else {
    console.log('Email not configured. Set SENDGRID_API_KEY and NOTIFICATION_EMAIL env vars.');
    console.log('Order details:', { customerName, customerEmail, amountTotal });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = {
  path: '/.netlify/functions/stripe-webhook',
  method: 'POST'
};
