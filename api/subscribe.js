import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  return new Resend(apiKey);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = String(req.body?.email ?? '').trim();

    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    const resend = getResendClient();

    let contact;
    try {
      contact = await resend.contacts.create({
        email,
        unsubscribed: false,
      });
    } catch (error) {
      const message = error?.message || '';
      if (/already exists|duplicate/i.test(message)) {
        contact = { id: 'existing-contact' };
      } else {
        throw error;
      }
    }

    const welcomeEmail = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Tzeptosoft Newsletter!',
      html: `
        <h2>Welcome to Tzeptosoft</h2>
        <p>Congratulations! You are now subscribed to the official Tzeptosoft newsletter.</p>
        <p>Expect sharp insights, tactical lessons, and powerful updates directly in your inbox.</p>
      `,
    });

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tzeptosoft@gmail.com',
      subject: `New Newsletter Subscriber: ${email}`,
      html: `
        <h3>New newsletter subscriber</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact created:</strong> ${contact?.id || 'unknown'}</p>
      `,
    });

    return res.status(200).json({ success: true, welcomeEmail });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to subscribe at this time.' });
  }
}
