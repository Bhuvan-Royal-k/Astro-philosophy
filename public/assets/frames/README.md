# Frame-Sequence Asset Directory (EZGIF / Extracted Frames)

Place your extracted image sequence frames here:
- **Default naming pattern**: `frame_0001.jpg`, `frame_0002.jpg`, `frame_0003.jpg`, ...
- **Configurable format**: You can customize the prefix, suffix, zero-padding, and total frame count in `src/config/site.ts`.
- **Recommended format**: High quality JPG or WebP (e.g. 1920x1080 or 1280x720, compressed 80-85%).
- **Exporting from EZGIF**:
  1. Upload video to EZGIF Video to JPG converter (or use ffmpeg).
  2. Set frame rate (e.g., 20fps or 24fps).
  3. Download zip, extract files, and ensure naming matches `frame_%04d.jpg` or update `siteConfig.hero.frames.namingPattern` in `src/config/site.ts`.

When frame-sequence mode is active in `siteConfig.hero.mode = "frame-sequence"`, the website renders these frames smoothly onto an accelerated HTML5 Canvas synchronized with GSAP ScrollTrigger. If frames are missing, a development fallback is seamlessly displayed.
