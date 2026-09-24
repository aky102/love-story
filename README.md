# Love Story — Vercel + Supabase ❤️

## 1. Supabase
Create a Supabase project.

Open **SQL Editor**, paste all of `supabase.sql`, and run it.

Then go to **Storage → New bucket**, create a bucket named:
`memories`

Make the bucket **Public**.

## 2. Get Supabase keys
Open your project's **Connect/API settings** and copy:
- Project URL
- Publishable key (or legacy anon key)

Put them in `config.js`.

Never put a `service_role` or secret key in `config.js`.

## 3. GitHub
Create a repository and upload:
- index.html
- story.html
- style.css
- creator.js
- story.js
- config.js
- vercel.json
- supabase.sql
- README.md

## 4. Vercel
Import the GitHub repository into Vercel and deploy it.

After deployment, open the Vercel URL. Create a story.

The creator page will produce:
`https://YOUR-SITE.vercel.app/love/ABC123`

Send that link to another phone.

## 5. Important security note
This starter project intentionally allows anonymous creation/read access so it works without user accounts. Anyone who knows a story ID can read that story. Do not put passwords, private secrets, or sensitive personal information in the form.

For a private production system, add authentication or stronger access controls.
