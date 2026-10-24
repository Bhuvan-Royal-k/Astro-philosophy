# Astro-philosophy
3d scroll website for Astro philosophy

---

# Astro Philosophy — Cinematic 3D Astrology Website

A premium South Indian Vedic astrology web experience featuring a cinematic scroll-driven journey from the cosmic starfield into a sacred Dravidian temple inner sanctum.

---

## Architecture & Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.4 + PostCSS with bespoke CSS design tokens (`globals.css`)
- **Animation**: GSAP 3.15 + ScrollTrigger (optimized pinning, scrub, reverse scrolling, and lifecycle cleanup)
- **Icons**: Lucide React
- **Typography**: Google Fonts — Cinzel (headings), Cormorant Garamond (italic philosophy), Plus Jakarta Sans (body)

---

## Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on Node.js v20.18 LTS)
- npm 9+

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
- **Desktop**: Open [http://localhost:5173/](http://localhost:5173/)
- **Mobile Device (Local Wi-Fi)**: Open `http://<YOUR_LAN_IP>:5173/` (e.g. `http://10.219.8.125:5173/`).
  *Ensure both your computer and phone are connected to the same Wi-Fi network.*

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, tree-shaken static bundle in the `dist/` directory ready to be served by any static host (Vercel, Netlify, Cloudflare Pages, Nginx, or AWS S3).

### 5. Preview Production Build
```bash
npm run preview
```

---

## Project Structure

```text
astro-philosophy/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg               # Sacred Dravidian temple & zodiac emblem logo
│   │   │   └── favicon.svg            # Antique gold yantra favicon
│   │   ├── video/
│   │   │   ├── README.md              # Instructions for placing temple-journey.mp4
│   │   │   └── temple-journey.mp4     # User-provided video file (optional)
│   │   ├── frames/
│   │   │   ├── README.md              # Instructions for frame sequences
│   │   │   ├── .gitkeep
│   │   │   └── ezgif-frame-001.jpg... # Extracted sequence frames (240 frames)
│   │   └── fonts/
│   │       └── .gitkeep
│   ├── favicon.ico                    # Fallback browser icon
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                 # Fixed glassmorphic navigation with mobile menu
│   │   ├── LoadingScreen.tsx          # Celestial yantra preloader with safety resolve
│   │   ├── ScrollProgress.tsx         # Golden glow scroll indicator bar
│   │   ├── CinematicHero.tsx          # Pinned 100svh scroll journey (video, canvas frames & fallback)
│   │   ├── AboutSection.tsx           # Temple philosophy, pillars & quote card
│   │   ├── ServicesSection.tsx        # Consultation offerings & highlights
│   │   ├── ContactSection.tsx         # Configurable contact info & appointment form
│   │   └── Footer.tsx                 # Dynamic copyright, links & ethical disclaimer
│   ├── hooks/
│   │   ├── useReducedMotion.ts        # Accessibility hook for prefers-reduced-motion
│   │   └── useIsMobile.ts             # Viewport detection hook (768px breakpoint)
│   ├── lib/
│   │   └── gsap.ts                    # Centralized GSAP & ScrollTrigger setup
│   ├── config/
│   │   └── site.ts                    # Central configuration for copy, media, and services
│   ├── styles/
│   │   └── globals.css                # Custom properties, glassmorphism, and scrollbars
│   ├── App.tsx                        # Root layout assembling all sections
│   └── main.tsx                       # React DOM entrypoint
├── .env.example                       # Environment variables template
├── .gitignore                         # Git ignore rules for node_modules, dist & large media
├── index.html                         # SEO meta tags, Google Fonts & root element
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── README.md
```

---

## Cinematic Asset System & Switching Modes

You can switch between **Video Mode** and **Frame-Sequence Mode** using a single configuration setting in [`src/config/site.ts`](file:///d:/website%20for%20mama/src/config/site.ts):

```typescript
export const siteConfig: SiteConfig = {
  hero: {
    // SWITCH CINEMATIC MODE HERE: 'video' | 'frame-sequence'
    mode: "frame-sequence",
    ...
  }
}
```

### Mode 1: Frame-Sequence Playback (Active by default)
- Extracted frames reside in `public/assets/frames/`.
- Configured for EZGIF naming convention:
  ```typescript
  frames: {
    dir: "/assets/frames",
    prefix: "ezgif-frame-",
    extension: ".jpg",
    padLength: 3,         // ezgif-frame-001.jpg to ezgif-frame-240.jpg
    startIndex: 1,
    totalFrames: 240,     // Total count of exported frames
    scrollDistanceMultiplier: 2.8,
  }
  ```
- **Performance Highlights**:
  - Preloads the initial frame immediately.
  - Spawns concurrent background image preloading workers for subsequent frames.
  - Uses smart nearest-frame caching during rapid scrolling so the canvas never flickers.
  - Preserves aspect ratio (`cover` fit) on all screen dimensions.

### Dedicated Mobile Portrait Sequence (9:16 / 9:19.5)

To eliminate the 2.4× crop zoom when displaying 16:9 landscape frames on tall smartphone screens, the architecture supports a dedicated vertical sequence:

- **Location**: `public/assets/frames-mobile/`
- **Installed Naming Convention**: `ezgif-frame-001.jpg` ... `ezgif-frame-300.jpg`
- **Installed Aspect Ratio & Dimensions**: `9:16` vertical portrait (720 × 1280)
- **Total Frames**: 300 continuous frames (1 to 300)
- **Automatic Viewport & Asset Detection**:
  - The website automatically probes whether `public/assets/frames-mobile/ezgif-frame-001.jpg` is present and returns valid image headers.
  - If assets are present **and** the user is viewing on a portrait or mobile device (`height > width` or `< 768px`), the website automatically scrubs the portrait sequence.
  - If mobile assets are absent, the website **gracefully falls back** to the 16:9 desktop sequence with centered focal alignment. No manual toggling is required.

#### Generating the Mobile Frames:
1. **Via FFmpeg**:
   ```bash
   ffmpeg -i vertical-temple-journey.mp4 -vf "fps=24,scale=1080:1920" -q:v 3 public/assets/frames-mobile/mobile-frame-%03d.jpg
   ```
2. **Via EZGIF**:
   - Upload vertical video to [ezgif.com/video-to-jpg](https://ezgif.com/video-to-jpg).
   - Set output frame rate to 24fps (or matching your desktop sequence frame count of 240).
   - Rename extracted files to `mobile-frame-001.jpg` through `mobile-frame-240.jpg` and place them in `public/assets/frames-mobile/`.

### Mode 2: Video-Based Playback
- Place your video file at:
  ```text
  public/assets/video/temple-journey.mp4
  ```
- In `src/config/site.ts`, set:
  ```typescript
  mode: "video"
  ```
- Uses HTML5 video element metadata preloading and smoothly scrubs `currentTime` mapped to the GSAP ScrollTrigger timeline without triggering unnecessary React re-renders.

### Development Fallback Mode
If neither the video nor the image sequence exists, the website automatically displays an interactive **procedural Dravidian temple & celestial zodiac canvas fallback**. It never leaves a blank page, broken image, or infinite loading state.

---

## Central Configuration (`src/config/site.ts`)

All content across the website is editable from [`src/config/site.ts`](file:///d:/website%20for%20mama/src/config/site.ts):

| Section | Config Field | Description |
|---|---|---|
| **Branding** | `meta` | Site title, tagline, tradition name, description |
| **Cinematic Hero** | `hero` | Playback mode, paths, total frames, overlay text |
| **Navigation** | `navigation` | Navigation links and labels |
| **About** | `about` | Philosophy narrative, 3 core pillars, quote |
| **Services** | `services.items` | Consultation titles, durations, badges, bullet highlights |
| **Contact** | `contact` | Phone, WhatsApp URL, email, location, timings |
| **Footer** | `footer` | Disclaimer, legal links, copyright text |

> **Note on Contact Fields**: Any contact field set to an empty string (`''`) or omitted will automatically be hidden in the UI.

---

## Accessibility & Performance

- **`prefers-reduced-motion`**: Automatically detected via `useReducedMotion.ts`. When enabled, animations are disabled and a static view is presented.
- **Mobile Optimized**: Tested with `100svh` modern viewport units, touch targets >= 44px, and horizontal overflow protection (`overflow-x: hidden`).
- **ScrollTrigger Cleanup**: All GSAP instances and listeners are properly garbage-collected when components unmount using `gsap.context()`.
- **Keyboard Navigation**: Accessible focus rings (`:focus-visible`), skip targets, and ARIA labels.
