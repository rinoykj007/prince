# Prince & Malavika: Wedding Invitation

A single-page digital wedding invitation for **A.J Prince & Malavika P Panayam**, built to work on phones, tablets and desktops.

- **Wedding Ceremony:** Friday, 29 January 2027, Muhurtham 10:30 to 11:00 AM at J's International Convention Centre, Kalluvathukkal, Kollam
- **Wedding Reception:** Saturday, 30 January 2027, 5:30 to 9:00 PM at Marine Pride Beach Resort, Edava, Varkala

## Features

- "Save the Date" welcome screen with falling petals
- Hero photo carousel with a live countdown to the wedding
- Happy Couple, Our Families and The Big Day sections
- Add-to-calendar links (Google Calendar and `.ics` for Apple / Outlook)
- Dress code palette, photo gallery with lightbox, and highlights video
- RSVP form, greetings, live-stream link and a WhatsApp share button

## Tech stack

- [TanStack Start](https://tanstack.com/start) and TanStack Router (React 19, Vite)
- Tailwind CSS 4
- Nitro server output (Cloudflare by default, Vercel supported)

## Getting started

Requires Node.js 20+ and npm.

```sh
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint
npm test         # run tests
```

## Project structure

```
public/site-assets/photos/   Couple photos used across the page
src/routes/index.tsx         The invitation page and its sections
src/routes/__root.tsx        Root layout
src/styles/site.css          Captured site styles
```

To change a photo, replace the file in `public/site-assets/photos/` (or point the `src` in `src/routes/index.tsx` at a new one).

## RSVP

The RSVP form only sends data once `RSVP_ENDPOINT` in `src/routes/index.tsx` is set to a URL that accepts a JSON `POST` with `name`, `email`, `attend` and `guests`. Until then, it shows a message asking guests to contact the family directly.

## Deployment

The project deploys to Vercel straight from GitHub. Import the repository at [vercel.com/new](https://vercel.com/new) and keep the detected settings. The build uses `vite build`, and Nitro picks the Vercel output automatically.

To build for Vercel locally, run `NITRO_PRESET=vercel npm run build`.

## Lovable

This project is connected to [Lovable](https://lovable.dev). Changes pushed to the connected branch sync back into the Lovable editor, so avoid rewriting published git history.
