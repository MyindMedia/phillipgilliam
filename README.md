# Phillip Gilliam Immersive Author Website

## 🎬 Overview

A completely reimagined, dynamic, and immersive website for noir author **Phillip Gilliam**, creator of the *John Talion Mysteries* series. This project transforms his existing basic WordPress site into a cinematic, atmospheric experience that captures the essence of film noir.

## 📚 Books Featured

### 1. Black Leather Apron (Published)
- **Price**: $18.99 | 146 pages
- **Plot**: Ex-homicide detective John Talion investigates the brutal murder of Sharon Bowling, daughter of a prominent Baltimore family. A suffocating tale of murder, greed, lust, revenge, and insanity with connections to Jack the Ripper.
- **Tagline**: *"The principle of retributive justice"*

### 2. At All Times (New Release!)
- **Price**: $18.99 | ~160 pages  
- **Plot**: When a clockmaker is found suspended from Baltimore's Emerson Tower, Talion enters a labyrinth of old money and family secrets. A killer obsessed with time stalks the city's clock towers.
- **Tagline**: *"Justice doesn't sleep. Neither does evil."*

## 🎨 Design Features

### Noiraesthetic
- **Color Palette**: Midnight black (#0a0a0f), Blood red (#8b0000), Police blue (#1a3a5c), Neon amber (#ff6b00), Gold accents (#c9a227)
- **Typography**: Cinzel Decorative (titles), Playfair Display (headers), Lora (body), Source Sans Pro (UI)
- **Atmospheric Effects**: Film grain overlay, vignette, animated rain, rising smoke particles
- **Immersion**: Parallax scrolling, smooth reveal animations, 3D book hover effects

### Technical Implementation
- **Rain System**: 30 individually animated rain drops with varying speeds
- **Film Grain**: SVG-based noise texture overlay
- **Smoke Particles**: Rising mist effect using CSS animations
- **Smooth Scrolling**: Intersection Observer API for reveals
- **Responsive Design**: Mobile-first with breakpoints at 968px

## 📺 Mini Series Section

**6-Episode Arc Structure**:
1. The Butcher of Baltimore (from Black Leather Apron)
2. The Mind of a Killer (from Black Leather Apron)  
3. The Clockwork Corpse (from At All Times) - NEW
4. The Watchmaker's Secret (from At All Times) - NEW
5. Minutes to Midnight (from At All Times) - NEW
6. Lex Talionis (Series Finale)

Each episode card features a retro TV aesthetic with scan lines and "Coming Soon" badges.

## 🎭 Spline 3D Integration

The site includes placeholders for three immersive 3D scenes:
1. **Hero Atmosphere**: Rain-soaked Baltimore street at night
2. **Book Showcase**: Interactive 3D floating book covers
3. **Detective's Desk**: Evidence board with polaroids and red string

*Note: Spline scene URLs need to be added to `spline-scenes.html` after creating them at spline.design*

## 📁 File Structure

```
pgilliam-website/
├── index.html                 # Main website (single page)
├── animations.css             # Advanced CSS animations
├── spline-scenes.html         # Spline 3D integration guide  
├── noir-design-research.md    # Design research document
├── spline-tech-guide.md       # Spline implementation guide
├── at-all-times-book-design.md  # New book concept
└── README.md                  # This file
```

## 🚀 Getting Started

### To View Locally
```bash
cd pgilliam-website
python -m http.server 8000
# Open http://localhost:8000 in browser
```

### To Deploy
1. Upload `index.html` and CSS files to web server
2. Add Spline scene URLs when ready
3. Upload author photo to `/images/author.jpg`
4. Upload book covers to `/images/black-leather-apron.jpg` and `/images/at-all-times.jpg`

## 📝 Content Sections

1. **Hero Section**: Full viewport with animated title, smoke, rain
2. **Books Grid**: Two-book showcase with hover effects  
3. **Mini Series**: Episodic cards in retro TV frame
4. **Author Bio**: Full biography with stats counter
5. **Contact Form**: Styled form with noir aesthetic
6. **Footer**: Publisher information and social links

## 🎮 User Experience Features

- **Noir Atmosphere**: Rain, film grain, vignette, smoke
- **Parallax Scrolling**: Smoke particles respond to scroll
- **Reveal Animations**: Content fades in as user scrolls
- **3D Book Effect**: Hover tilts book covers
- **Smooth Navigation**: Anchor link smooth scrolling
- **Custom Scrollbar**: Blood red accent on dark track

## 📊 Performance

- All CSS animations use `translate3d` and `opacity` (GPU accelerated)
- Intersection Observer for scroll-triggered animations
- Minimal JavaScript (~50 lines)
- SVG patterns instead of images for textures
- Lazy loading ready for Spline scenes

## 🔮 Future Enhancements

1. Add actual Spline 3D scenes with mouse interaction
2. Implement WebGL particle system for enhanced rain
3. Add sound design (rain, distant saxophone, typewriter)
4. Build chapter reveal animations using GSAP
5. Create evidence board interaction mini-game
6. Add newsletter signup with dark mode email templates

## 👤 Author Information

**Phillip Gilliam**
- Born: Norfolk, Virginia
- Education: Morgan State University (Physics & Engineering)
- Career: Communications Engineer at Verizon (40+ years)
- Patents: 2 (Biomechanics)
- Publisher: Jackson Publishing
- Location: Fayetteville, Georgia

---

*Built with ❤️ and a healthy dose of cynicism worthy of film noir.*