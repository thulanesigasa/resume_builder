import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Contact Form <support@rbptech.co.za>',
        to: ['support@rbptech.co.za'],
        reply_to: email,
        subject: `New Contact Message from ${name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({ success: true, data });
    } else {
      console.error('Resend API Error:', data);
      return NextResponse.json({ error: data.message || 'Failed to send email' }, { status: res.status });
    }
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
