# Grilled.md — pgilliam.com alignment record

Last updated: 2026-09-09 (Lethal Black Understanding page build)

## Goal
Author site for Phillip Gilliam (Phillip Noire, LLC). Sell his books direct via Stripe Payment Links and pitch the Black Leather Apron film. Live at https://pgilliam.com.

## Stack
- Static site, no build step: `index.html`, `styles.css`, `script.js`, `confirmation.html`.
- Fonts: Playfair Display (serif), Plus Jakarta Sans (sans), JetBrains Mono. Icons: Phosphor light via unpkg. Motion One via jsdelivr ESM.
- Hosting: Netlify site `pgilliam` (id `8a6eba43-f13d-4513-9163-015311738d5b`), autodeploys `main` of GitHub `MyindMedia/phillipgilliam`. A push to `main` is a live deploy.
- Local working copy: this Dropbox folder (an unzipped copy, NOT a git checkout). Matches GitHub HEAD `4219725` as of 2026-09-09.

## Purchase flow (how "like the other books" works)
- Each book is a `PRODUCTS[id]` entry in `script.js` with a Stripe **Payment Link** URL, plus `.add-to-cart-btn` buttons carrying `data-product-id/name/price/image`.
- Cart drawer is client-side only; checkout redirects to the product's Payment Link. Card data never touches the site (Stripe hosted checkout = PCI processor; compliance gate satisfied, no protected data stored here).
- Payment Links redirect to `confirmation.html?book=<id>` which renders an order recap from a local map.
- Payment Links live in **Phillip's own Stripe account** (Phillip Noire, LLC). None of the Stripe keys in the Myind 1Password vault own them, so new links must be created in Phillip's Stripe dashboard.

## Scope of the 2026-09-09 change
- New standalone page `lethal-black-understanding.html` for the nonfiction title *Lethal Black Understanding in America: A Gathering of Information* (© 2026, ~50pp, IngramSpark paperback).
- Embeds the vertical promo video "The 1858 Law That Erased Black Genius" (self-hosted, `video/`).
- Home page gets a matching book card in the Books section, PRODUCTS entry, structured data, sitemap entry, confirmation recap entry.
- Buy flow wired identically to the novels; Payment Link URL is a single constant to fill in.

## Constraints
- **Palette is page-scoped (Lawrence, 2026-09-09).** Site default = the original noir (ink, bone, blood red) via tokens `--accent`, `--accent-hot`, `--accent-deep`, `--accent-rgb`, `--accent-glow`, `--on-accent*` in `styles.css :root`. The gold palette taken from the Lethal Black Understanding cover (`#FAB40A` accent, warm inks, parchment bone, dark `--on-accent` text on gold) lives in `body.theme-gold` and is applied ONLY on `lethal-black-understanding.html`. Never put `theme-gold` on the home page. `confirmation.html` carries its own noir copy of the tokens inline.
- **Home page stays the two novels.** The nonfiction title is reached through the "More Books" nav dropdown (and the mobile-menu group), not a card in the Books section.
- Reuse the design system as is: tokens in `styles.css :root`, `.book-3d`, `.book-feature`, `.btn`, nav, footer, cart drawer.
- No background jazz autoplay on the nonfiction page.
- Keep the site static; no bundler, no framework.
- Never push to `main` from a session without Lawrence's go: it deploys live.

## Non-goals
- No changes to the novel cards, film section, or contact form.
- No Stripe account access from this side; no server-side code.

## Open questions (need Lawrence / Phillip)
1. **Payment Link + price** for the new title: create in Phillip's Stripe (Payment Links → New → product "Lethal Black Understanding in America" → collect shipping → after payment redirect to `https://pgilliam.com/confirmation.html?book=lbu`), then paste the `buy.stripe.com/...` URL into `PRODUCTS.lbu.paymentLink` in `script.js`.
2. **Cover art.** Per Lawrence (2026-09-09), `images/lethal-black-understanding-cover.jpg` is page 1 of the IngramSpark interior PDF (gold title page with the cover artwork inset), rendered at 200 dpi via `pdftoppm` and fitted to 1200x1800. Replace with the separate IngramSpark cover file if one is ever supplied.
3. **ISBN** not present in the interior PDF; add to the meta block and structured data when known.
