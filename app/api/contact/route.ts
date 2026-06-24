import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Nord Creative <contact@nordcreative.dk>',
      to: 'contact@nordcreative.dk',
      replyTo: email,
      subject: `Ny henvendelse fra ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; color: #111;">
          <h2 style="font-weight: 400; margin-bottom: 24px;">Ny henvendelse via nordcreative.dk</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 100px;">Navn</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #111;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #666;">Telefon</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Besked</td><td style="padding: 8px 0; white-space: pre-wrap;">${message}</td></tr>
          </table>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
