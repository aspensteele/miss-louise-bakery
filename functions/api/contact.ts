interface ContactEnvironment {
  DISCORD_WEBHOOK_URL?: string
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
}

interface ContactInquiry {
  type: 'order' | 'inquiry'
  name: string
  reply: string
  inquiry: string
  date?: string
  details: string
  website?: string
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' },
})

const clean = (value: unknown, limit: number) => String(value ?? '').trim().slice(0, limit)
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
}[character] ?? character))

async function notifyDiscord(webhookUrl: string, inquiry: ContactInquiry) {
  const response = await fetch(`${webhookUrl}?wait=true`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: 'Miss Louise Bakery Orders',
      allowed_mentions: { parse: [] },
      embeds: [{
        title: inquiry.type === 'order' ? 'New online order request' : 'New bakery inquiry',
        color: 0xf00b0d,
        fields: [
          { name: 'Name', value: inquiry.name, inline: true },
          { name: 'Best way to reply', value: inquiry.reply, inline: true },
          { name: 'Inquiry', value: inquiry.inquiry, inline: true },
          { name: 'Date needed', value: inquiry.date || 'Flexible', inline: true },
          { name: 'Details', value: inquiry.details.slice(0, 1024) },
        ],
        timestamp: new Date().toISOString(),
      }],
    }),
  })
  if (!response.ok) throw new Error(`Discord returned ${response.status}`)
}

async function sendEmail(apiKey: string, from: string, to: string, inquiry: ContactInquiry) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
      'user-agent': 'miss-louise-bakery-contact/1.0',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: inquiry.reply.includes('@') ? inquiry.reply : undefined,
      subject: `Miss Louise Bakery ${inquiry.type === 'order' ? 'order request' : 'inquiry'} from ${inquiry.name}`,
      text: [
        `Name: ${inquiry.name}`,
        `Best way to reply: ${inquiry.reply}`,
        `Inquiry: ${inquiry.inquiry}`,
        `Date needed: ${inquiry.date || 'Flexible'}`,
        '',
        inquiry.details,
      ].join('\n'),
      html: `<h2>${inquiry.type === 'order' ? 'New online order request' : 'New bakery inquiry'}</h2>
        <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
        <p><strong>Best way to reply:</strong> ${escapeHtml(inquiry.reply)}</p>
        <p><strong>Inquiry:</strong> ${escapeHtml(inquiry.inquiry)}</p>
        <p><strong>Date needed:</strong> ${escapeHtml(inquiry.date || 'Flexible')}</p>
        <p><strong>Details:</strong><br>${escapeHtml(inquiry.details).replace(/\n/g, '<br>')}</p>`,
    }),
  })
  if (!response.ok) throw new Error(`Resend returned ${response.status}`)
}

export const onRequestPost = async ({ request, env }: { request: Request, env: ContactEnvironment }) => {
  let input: Record<string, unknown>
  try {
    input = await request.json() as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  if (clean(input.website, 100)) return json({ ok: true })

  const inquiry: ContactInquiry = {
    type: clean(input.type, 20) === 'order' ? 'order' : 'inquiry',
    name: clean(input.name, 100),
    reply: clean(input.reply, 160),
    inquiry: clean(input.inquiry, 100),
    date: clean(input.date, 30),
    details: clean(input.details, 1800),
  }
  if (!inquiry.name || !inquiry.reply || !inquiry.inquiry || !inquiry.details) {
    return json({ error: 'Please complete all required fields.' }, 400)
  }

  const tasks: Array<Promise<void>> = []
  const channels: string[] = []
  if (env.DISCORD_WEBHOOK_URL) {
    tasks.push(notifyDiscord(env.DISCORD_WEBHOOK_URL, inquiry))
    channels.push('Discord')
  }
  if (env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL) {
    tasks.push(sendEmail(env.RESEND_API_KEY, env.CONTACT_FROM_EMAIL, env.CONTACT_TO_EMAIL || 'aspenlax30@gmail.com', inquiry))
    channels.push('email')
  }
  if (!tasks.length) return json({ error: 'Contact delivery is not configured.' }, 503)

  const results = await Promise.allSettled(tasks)
  const delivered = channels.filter((_, index) => results[index].status === 'fulfilled')
  const failed = channels.filter((_, index) => results[index].status === 'rejected')
  if (!delivered.length) return json({ error: 'Inquiry delivery failed.' }, 502)
  return json({ ok: true, delivered, failed })
}
