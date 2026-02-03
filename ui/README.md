This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to Cloudflare

This app is set up for [Cloudflare](https://cloudflare.com) via `@opennextjs/cloudflare` and Wrangler.

**One-time setup**

1. Install dependencies: `pnpm i`
2. Log in to Cloudflare: `pnpm exec wrangler login` (opens browser; use your Cloudflare account)

**Deploy**

From the `ui/` directory:

```bash
pnpm run deploy
```

This runs `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy`, which builds the Next.js app for Cloudflare and publishes it. The project name in `wrangler.jsonc` is `unico-land`; your site will be at `https://unico-land.<your-subdomain>.workers.dev` (or your custom domain if configured in the Cloudflare dashboard).

**Preview locally (Cloudflare build)**

```bash
pnpm run preview
```

Builds for Cloudflare and runs a local preview with Wrangler.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
