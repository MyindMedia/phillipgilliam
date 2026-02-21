# Spline.design Integration Guide

## What is Spline?
Spline is a browser-based 3D design tool that creates interactive web experiences. Perfect for creating immersive noir scenes without heavy Three.js coding.

## URL Strategy for Spline Scenes

Since we cannot directly embed live Spline scenes without an account, we'll create:
1. Placeholder iframes for Spline URLs
2. CSS fallbacks that capture the noir aesthetic
3. Three.js fallbacks for key animations

## Recommended Spline Scene Types

### Scene 1: Hero Atmosphere
**Concept**: Rain-soaked Baltimore street at night
**Elements**:
- Wet pavement with reflection
- Street lamp with volumetric glow
- Animated rain particles
- Fog/mist layers
- Neon sign in distance (blur effect)

**Export Settings**:
- Format: Spline Viewer (iframe embed)
- Size: 1920x1080 base resolution
- Loop: Continuous
- Interactions: Mouse parallax on camera

### Scene 2: Book 3D Showcase
**Concept**: Floating, rotating book covers in dramatic lighting
**Elements**:
- "Black Leather Apron" book model
- "At All Times" book model  
- Dramatic rim lighting (blue/orange contrast)
- Floating dust particles
- Shadow casting on invisible floor

**Interaction Points**:
- Click to rotate book
- Hover to open book slightly
- Scroll to zoom between books

### Scene 3: Detective's Desk
**Concept**: Evidence and case files scattered on desk
**Elements**:
- Vintage desk surface (wood texture)
- Scattered polaroid photos
- Cigarette smoke rising
- Typewriter in background
- Suspenseful desk lamp lighting

**Interactions**:
- Click items to examine
- Paper shuffling sounds
- Light flicker effect

## Technical Implementation

### Embedding Methods

```html
<!-- Method 1: Direct Spline Embed (when available) -->
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.54/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/SCENE-ID/scene.splinecode"></spline-viewer>

<!-- Method 2: Fallback CSS Animation -->
<div class="spline-fallback">
  <div class="rain-effect"></div>
  <div class="fog-layer"></div>
  <div class="street-light-glow"></div>
</div>
```

### Performance Best Practices

1. **Loading Strategy**
   - Lazy load Spline scenes
   - Show CSS fallback initially
   - Replace with 3D when in viewport

2. **Mobile Considerations**
   - Detect touch devices
   - Reduce particle counts
   - Disable heavy effects on low-power mode

3. **File Size**
   - Keep scenes under 2MB for web
   - Compress textures
   - Limit polygon count

## Creating Noir Atmosphere in Spline

### Lighting Setup
```
Key Light: Blue-ish (moonlight) - Intensity 0.8
Fill Light: Amber/orange (street lamp) - Intensity 0.4
Rim Light: White - Intensity 0.6
Volumetric: Fog/mist for depth
```

### Materials
- **Wet Pavement**: High specular, low roughness
- **Paper**: Subsurface scattering for realism
- **Leather**: Normal map for texture
- **Metal**: High metallic, clear coat

### Animation Patterns
- **Rain**: Particle system falling
- **Smoke**: Sine wave distortion on plane
- **Dust**: Slow floating particles
- **Camera**: Subtle breathing motion

## CSS Fallback Animations

When Spline isn't available, these CSS effects capture the vibe:

```css
/* Rain Effect */
.rain-effect {
  background: repeating-linear-gradient(
    transparent,
    transparent 2px,
    rgba(100, 150, 255, 0.1) 3px,
    rgba(100, 150, 255, 0.1) 4px
  );
  animation: rain-fall 0.5s linear infinite;
}

/* Vignette */
.vignette {
  background: radial-gradient(
    circle at center,
    transparent 40%,
    rgba(0, 0, 0, 0.8) 90%
  );
}

/* Fog */
.fog-layer {
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(200, 200, 220, 0.1) 50%,
    transparent
  );
  filter: blur(30px);
}
```
