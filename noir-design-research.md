# Noir Design Research - Phillip Gilliam Author Website

## Color Palette

### Primary Noir Colors
- **Midnight Black**: `#0a0a0f` - Deep void background
- **Blood Red**: `#8b0000` - Accent for murder, danger
- **Police Siren Blue**: `#1a3a5c` - Trust, authority
- **Neon Amber**: `#ff6b00` - Cigarette glow, streetlights
- **Fog Gray**: `#2a2a35` - Atmospheric depth
- **Cream White**: `#f5f0e6` - Text on dark, aged paper feel

### Supporting Accents
- **Chrome Silver**: `#c0c0c0` - Metallic edges
- **Shadow Purple**: `#1a1025` - Deep shadows
- **Rain Blue**: `#1e3a5f` - Wet streets reflection

## Typography

### Display/Headlines
- **Primary**: "Cinzel Decorative" (Google Fonts) - Art Deco elegance
- **Alternative**: "Playfair Display" - Classic noir sophistication
- **Impact**: "Oswald" - Bold, condensed for chapter titles

### Body Text
- **Primary**: "Lora" - Readable serif with character
- **Alternative**: "Source Sans Pro" - Clean for long passages

### Accent/Captions
- **Pacifico** - Handwritten notes, crime scene labels
- **Courier Prime** - Typewriter effect for evidence files

## Visual Style References

### Classic Film Noir
- High contrast lighting (chiaroscuro)
- Venetian blind shadows
- Rain-soaked streets
- Cigarette smoke wisps
- Venetian blinds projections
- Wet pavement reflections

### Modern Interpretations
- Sin City graphic novel aesthetic
- Blade Runner 2049 neon dystopia
- True Detective opening credits
- Mindhunter Netflix title sequence

### Motion Design Elements
- Parallax scrolling at 0.5x speed for background
- Ken Burns effect on still imagery
- Particle systems for rain/smoke
- Glitch transitions between sections
- Text reveal through "typing" animation

## UI/UX Patterns

### Navigation
- Hidden hamburger menu (film noir mystery)
- Or reveal navigation on scroll up
- Cinematic full-screen overlay with vignette

### Buttons
- Sharp edges (not rounded) - 1px border
- Hover: Glow effect with red/amber accent
- Active state: Inverted colors

### Cards (Book Display)
- Heavy drop shadows
- Slight rotation (3-5 degrees)
- Hover: Lift + shadow intensify
- Texture: Subtle paper grain overlay

## Immersive Section Ideas

### Hero Section
- Full viewport video or 3D scene
- Fog/particulate effects
- Animated cigarette smoke
- Typing text effect for title

### Book Showcase
- 3D rotating book cover (CSS or Spline)
- Parallax pages turning
- Shadows that respond to scroll
- "Open book" reveal on click

### Timeline/Story Section
- Vertical scrolling storyline
- Evidence board aesthetic
- Polaroid photos with strings
- Red thread connecting clues

### Mini-Series Section
- Episode cards with "Coming Soon" stamps
- TV static transition effects
- Retro TV frame container
- Scan lines overlay

## Technical Implementation Notes

### Libraries to Consider
- **Three.js** - For custom 3D scenes
- **GSAP ScrollTrigger** - Parallax and scroll animations
- **Lenis** - Smooth scrolling
- **SplitType** - Text animations
- **SFX** - Sound effects library (optional)

### Performance
- Lazy load 3D content
- Use Intersection Observer for animations
- Prefers-reduced-motion fallbacks
- WebP images with fallbacks

## Noir Mini-Series Content Ideas

Based on "Black Leather Apron":
- Episode concepts adapting chapters
- Character profile videos
- Behind-the-scenes of Baltimore locations
- Jack the Ripper historical context
- True crime parallels
- Author commentary tracks
