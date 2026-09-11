# Vercel deployment setup

Vercel deploys `api/contact.ts` as the `/api/contact` Function used by the inquiry form.

Open **Vercel → Project → Settings → Environment Variables** and add these variables to **Production**, **Preview**, and **Development**:

| Name | Value |
| --- | --- |
| `CONTACT_TO_EMAIL` | `hello@misslouisebakery.com` |
| `CONTACT_FROM_EMAIL` | `Miss Louise Bakery <hello@misslouisebakery.com>` |
| `RESEND_API_KEY` | The private Resend key beginning with `re_` |
| `DISCORD_WEBHOOK_URL` | The private webhook URL created in Discord `#orders` |

Mark `RESEND_API_KEY` and `DISCORD_WEBHOOK_URL` sensitive. Never prefix them with `VITE_` or commit them to the repository.

After adding or changing environment variables, create a new deployment. Existing Vercel deployments do not receive newly added values.

Before testing email, confirm `misslouisebakery.com` shows **Verified** in Resend. Submit one clearly labeled test inquiry and confirm the success message says it was delivered to both Discord and email.
