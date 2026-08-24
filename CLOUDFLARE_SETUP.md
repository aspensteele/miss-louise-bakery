# Cloudflare deployment setup

Use Cloudflare Pages on the Free plan with these build settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`

Add these encrypted environment variables under the Pages project's **Settings → Variables and Secrets**:

- `DISCORD_WEBHOOK_URL`: the incoming webhook URL created in the private Discord channel
- `RESEND_API_KEY`: a restricted Resend API key
- `CONTACT_TO_EMAIL`: `aspenlax30@gmail.com`
- `CONTACT_FROM_EMAIL`: for example, `Miss Louise Bakery <orders@your-domain.com>`

The sending domain in `CONTACT_FROM_EMAIL` must be verified in Resend. Add the DNS records Resend supplies in the Squarespace domain's DNS panel.

For the website domain, either:

1. Keep Squarespace nameservers and connect a `www` subdomain to Cloudflare Pages with the CNAME Cloudflare supplies; or
2. Move DNS hosting to Cloudflare by changing nameservers, after copying every existing DNS record—including Google Workspace MX, SPF, DKIM, and verification records.

Do not place the Discord webhook URL or Resend API key in frontend code or a `VITE_` environment variable.
