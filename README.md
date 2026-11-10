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

RSVPs are saved to a Google Sheet through a free Google Apps Script web app.

1. Create a new Google Sheet. In row 1 type: `Time`, `Name`, `Email`, `Attending`, `Guests`.
2. Open **Extensions > Apps Script**, replace the code with:

   ```js
   function doPost(e) {
     var d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([
       new Date(), d.name, d.email, d.attend === "yes" ? "Yes" : "No", d.guests
     ]);
     return ContentService.createTextOutput("ok");
   }
   ```

3. Click **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and authorise.
4. Copy the web app URL (ends in `/exec`) and paste it into `RSVP_ENDPOINT` in `src/routes/index.tsx`.
5. Commit and push. Vercel redeploys, and each RSVP appears as a new row.

If you change the script later, use **Deploy > Manage deployments > Edit > New version** so the URL stays the same.

## Deployment

The project deploys to Vercel straight from GitHub. Import the repository at [vercel.com/new](https://vercel.com/new) and keep the detected settings. The build uses `vite build`, and Nitro picks the Vercel output automatically.

To build for Vercel locally, run `NITRO_PRESET=vercel npm run build`.
