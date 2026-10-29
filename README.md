# ZeRo Graphics portfolio

## Run locally
Open `index.html` in a browser. Internet access is used for Google Fonts, Lucide icons, and the demo portfolio images. The layout and CSS artwork still render if external services are unavailable.

## Customize before publishing
1. Open `script.js` and set `SITE_CONFIG.whatsappNumber` to your real international phone number in digits only (example format: `94771234567`).
2. Set `SITE_CONFIG.email` and your social URLs.
3. Replace the designer name `[Designer Name]`, profile placeholder, project titles/images, and descriptions in `index.html`.
4. Update `SITE_CONFIG.stats` with genuine numbers only.
5. Replace the demo testimonials with real feedback you have permission to publish.
6. Review package prices, revision allowances, and delivery times in `index.html`.
7. Replace the external Unsplash demo images with your own optimized image URLs or local assets. For local assets, place them in an `images/` folder and update the `src` and `data-image` values consistently.

## Form behavior
The form validates input in the browser and prepares a WhatsApp message when a valid WhatsApp number is configured. It does not store or submit data to a server. A production contact form needs a backend or form service.

## Files
- `index.html` — page content and sections
- `style.css` — responsive visual system and animations
- `script.js` — configuration, navigation, filters, lightbox, testimonials, form validation
- `favicon.svg` — simple ZeRo Graphics brand favicon
