This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## My Spotify App

Spotify OAuth (Authorization Code with refresh) using Next.js App Router and `spotify-web-api-node`.

### Environment Variables (.env.local)

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=change_this_secret
```

For Render production set `SPOTIFY_REDIRECT_URI=https://yourapp.onrender.com/api/auth/callback`.

### Scripts

`npm run dev` - start dev server

### Auth Flow
1. User hits `/api/auth/login` -> redirected to Spotify
2. Spotify redirects to `/api/auth/callback` -> tokens stored in httpOnly cookies (signed)
3. Data routes `/api/tracks` & `/api/playlists` read & refresh tokens when needed

### Deployment (Render)
1. Build Command: `npm install && npm run build`
2. Start Command: `npm start`
3. Add env vars above (Render sets `PORT` automatically)
4. Use `RENDER_EXTERNAL_URL` (automatically provided) for absolute fetches if needed

### Notes
- Refresh logic triggers when access token < 60s remaining.
- Cookies are signed (HMAC SHA256) to detect tampering.
- Adjust limits or add more endpoints as desired.
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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
