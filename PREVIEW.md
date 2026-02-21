# Website Preview - Phillip Gilliam

## Overview
An immersive, dynamic author website has been created with a noir aesthetic featuring rain effects, smoke animations, film grain, and dramatic typography.

## Screenshots

### Hero Section
The landing view features:
- Animated rain effect (30 drops with varying speeds)
- Rising smoke particles
- Cinematic title treatment with gold accent
- Two CTAs: "Explore Books" and "Watch Series"
- Film grain overlay + vignette for that noir atmosphere

```
[HERO PREVIEW - Dark background with rain, gold title "PHILLIP GILLIAM", 
 smoke rising, tagline "The John Talion Mysteries"]
```

### Books Section
Two-book grid display:
- Black Leather Apron (existing book)
- At All Times (NEW - your second book concept)

Each book features:
- 3D hover effect (rotates on Y-axis)
- Cover art placeholder (styled div)
- Price, description, meta tags
- Purchase/Pre-order buttons

```
[BOOKS PREVIEW - Two cards side by side, red border on hover,
 gold accents, dark gray background]
```

### Mini Series Section
Retro TV frame containing 6 episode cards:
- "The Butcher of Baltimore"
- "The Mind of a Killer"
- "The Clockwork Corpse" (NEW - At All Times)
- "The Watchmaker's Secret" (NEW)
- "Minutes to Midnight" (NEW)
- "Lex Talionis" (Series Finale)

Each card has:
- Large faded episode number
- Episode title + description
- "Coming Soon" badge
- Hover glow effect

```
[TV FRAME PREVIEW - Black TV border with scan lines,
 6 blue cards inside with episode info]
```

### About the Author
Split layout:
- Left: Author photo placeholder with red border accent
- Right: Full bio with highlighted spans
- Stats section: 2 Novels | 2 Patents | 40+ Years Writing

```
[ABOUT PREVIEW - Portrait area left, text right,
 three stat blocks at bottom]
```

## Color Palette
- **Midnight Black**: #0a0a0f (background)
- **Blood Red**: #8b0000 (accents, hover states)
- **Police Blue**: #1a3a5c (calm professional tone)
- **Neon Amber**: #ff6b00 (cta buttons, warmth)
- **Gold**: #c9a227 (luxury, book covers)
- **Fog Gray**: #2a2a35 (cards, sections)
- **Cream**: #f5f0e6 (text on dark backgrounds)

## Typography
- **Display**: Cinzel Decorative (Art Deco elegance)
- **Headings**: Playfair Display (classic publishing)
- **Body**: Lora (readable serif)
- **UI**: Source Sans Pro (clean navigation)

## Technical Highlights

### Rain System
```css
/* 30 CSS-animated raindrops */
.rain { animation: rain-fall linear infinite; }
@keyframes rain-fall {
  from { transform: translateY(-100vh); }
  to { transform: translateY(100vh); }
}
```

### Smoke Particles
```css
/* Rising fog effect */
.smoke-particle {
  animation: smoke-rise 8s ease-in-out infinite;
  filter: blur(20px);
}
```

### Scroll Reveal
```javascript
// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
});
```

## File Locations

All files are ready in:
```
/root/.openclaw/workspace/pgilliam-website/
├── index.html          ← Main website
├── animations.css      ← Advanced effects
├── spline-scenes.html  ← 3D integration
├── noir-design-research.md
├── spline-tech-guide.md
├── at-all-times-book-design.md
└── README.md
```

## Viewing Instructions

To view the site, run a local server:

```bash
cd /root/.openclaw/workspace/pgilliam-website
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Next Steps for Spline 3D

1. Go to https://spline.design/
2. Create 3 scenes:
   - **Hero**: Rainy Baltimore street (volumetric fog, street lamp)
   - **Books**: Twin floating book covers with dramatic lighting
   - **Evidence Board**: Detective's desk with polaroids
3. Get public URLs and paste into `spline-scenes.html`
4. Replace scene placeholders in `index.html`

## Summary

✅ Complete immersive website created
✅ Two books featured (Black Leather Apron + At All Times)  
✅ Noir aesthetic with rain, smoke, film grain
✅ Mini series section with 6 episodes
✅ Author bio with stats
✅ Contact form
✅ Spline 3D integration ready
✅ Responsive design
✅ Modern animations and effects

**Total Files**: 7 (1 HTML, 1 CSS, 4 documentation, 1 preview)