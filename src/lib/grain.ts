// Pre-rendered PNG of the fractalNoise SVG. Cheaper to raster than an inline
// SVG <feTurbulence> filter, especially on mobile GPUs.
export const GRAIN_URL = "url('/grain.png')"
