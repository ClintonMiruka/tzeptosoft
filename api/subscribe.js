import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const email = String(req.body?.email ?? '').trim();

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const contactData = await resend.contacts.create({
      email: email.trim(),
      unsubscribed: false,
    });

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tzeptosoft@gmail.com',
      subject: `New Newsletter Subscriber: ${email}`,
      html: `
        <h3>New newsletter signup</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Audience contact:</strong> ${contactData?.id || 'created'}</p>
      `,
    });

    return res.status(200).json({ success: true, data: contactData });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return res.status(500).json({ success: false, error: error.message || 'Unable to subscribe at this time.' });
  }
}
