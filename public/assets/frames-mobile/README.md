# Dedicated Mobile Portrait Frame-Sequence (9:16 / 9:19.5)

This directory is reserved for an optional dedicated vertical (portrait) image sequence designed specifically for smartphones and vertical tablets.

## Why a Dedicated Mobile Sequence?
- The desktop frame sequence in `public/assets/frames/` is **1920 × 1080 (16:9 widescreen landscape)**.
- Modern smartphones have vertical portrait displays with aspect ratios between **9:16 (0.562)** and **9:19.5 (0.461)** (e.g., iPhone 12/13/14/15/16 and Samsung Galaxy devices).
- When a 16:9 landscape image is cropped to fill a vertical smartphone screen in full-bleed cover mode, only the central **~26%** of the frame's width is visible (~499px wide), which is magnified ~2.4x on 3x Retina screens.
- A dedicated portrait sequence rendered at **1080 × 1920** or **1080 × 2340** preserves 100% native resolution, razor-sharp architectural details of the Dravidian Gopuram, and optimal composition without digital zoom.

---

## Asset Naming Convention & Directory Path

Place your exported vertical frames directly in this folder:
- **Directory Path**: `public/assets/frames-mobile/`
- **Installed Naming Pattern**: `ezgif-frame-001.jpg` to `ezgif-frame-300.jpg`
- **Installed Format**: JPEG (720 × 1280, 9:16 vertical portrait)
- **Total Frames**: 300 frames (continuous, zero gaps)

| Parameter | Installed Value | Configurable In |
| :--- | :--- | :--- |
| Directory | `/assets/frames-mobile` | `src/config/site.ts` (`siteConfig.hero.frames.mobile.dir`) |
| Prefix | `ezgif-frame-` | `src/config/site.ts` (`siteConfig.hero.frames.mobile.prefix`) |
| Extension | `.jpg` | `src/config/site.ts` (`siteConfig.hero.frames.mobile.extension`) |
| Zero Padding | `3` (e.g. `001`, `002`) | `src/config/site.ts` (`siteConfig.hero.frames.mobile.padLength`) |
| Start Index | `1` | `src/config/site.ts` (`siteConfig.hero.frames.mobile.startIndex`) |
| Total Frames | `300` | `src/config/site.ts` (`siteConfig.hero.frames.mobile.totalFrames`) |

---

## How to Generate the Portrait Sequence

### Option A: Using FFmpeg (Command Line)
If you have a vertical MP4 video (`mobile-temple-journey.mp4`):
```bash
ffmpeg -i mobile-temple-journey.mp4 -vf "fps=24,scale=1080:1920" -q:v 3 public/assets/frames-mobile/mobile-frame-%03d.jpg
```
*Note: Adjust `-q:v 3` (values 2 to 5 give excellent balance between sharpness and small byte size, ~70KB to 120KB per frame).*

### Option B: Using EZGIF (Web Browser)
1. Go to [ezgif.com/video-to-jpg](https://ezgif.com/video-to-jpg).
2. Upload your portrait video file.
3. Set Frame Rate to match your desktop sequence (e.g., 20fps or 24fps) to yield 240 frames.
4. Export as JPG.
5. In the exported zip, rename the files to `mobile-frame-001.jpg` ... `mobile-frame-240.jpg` and copy them into this folder.

---

## Automatic Detection & Graceful Fallback
- **No manual toggle required**: Astro Philosophy automatically checks if `mobile-frame-001.jpg` is present on the server.
- **If present on a mobile/portrait screen**: The website seamlessly loads and scrubs the dedicated portrait sequence.
- **If absent or missing**: The website gracefully falls back to the desktop 16:9 sequence with centered focal cropping without breaking scroll synchronization or triggering 404 spam.
