# Cloudflare deployment setup

Use Cloudflare Pages on the Free plan with these build settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`

Add these encrypted environment variables under the Pages project's **Settings → Variables and Secrets**:

- `DISCORD_WEBHOOK_URL`: the incoming webhook URL created specifically in the Discord `#orders` channel
- `RESEND_API_KEY`: a restricted Resend API key
- `CONTACT_TO_EMAIL`: `hello@misslouisebakery.com`
- `CONTACT_FROM_EMAIL`: `Miss Louise Bakery <hello@misslouisebakery.com>`

The `misslouisebakery.com` sending domain must be verified in Resend. Add only the DNS records Resend supplies; keep the existing Google Workspace/Gmail MX records in place so `hello@misslouisebakery.com` continues receiving mail.

For the website domain, either:

1. Keep Squarespace nameservers and connect a `www` subdomain to Cloudflare Pages with the CNAME Cloudflare supplies; or
2. Move DNS hosting to Cloudflare by changing nameservers, after copying every existing DNS record—including Google Workspace MX, SPF, DKIM, and verification records.

Do not place the Discord webhook URL or Resend API key in frontend code or a `VITE_` environment variable.

To create the Discord webhook, open `#orders`, choose **Edit Channel → Integrations → Webhooks → New Webhook**, and copy its URL into the encrypted `DISCORD_WEBHOOK_URL` secret. The webhook URL determines which channel receives the order; the channel name is never exposed to the browser.

## Email delivery setup

1. Confirm `hello@misslouisebakery.com` is an active Google Workspace mailbox and can receive a normal test email.
2. In Resend, add `misslouisebakery.com` under **Domains**.
3. Copy the SPF, DKIM, and return-path records shown by Resend into the domain's DNS settings. Do not remove or replace the existing Google Workspace MX records.
4. Wait until the domain shows **Verified** in Resend.
5. Under **API Keys**, create a key named `Miss Louise website`, choose **Sending access**, and restrict it to `misslouisebakery.com`.
6. Copy the key once and save it directly as Cloudflare's encrypted `RESEND_API_KEY` secret.

## Discord delivery setup

1. In the Miss Louise Bakery Discord server, open the `#orders` channel settings.
2. Select **Integrations → Webhooks → New Webhook**.
3. Name it `Miss Louise Bakery Orders`, confirm its channel is `#orders`, and copy the webhook URL.
4. Save that URL directly as Cloudflare's encrypted `DISCORD_WEBHOOK_URL` secret. Treat the URL like a password.

## Cloudflare Pages variables

Open **Workers & Pages → the bakery Pages project → Settings → Variables and Secrets**. Add these to the Production environment:

| Name | Value | Type |
| --- | --- | --- |
| `CONTACT_TO_EMAIL` | `hello@misslouisebakery.com` | Text |
| `CONTACT_FROM_EMAIL` | `Miss Louise Bakery <hello@misslouisebakery.com>` | Text |
| `RESEND_API_KEY` | The Resend key beginning with `re_` | Encrypted secret |
| `DISCORD_WEBHOOK_URL` | The webhook URL created in `#orders` | Encrypted secret |

Save the variables, redeploy the site, then submit one clearly labeled test order. Confirm it appears both in the `hello@misslouisebakery.com` Gmail inbox and in Discord `#orders`. Resend's **Emails** log and Cloudflare's Function logs are the first places to check if one delivery is missing.
