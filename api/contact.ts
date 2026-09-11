import { onRequestPost } from '../functions/api/contact'

export function POST(request: Request) {
  return onRequestPost({
    request,
    env: {
      DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
      CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    },
  })
}
